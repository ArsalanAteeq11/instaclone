import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  addcomment,
  addNewPost,
  bookmark,
  deletePost,
  disLikePost,
  getAllPost,
  getPostsComments,
  getUserPost,
  likePost,
} from "../controllers/postController.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/addnewpost", isAuth, upload.single("image"), addNewPost);
router.get("/allpost", isAuth, getAllPost);
router.get("/userpost/:id", getUserPost);
router.get("/likepost/:id", isAuth, likePost);
router.get("/dislikepost/:id", isAuth, disLikePost);
router.post("/addcomment/:id", isAuth, addcomment);
router.get("/postComment/:id", getPostsComments);
router.delete("/deletepost/:id", isAuth, deletePost);
router.get("/bookmark/:id", isAuth, bookmark);

export default router;
