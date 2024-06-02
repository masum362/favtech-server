import { ObjectId } from "mongodb";
import { usersCollection } from "../db/connection.js";

const registerUser = async (req, re) => {
  try {
    const user = req.body;

    const isAlreadyRegistered = await usersCollection.findOne({
      uid: user.uid,
    });
    if (isAlreadyRegistered) {
      return res.status(403).json({ message: "Already Registered" });
    }
    const response = await usersCollection.insertOne(user);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};

export { registerUser };
