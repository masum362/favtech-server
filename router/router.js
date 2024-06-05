import express from "express";
import { loginUser, registerUser ,isAdminUser} from "../controllers/userController.js";
import { verifyToken } from "./auth.js";

const router = express.Router();


router.get("/",(req, res )=> {
    console.log("called home");
    res.send("Welcome to the home page");
})

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/users/admin/:id",verifyToken,isAdminUser)
router.get("/users/moderator/:id",verifyToken,isAdminUser)


export default router;