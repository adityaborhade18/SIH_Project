import Issue from "../models/issue.js";
import User from '../models/User.js';
import mongoose from 'mongoose'
import { GoogleGenerativeAI } from "@google/generative-ai";
import cloudinary from "../config/cloudinary.js";
import nodemailer from "nodemailer";



// POST: Report issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, priority, location } = req.body;
    const userId = req.user.id;

    // Validate required fields
    // if (!title || !description || !location) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Title (issue type), description, and location are required",
    //   });
    // }

    if (!title || !description || (!location && !req.body.address)) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and (location or address) are required",
      });
    }

    // Parse location JSON if it's a string
    let locationData;
    try {
      locationData = typeof location === "string" ? JSON.parse(location) : location;
    } catch {
      return res.status(400).json({ success: false, message: "Invalid location format" });
    }

    // Validate coordinates
    if (!Array.isArray(locationData.coordinates) || locationData.coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: "Coordinates must be [lng, lat]" });
    }

    // const imageUrl = req.file ? req.file.path : null;
    let imageUrl = null;

    // ✅ NORMAL FLOW (multer)
    if (req.file) {
      imageUrl = req.file.path;
    }

    // ✅ OFFLINE FLOW (base64)
    else if (req.body.imageBase64) {
      try {
        const result = await cloudinary.uploader.upload(
          req.body.imageBase64,
          {
            folder: "civic-issues"
          }
        );
        imageUrl = result.secure_url;
      } catch (err) {
        console.log("Cloudinary base64 upload error", err);
      }
    }
    let finalTitle = title.trim();
    let finalDepartment = "Other";

    // AI Classification
    if (imageUrl) {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Skipping AI classification.");
      } else {
        try {
          console.log("Analyzing image with Gemini...");
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

          // Fetch image from Cloudinary/URL
          const imageResp = await fetch(imageUrl);
          const arrayBuffer = await imageResp.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString('base64');

          const prompt = `Analyze this civic issue image.
            Classify it into EXACTLY ONE of these departments: 'Sanitation', 'Roads', 'Electricity', 'Water', 'PublicHealth', 'Other'.
            Also provide a short, descriptive title (max 5-6 words) for the issue (e.g., 'Large Pothole', 'Overflowing Garbage Bin', 'Broken Street Light').

            Return ONLY a raw JSON object with no markdown formatting:
            {
              "department": "...",
              "title": "..."
            }`;

          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: base64Image,
                mimeType: req.file.mimetype || "image/jpeg"
              }
            }
          ]);

          const responseText = result.response.text();
          console.log("Gemini Raw Response:", responseText);

          // Robust JSON parsing
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const aiData = JSON.parse(jsonMatch[0]);
            if (aiData.department) finalDepartment = aiData.department;
            if (aiData.title) finalTitle = aiData.title;
            console.log("AI Result:", { finalTitle, finalDepartment });
          } else {
            console.warn("Could not parse JSON from Gemini response");
          }

        } catch (aiError) {
          console.error("AI Classification failed:", aiError);
        }
      }
    }

    // If no AI or AI failed (still "Other"), try keyword matching on title
    if (finalDepartment === "Other") {
      const t = finalTitle.toLowerCase();
      if (t.includes('garbage') || t.includes('waste') || t.includes('dump') || t.includes('clean') || t.includes('dustbin')) finalDepartment = 'Sanitation';
      else if (t.includes('road') || t.includes('pothole') || t.includes('traffic') || t.includes('street')) finalDepartment = 'Roads';
      else if (t.includes('light') || t.includes('power') || t.includes('electric') || t.includes('pole') || t.includes('wire')) finalDepartment = 'Electricity';
      else if (t.includes('water') || t.includes('leak') || t.includes('pipe') || t.includes('drain')) finalDepartment = 'Water';
      else if (t.includes('health') || t.includes('mosquito') || t.includes('dengue') || t.includes('malaria') || t.includes('doctor') || t.includes('clinic')) finalDepartment = 'PublicHealth';
    }

    // Ensure department is valid enum
    const validDepts = ["Sanitation", "Roads", "Electricity", "Water", "PublicHealth", "StreetLight", "Other"];
    if (!validDepts.includes(finalDepartment)) finalDepartment = "Other";

    // Check for duplicate issue of same type within 100 meters
    const duplicate = await Issue.findOne({
      title: finalTitle, // check duplicates by issue type
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: locationData.coordinates, // [lng, lat]
          },
          $maxDistance: 100, // meters
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `A similar ${title} issue has already been reported nearby`,
        duplicate,
      });
    }

    const SLA_RULES = {
      Water: 24,
      Roads: 72,
      Electricity: 12,
      Sanitation: 12,
      PublicHealth: 48,
      StreetLight: 72,
      Other: 70
    };

    const now = new Date();
    const slaHours = SLA_RULES[finalDepartment] || 48;

    const slaDeadline = new Date(
      now.getTime() + slaHours * 60 * 60 * 1000
    );

    // Create new issue
    const issue = new Issue({
      title: finalTitle,
      department: finalDepartment,
      description: description.trim(),
      priority: priority || "Low",
      location: {
        type: "Point",
        coordinates: locationData.coordinates, // [lng, lat]
      },
      address: locationData.address || req.body.address || "",
      image: imageUrl,
      createdBy: userId,
      slaDeadline: slaDeadline,
    });

    await issue.save();

    // Save complete issue information in user collection
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          issues: {
            issueId: issue._id,
            title: issue.title,
            department: issue.department,
            description: issue.description,
            status: issue.status,
            priority: issue.priority,
            image: issue.image,
            address: issue.address,
            location: issue.location,
            createdAt: issue.createdAt,
          }
        }
      },
      { new: true }
    );

    if (!userUpdate) {
      // If user update fails, we should ideally rollback the issue creation
      // For now, log the error but still return success for the issue
      console.error("Failed to update user's issues array for userId:", userId);
    }

    return res.status(201).json({
      success: true,
      message: "Issue reported successfully! Assigned to " + finalDepartment,
      issue,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

//   



// GET: All issues with user information
export const getAllIssue = async (req, res) => {
  try {
    const { department } = req.query;
    console.log("dep.......", req.query);
    const filter = {};
    if (department) filter.department = department;

    const issues = await Issue.find(filter)
      .populate('createdBy', 'name email address')
      .sort({ createdAt: -1 });

    const updatedIssues = issues.map(issue => {
      const obj = issue.toObject();

      if (
        obj.slaDeadline &&
        new Date() > new Date(obj.slaDeadline) &&
        obj.status !== "Resolved"
      ) {
        obj.isDelayed = true;
      }

      return obj;
    });
    res.status(200).json({ success: true, issues });

  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Issue by ID with user information
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email address'); // Populate user info
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }
    res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




// GET: Current user's issues
export const getUserIssues = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("USER ID:", userId);

    const allIssues = await Issue.find();
    console.log("ALL ISSUES:", allIssues.length);

    const issues = await Issue.find({ createdBy: userId });
    console.log("MATCHED ISSUES:", issues.length);

    const updatedIssues = issues.map(issue => {
      const obj = issue.toObject();

      if (
        obj.slaDeadline &&
        new Date() > new Date(obj.slaDeadline) &&
        obj.status !== "Resolved"
      ) {
        obj.isDelayed = true;
      }

      return obj;
    });

    res.status(200).json({ success: true, userIssues: issues });

  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId)
      .select('-password'); // exclude password
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST: Update issue status
export const updateIssueStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ success: false, message: "Issue ID and status are required" });
    }

    let proofImageUrl = null;
    if (status === "Resolved" && req.file) {
      proofImageUrl = req.file.path; // Multer-Cloudinary handles upload
    }

    const updateFields = { status };
    if (proofImageUrl) {
      updateFields.proofImage = proofImageUrl;
    }

    // 1. Update the Issue document
    const issue = await Issue.findByIdAndUpdate(id, updateFields, { new: true }).populate("createdBy");
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    // 2. Update the status in the User's issues array
    await User.updateOne(
      { "issues.issueId": id },
      { $set: { "issues.$.status": status } }
    );

    // 3. Send Email if Resolved and email exists
    if (status === "Resolved" && proofImageUrl && issue.createdBy && issue.createdBy.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: issue.createdBy.email,
          subject: "Your Issue Has Been Resolved ✅",
          html: `
            <h2>Issue Resolved Successfully ✅</h2>
            <p><b>Title:</b> ${issue.title}</p>
            <p><b>Description:</b> ${issue.description}</p>
            <p><b>Status:</b> Resolved</p>
            <p><b>Location:</b> ${issue.address || "Location not provided"}</p>
            
            <h3>Before:</h3>
            ${issue.image ? `<img src="${issue.image}" width="300"/>` : "<p>No before image provided.</p>"}
            
            <h3>After:</h3>
            <img src="${issue.proofImage}" width="300"/>
            
            <p>Thank you for reporting the issue!</p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Resolution email sent successfully to ${issue.createdBy.email}`);
      } catch (err) {
        console.error("Failed to send resolution email:", err);
      }
    }

    res.status(200).json({ success: true, message: "Status updated successfully", issue });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const calculatePriority = (issue) => {
  const days = (Date.now() - issue.createdAt) / (1000 * 60 * 60 * 24);

  return (
    issue.likes * 2 +
    issue.escalationLevel * 10 +
    days * 1.5
  );
};



export const likeIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user._id;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }



    if (issue.likedBy.some(id => id.toString() === userId.toString())) {
      return res.status(400).json({ message: "Already liked" });
    }

    // ✅ Add like
    issue.likes += 1;
    issue.likedBy.push(userId);

    await issue.save();

    res.json({
      message: "Liked successfully",
      likes: issue.likes,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error liking issue" });
  }
};

export const getMapIssues = async (req, res) => {
  const issues = await Issue.find();

  const features = await Promise.all(
    issues.map(async (issue) => {
      const [lng, lat] = issue.location.coordinates;

      let area = "Unknown";

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();

        area =
          data.address?.suburb ||
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          "Unknown";
      } catch (err) {
        console.log("Reverse geocode error");
      }

      return {
        type: "Feature",
        geometry: issue.location,
        properties: {
          id: issue._id,
          title: issue.title,
          likes: issue.likes,
          priority: issue.priorityScore,
          escalation: issue.escalationLevel,
          status: issue.status,
          area: area
        }
      };
    })
  );

  res.json({
    type: "FeatureCollection",
    features
  });
};

export const getIssuesByArea = async (req, res) => {
  const { area } = req.params;

  const issues = await Issue.find({ area }).sort({ priorityScore: -1 });

  res.json(issues);
};


export const getNearbyIssues = async (req, res) => {
  try {
    const { lng, lat } = req.query;
    console.log("lng", lng);
    console.log("lat", lat);
    const userId = req.user?._id;

    const issues = await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 3000
        }
      }
    });

    const updated = issues.map(issue => ({
      ...issue._doc,
      liked: userId ? issue.likedBy.includes(userId) : false
    }));

    res.json(updated);
    console.log("updated", updated);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching nearby issues" });
  }
};