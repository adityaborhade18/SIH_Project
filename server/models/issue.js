import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },      
  description: { type: String, required: true },
  image: { type: String },                      
  location: { type: String, required: true },
  status: { type: String, default: "Pending" }, 
  createdAt: { type: Date, default: Date.now }
},{timestamps:true});

export default mongoose.model("Issue", issueSchema);
