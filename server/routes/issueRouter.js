import express from "express";
import { createIssue, getAllIssue, getIssueById, getMe } from "../controllers/issueController.js";
import upload from "../config/multer.js"; 
import { authenticateUser } from "../middlewares/authMiddleware.js";



const issueRouter = express.Router();

issueRouter.post('/createissue',authenticateUser ,upload.single("image"), createIssue);
issueRouter.get('/getallissue', getAllIssue);
issueRouter.get('/issue/:id', getIssueById);
issueRouter.get('/me',authenticateUser,getMe);

export default issueRouter;
