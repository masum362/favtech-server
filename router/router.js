import express from "express";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();


router.get("/",(req, res )=> {
    console.log("called home");
    res.send("Welcome to the home page");
})

router.get("/register",registerUser)


export default router;