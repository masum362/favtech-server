import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

const verifyToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] || "";

  if (!token) res.status(403).json({ message: "Invalid token" });
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) res.status(403).json({ message: error.message });
    req.userId = decoded.id;
    console.log(decoded);
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const userId = req.userId;
  const { id } = req.params;
  if (userId === id) {
    return res.status(403).json({ message: "Invalid user" });
  }
  const query = { uid: id };
  const user = await userModel.findOne(query);
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

const verifyModerator = async (req, res, next) => {
  const userId = req.userId;
  const { id } = req.params;
  if (userId === id) {
    return res.status(403).json({ message: "Invalid user" });
  }
  const query = { uid: id };
  const user = await userModel.findOne(query);
  const isAdmin = user?.role === "moderator";
  if (!isAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

export { verifyToken,verifyAdmin,verifyModerator};
