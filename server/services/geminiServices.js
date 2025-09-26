// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// services/geminiServices.js

import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * Fetches image from URL and converts it to base64 for Gemini
 * @param {string} imageUrl - Cloudinary URL
 * @returns {string} base64 encoded image
 */
const getBase64FromUrl = async (imageUrl) => {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary").toString("base64");
};

/**
 * Validate if the image is a civic issue
 * @param {string} imageUrl
 * @returns {string} "Yes" or "No"
 */
export const validateImage = async (imageUrl) => {
  const base64Image = await getBase64FromUrl(imageUrl);

  const imageData = {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg"
    }
  };

  const prompt = "Does this image represent a civic issue (pothole, garbage, water leakage, broken streetlight, etc.)? Reply only Yes or No.";

  const result = await model.generateContent([prompt, imageData]);
  return result.response.text().trim();
};

/**
 * Classify the department for the civic issue
 * @param {string} imageUrl
 * @returns {string} Department name
 */
export const classifyDepartment = async (imageUrl) => {
  const base64Image = await getBase64FromUrl(imageUrl);

  const imageData = {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg"
    }
  };

  const prompt = "Classify this civic issue image into one department: Roads, Water, Electrical, Sanitation, Parks. Reply only with the department name.";

  const result = await model.generateContent([prompt, imageData]);
  return result.response.text().trim();
};
