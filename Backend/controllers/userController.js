import { User } from "../models/userSchema.js";
import bcrypyjs from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/postSchema.js";

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required!", success: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "User already exist!", success: false });
    }
    const hashPassword = await bcrypyjs.hash(password, 10);

    await User.create({
      name,
      username,
      email,
      password: hashPassword,
    });
    return res
      .status(200)
      .json({ message: "User created successfuly!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required!", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password!", success: false });
    }

    const isMatch = await bcrypyjs.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password!", success: false });
    }

    const token = await jwt.sign(
      { userId: user._id },
      process.env.SECRET_TOKEN,
      { expiresIn: "1d" }
    );

    const populatePosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post?.author?.equals(user._id)) {
          return post;
        }

        console.log(post);
        return null;
      })
    );
    user = {
      userId: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts,
      bookmarks: user.bookmarks,
      gender: user.gender,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ message: `Welcome back ${user.username}`, success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (_, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "User logged out succsesfully!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(loggedInUserId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated", success: true, user });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUser) {
      return res
        .status(400)
        .json({ message: "Curruntly do not have any user!" });
    }
    return res.status(200).json({ success: true, user: suggestedUser });
  } catch (error) {
    console.log(error);
  }
};

export const followorUnfollow = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (loggedInUserId === userId) {
      return res
        .status(400)
        .json({ message: "You can not follow or unfollow yourself" });
    }

    if (!loggedInUser || !user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isFollowing = loggedInUser.following.includes(userId);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: loggedInUserId },
          { $pull: { following: userId } }
        ),
        User.updateOne(
          { _id: userId },
          { $pull: { followers: loggedInUserId } }
        ),
      ]);
      return res.status(200).json({
        message: `${loggedInUser.username} unfollow to ${user.username}`,
        success: true,
      });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: loggedInUserId },
          { $push: { following: userId } }
        ),
        User.updateOne(
          { _id: userId },
          { $push: { followers: loggedInUserId } }
        ),
      ]);
      return res.status(200).json({
        message: `${loggedInUser.username} just follow to ${user.username}`,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
