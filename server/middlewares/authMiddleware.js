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

export const authenticateAdmin = (req, res, next) => {
  const token = req.cookies?.sellertoken;

  if (!token) return res.json({ success: false, message: "Access denied. No admin token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Contains { email, role } where role is the department
    next();
  } catch (err) {
    return res.json({ success: false, message: "Invalid or expired admin token." });
  }
};
