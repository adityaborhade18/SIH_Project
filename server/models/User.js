// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    address: {
      type: String,
    },

    // ✅ LINKED ISSUES (stores complete issue information)
    issues: [
      {
        issueId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Issue",
        },
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        status: {
          type: String,
          default: "Pending",
        },
        priority: {
          type: String,
          enum: ["Low", "Medium", "High"],
          default: "Low",
        },
        image: {
          type: String,
        },
        address: {
          type: String,
        },
        location: {
          type: {
            type: String,
            enum: ["Point"],
          },
          coordinates: {
            type: [Number], // [lng, lat]
          },
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// 🔐 Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
