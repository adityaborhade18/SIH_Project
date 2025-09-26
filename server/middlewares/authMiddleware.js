import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
