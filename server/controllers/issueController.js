import Issue from "../models/issue.js";

// POST: Report issue

export const createIssue = async (req, res) => {
  try {
    // Parse the fields from form-data
    const { title, description, priority, location } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: "Title is required" 
      });
    }

    if (!description) {
      return res.status(400).json({ 
        success: false, 
        message: "Description is required" 
      });
    }

    // With CloudinaryStorage, the file URL is available in req.file.path
    const imageUrl = req.file ? req.file.path : null;

    // Parse location if it's a JSON string
    let locationString = location;
    try {
      if (location && typeof location === 'string') {
        const locationData = JSON.parse(location);
        locationString = JSON.stringify(locationData);
      }
    } catch (parseError) {
      // If parsing fails, keep it as is
      locationString = location;
    }

    // Create the issue
    const issue = new Issue({
      title: title.trim(),
      description: description.trim(),
      priority: priority || "Low",
      location: locationString,
      image: imageUrl,
    });

    await issue.save();

    res.status(201).json({
      success: true,
      message: "Issue reported successfully!",
      issue: {
        id: issue._id,
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        location: issue.location,
        status: issue.status,
        image: issue.image,
        createdAt: issue.createdAt
      },
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error" 
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

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



