import express from "express";
import {
  editProfile,
  followorUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile/:id", isAuth, getProfile);
router.post(
  "/profile/edit",
  isAuth,
  upload.single("profilePicture"),
  editProfile
);
router.get("/suggested", isAuth, getSuggestedUsers);
router.get("/followorunfollow/:id", isAuth, followorUnfollow);

export default router;
