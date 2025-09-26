import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import issueRouter from "./routes/issueRouter.js";
import AdminRouter from "./routes/adminRouter.js";


const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigin=['http://localhost:3000']

// Connect to Database
connectDB();

// Middleware
app.use(cors({origin:allowedOrigin,credentials:true}));
app.use(express.json()); 
app.use("/uploads", express.static("uploads"));

app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.use('/api/user', userRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/user', issueRouter);





// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

   
