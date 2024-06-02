import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] || "";

  if (!token) res.status(403).json({ message: "Invalid token" });
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) res.status(403).json({ message: error.message });
    req.userId = decoded.id;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {};

export { verifyToken };
