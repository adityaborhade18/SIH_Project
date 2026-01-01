import Issue from "../models/issue.js";
import User from '../models/User.js';



// POST: Report issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, priority, location } = req.body;
    const userId = req.user._id;
    console.log("User ID reporting issue:", userId);
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

    // Check for duplicate issue of same type within 100 meters
    const duplicate = await Issue.findOne({
      title, // check duplicates by issue type
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
      title: title.trim(), // this is your issue type
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
    await User.findByIdAndUpdate(userId, {
      $push: {
        issues: {
          issueId: issue._id,
          title: issue.title,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          image: issue.image,
          address: issue.address,
          location: issue.location,
          createdAt: issue.createdAt,
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Issue reported successfully!",
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
// GET: All issues
export const getAllIssue = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Issue by ID
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }
    res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error("Error fetching issue:", error);
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



