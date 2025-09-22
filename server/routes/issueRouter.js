import express from "express"
import { createIssue, getAllIssue } from "../controllers/issueController.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

const issueRouter=express.Router();

issueRouter.post('/createissue',upload.single("image"),createIssue);
issueRouter.get('/getallissue',getAllIssue);

export default issueRouter;