import Issue from "../models/issue.js";
import User from '../models/User.js';
import mongoose from 'mongoose'
import { GoogleGenerativeAI } from "@google/generative-ai";



// POST: Report issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, priority, location } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Title (issue type), description, and location are required",
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

    const imageUrl = req.file ? req.file.path : null;

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
    const validDepts = ["Sanitation", "Roads", "Electricity", "Water", "PublicHealth", "Other"];
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
      address: locationData.address || "",
      image: imageUrl,
      createdBy: userId,
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
// GET: All issues with user information
export const getAllIssue = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = {};
    if (department) filter.department = department;

    const issues = await Issue.find(filter)
      .populate('createdBy', 'name email address')
      .sort({ createdAt: -1 });
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



// export const getIssueById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid issue ID" });
//     }

//     const issue = await Issue.findById(id)
//       .populate("createdBy", "name email address");

//     if (!issue) {
//       return res.status(404).json({ success: false, message: "Issue not found" });
//     }

//     res.status(200).json({ success: true, issue });
//   } catch (error) {
//     console.error("Error fetching issue:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// GET: Current user's issues
export const getUserIssues = async (req, res) => {
  try {
    const userId = req.user.id;


    // Option 1: Get from User collection (embedded documents)
    const user = await User.findById(userId).select('issues');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Option 2: Also get from Issue collection for consistency
    const issues = await Issue.find({ createdBy: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      issues: issues, // Issues from Issue collection
      userIssues: user.issues // Issues from User collection
    });
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



