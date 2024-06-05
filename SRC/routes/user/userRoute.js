import express from "express";
import { deleteAllUsers, deleteSingleUser, getAllUsers, getSingleUser, updateUser } from "../../controllers/user.Controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
const router = express.Router()

router.get("/", getAllUsers)
router.get("/:id", protectRoute,getSingleUser)
router.delete("/delete-all", deleteAllUsers)
router.patch('/update/:id', updateUser)
router.delete("/delete/:id", deleteSingleUser)

export default router