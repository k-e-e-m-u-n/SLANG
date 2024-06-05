import express from "express";
const router = express.Router()
import { signUp,signIn } from "../../controllers/auth.Controller.js";

router.post("/register",signUp)
router.post("/login", signIn)

export default router;
