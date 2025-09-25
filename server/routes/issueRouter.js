import express from "express";
import { createIssue, getAllIssue, getIssueById } from "../controllers/issueController.js";
import upload from "../config/multer.js"; 

const issueRouter = express.Router();

issueRouter.post('/createissue', upload.single("image"), createIssue);
issueRouter.get('/getallissue', getAllIssue);
issueRouter.get('/issue/:id', getIssueById);

export default issueRouter;
