import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin=['http://localhost:3000']

// Connect to Database
connectDB();

// Middleware
app.use(cors({origin:allowedOrigin,credentials:true}));
app.use(express.json()); 

// Routes
app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.use('/api/user', userRouter);



// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

   
