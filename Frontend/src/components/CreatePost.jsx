import React, { useRef, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.user)
  const {posts} = useSelector(store=>store.posts)
  const dispatch = useDispatch()
  const fileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };
  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/post/addnewpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if(res?.data?.success){
        dispatch(setPost([res?.data?.post,...posts]))
        setOpen(false)
        toast.success(res.data.message)
      }
      console.log(res);
    } catch (error) {
        toast.error(error?.respoonse?.data?.message);
        console.log(error)
    }finally{
        setLoading(false);

    }
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <div>
            <h1 className="text-lg font-semibold text-center">
              Create new post
            </h1>
          </div>
          <hr />
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" alt='image'/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-sm ">{user?.username}</h1>
              <p className="text-gray-600 text-xs">{user?.bio}</p>
            </div>
          </div>
          <Textarea
            className="focus-visible:ring-transparent border-none"
            placeholder="Write a caption here..."
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
          {imagePreview && (
            <div className="w-full h-64 flex items-center justify-center">
              <img
                src={imagePreview}
                alt=""
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          )}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileHandler}
          />
         
            <Button
              onClick={() => {
                imageRef.current.click();
              }}
              className="w-fit mx-auto bg-blue-500 hover:bg-blue-900"
            >
              Select from computer
            </Button>
          
          {imagePreview &&
            (loading ? (
              <Button className="text-lg bg-blue-500 hover:bg-blue-900 flex items-center justify-center gap-2">
                <Loader2 className=" h-5 w-5 animate-spin"/>
                Please wait...
              </Button>
            ) : (
              <Button
                onClick={createPostHandler}
                className="text-lg"
              >
                Post
              </Button>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
