import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  
  // readable address
  address: { type: String },

  // proper geolocation field
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },
 
  status: { type: String, default: "Pending" },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High"],  
    default: "Low"                    
  }
}, { timestamps: true });

issueSchema.index({ location: "2dsphere" });

export default mongoose.model("Issue", issueSchema);

