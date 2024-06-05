import express from "express";
import { createPost, deletePost, getAllPosts, getSinglePost,likePost,unlikePost } from "../../controllers/post.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
const router = express.Router()


router.post("/add", protectRoute ,createPost)
router.get("/", protectRoute, getAllPosts)
router.get("/:id", protectRoute, getSinglePost)
router.delete("/:id", protectRoute, deletePost)
router.put("/like/:id", protectRoute,likePost)
router.put("/unlike/:id", protectRoute,unlikePost)


export default router