import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPost, setSelectedPost } from "@/redux/postSlice";
import { toast } from "sonner";
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen }) => {
  const { posts, selectedPost } = useSelector((store) => store.posts);
  const {user } = useSelector((store) => store.user);
  console.log("selectedPost",selectedPost)
  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventhandler = (e) => {
    const inputText = e.target.value;
    console.log(inputText);
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/post/addcomment/${selectedPost?._id}`,
        { text },
        {
          header: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updateCommentData = [...comment, res.data.comment];
        setComment(updateCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updateCommentData } : p
        );
        const updatedSelectedPostData = selectedPost
          ? { ...selectedPost, comments: updateCommentData }
          : selectedPost;
        dispatch(setSelectedPost(updatedSelectedPostData));

        dispatch(setPost(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);

      console.log(error);
    }
  };

  const isfollowing = selectedPost?.author?.followers?.includes(user?.userId)


  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-3xl p-0 flex flex-col"
        >
          <div className="flex flex-1">
            <div
              className="w-1/2
            "
            >
              <img
                className=" w-full h-full rounded-l-lg object-cover"
                src={selectedPost?.image}
                alt=""
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between py-4 px-3  border-b border-gray-3000">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-semibold text-md">
                      {selectedPost?.author?.username}
                    </h1>
                    <p className="text-sm text-gray-500">{selectedPost?.bio}</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-center">
                    {selectedPost && selectedPost?.author?._id === user?.userId ? (<div className="cursor-pointer w-full text-[#ed4956] font-bold text-lg border-b pb-2">
                      Delete
                    </div>):(<div className="cursor-pointer w-full text-[#ed4956] font-bold text-lg border-b pb-2">
                      {isfollowing ? "following": "follow"}
                    </div>)}
                    
                    <div className="cursor-pointer w-full border-b pb-2">
                      Add to favourites
                    </div>
                    <div className="cursor-pointer pb-2">Cancel</div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1 overflow-y-auto px-3 max-h-96 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
                {selectedPost &&
                  selectedPost.comments.map((comment) => (
                    <Comment key={comment?._id} comment={comment} />
                  ))}
              </div>
              <div className="border-t border-gray-400 flex items-center justify-between px-3 py-2 ">
                <div className="flex items-center gap-2">
                  <span className="cursor-pointer mb-2">
                    <HiOutlineEmojiHappy color="black" size={"22px"} />
                  </span>
                  <input
                    type="text"
                    placeholder="Add a message..."
                    value={text}
                    onChange={changeEventhandler}
                    className="border-none outline-none mb-2"
                  />
                </div>

                <Button
                  disabled={!text.trim()}
                  className={`${
                    text ? "text-[#3BADF8]" : "text-blue-100"
                  } flex items-center mb-2 hover:text-blue-950 font-medium cursor-pointer bg-transparent hover:bg-transparent text-lg`}
                  onClick={commentHandler}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
