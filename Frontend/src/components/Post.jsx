import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { MdOutlineBookmark } from "react-icons/md";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPost, setSelectedPost } from "@/redux/postSlice";
import { updatebookmark } from "@/redux/authSlice";
import { Badge } from "./ui/badge";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post?.likes?.length || false);
  const [comment, setComment] = useState(post.comments);
  const { user } = useSelector((store) => store.user);
  const { posts } = useSelector((store) => store.posts);

  const dispatch = useDispatch();

  const changeEventhandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislikepost" : "likepost";
      const res = await axios.get(
        `http://localhost:8080/post/${action}/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);

        // post ko update karna

        const updatedPostLike = posts.map((p) =>
          p?._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user.userId)
                  : [...p.likes, user.userId],
              }
            : p
        );
        dispatch(setPost(updatedPostLike));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/post/addcomment/${post?._id}`,
        { text },
        {
          header: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res);
      if (res.data.success) {
        const updateCommentData = [...comment, res.data.comment];
        setComment(updateCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updateCommentData } : p
        );
        dispatch(setPost(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);

      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/post/bookmark/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(updatebookmark(post?._id));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/post/deletepost/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPost(updatedPost));
        // dispatch(updatePosts(post?._id))
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  const addEmoji = (emoji) => {
    const cursorPosition = textInputRef.current.selectionStart;
    const newText =
      text.slice(0, cursorPosition) + emoji.native + text.slice(cursorPosition);
    setText(newText);

    // Set the cursor position after the emoji
    setTimeout(() => {
      textInputRef.current.selectionStart =
        cursorPosition + emoji.native.length;
      textInputRef.current.selectionEnd = cursorPosition + emoji.native.length;
      textInputRef.current.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commentHandler();
    }
  };

  const isfollowing = post?.author?.followers?.includes(user?.userId);
  return (
    <div className="my-8 w-full max-w-lg mx-auto border-b border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post?.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1>{post?.author?.username}</h1>
            {user?.userId === post?.author?._id && (
              <Badge variant="secondray">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-center">
            {user && user?.userId === post?.author?._id ? (
              <Button
                variant="ghost"
                className="cursor-pointer w-full text-[#ed4956] font-bold text-lg border-b border-gray-300"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="cursor-pointer w-full text-[#ed4956] font-bold text-lg border-b border-gray-300"
              >
                {isfollowing ? "following " : "follow"}
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer  w-full border-b border-gray-300"
            >
              Add to favourites
            </Button>
            <Button variant="ghost" className="cursor-pointer ">
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="my-2 w-full rounded-sm object-cover aspect-square "
        src={post?.image}
        alt=""
      />
      <div className="flex items-center justify-between my-0">
        <div className="flex gap-3">
          {liked ? (
            <FaHeart
              size={"21px"}
              color="red"
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"21px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikeHandler}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        {user?.bookmarks.includes(post?._id) ? (
          <MdOutlineBookmark
            size={"24px"}
            className="cursor-pointer"
            onClick={bookmarkHandler}
          />
        ) : (
          <Bookmark
            className="cursor-pointer hover:text-gray-600"
            onClick={bookmarkHandler}
          />
        )}
      </div>

      <span className="font-medium block my-1">
        {post?.likes?.length} likes
      </span>
      <p className="my-2">
        <span className="font-medium mr-2">{post?.author?.username}</span>
        {post?.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-gray-400 text-md mt-2"
        >
          {` View all ${post?.comments?.length} comments`}
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <br />
      <div className="flex items-center justify-between">
        <input
          ref={textInputRef}
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventhandler}
          onKeyDown={handleKeyDown}
          className="border-none outline-none mb-4 w-full"
        />
        <div className="flex items-center relative">
          {text && (
            <span
              onClick={commentHandler}
              className="text-[#3BADF8] flex items-center mb-4 hover:text-blue-950 font-medium cursor-pointer"
            >
              Post
            </span>
          )}

          <span className="cursor-pointer pl-2 mb-4">
            <HiOutlineEmojiHappy
              color="gray"
              size={"18px"}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="cursor-pointer"
            />
            {showEmojiPicker && (
              <div
                style={{ position: "absolute", bottom: "60px", left: "10px" }}
              >
                <Picker data={data} onEmojiSelect={addEmoji} />
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;
