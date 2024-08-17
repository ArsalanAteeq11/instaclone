import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/authSlice";
import { readFileAsDataURL } from "@/lib/utils";

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const [imagePreview, setImagePreview] = useState("");

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const fileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const selectGenderHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    console.log(input);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    formData.append("profilePicture", input.profilePhoto);
    console.log("formData", formData);

    try {
        setLoading(true)
      const res = await axios.post(
        "http://localhost:8080/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPostData = {
            ...user,
            bio:res?.data?.user?.bio,
            gender:res?.data?.user?.gender,
            profilePicture:res?.data?.user?.profilePicture

        }
        dispatch(setUser(updatedPostData));
        navigate(`/profile/${user?.userId}`)
        toast.success(res.data.message);
        console.log("res", res);
      }
    } catch (error) {
      console.log(error);
    }finally{
        setLoading(false)
    }
  };
  const imageRef = useRef();
  return (
    <div className="flex mx-auto max-w-2xl pl-10 my-8 ">
      <section className="flex flex-col w-full gap-6">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-12 h-12">
              <AvatarImage src={imagePreview} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-md">{user?.username}</h1>
              <p
                className="text-xs text-gray-700
              "
              >
                {user?.name.toUpperCase()}
              </p>
            </div>
          </div>
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileHandler}
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-blue-400 text-white hover:bg-blue-500"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            name="bio"
            value={input.bio}
            className="focus-visible:ring-transparent"
            placeholder="bio"
            onChange={(e) => {
              setInput({ ...input, bio: e.target.value });
            }}
          />
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectGenderHandler}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end mt-8">
          {loading ? (
            <Button className=" bg-blue-400 hover:bg-blue-500 text-white w-fit px-4 py-3 text-md">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button disabled={loading}
              className=" bg-blue-400 hover:bg-blue-500 text-white w-fit px-4 py-3 text-md"
              onClick={editProfileHandler}
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
