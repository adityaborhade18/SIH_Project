import express from "express";
import { createIssue, getAllIssue, getIssueById, getUserIssues, getMe, updateIssueStatus, likeIssue, getMapIssues, getIssuesByArea } from "../controllers/issueController.js";
import upload from "../config/multer.js";
import { authenticateUser, authenticateAdmin } from "../middlewares/authMiddleware.js";
import { getNearbyIssues } from "../controllers/issueController.js";


const issueRouter = express.Router();

issueRouter.post('/createissue', authenticateUser, upload.single("image"), createIssue);
issueRouter.get('/getallissue', getAllIssue);
issueRouter.get('/issue/:id', getIssueById);
issueRouter.get('/myissues', authenticateUser, getUserIssues); // Get current user's issues
issueRouter.get('/me', authenticateUser, getMe);
issueRouter.post('/update-status', authenticateAdmin, upload.single("proofImage"), updateIssueStatus);
issueRouter.post("/:id/like", authenticateUser, likeIssue);
issueRouter.get("/map", getMapIssues);
issueRouter.get("/area/:area", getIssuesByArea);
issueRouter.get("/nearby", authenticateUser, getNearbyIssues);


export default issueRouter;
