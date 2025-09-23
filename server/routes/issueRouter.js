import express from "express";
import { createIssue, getAllIssue } from "../controllers/issueController.js";
import upload from "../config/multer.js"; 

const issueRouter = express.Router();

issueRouter.post('/createissue', upload.single("image"), createIssue);
issueRouter.get('/getallissue', getAllIssue);

export default issueRouter;
