import express from "express";

import Issue from "../models/issue.js";

// POST: Report issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    const issue = new Issue({
      title,
      description,
      location,
      image: req.file ? req.file.path : null,
    });

    await issue.save();
    res
      .status(201)
      .json({ success: true, message: "Issue reported successfully!", issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: All issues
export const getAllIssue = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json({ success: true, issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




