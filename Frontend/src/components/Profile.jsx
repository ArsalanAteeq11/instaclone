import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserProfile } from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, BookMarked, MessageCircle } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { updateFollowers, updateFollowing } from "@/redux/authSlice";

const Profile = () => {
  const [activeTab, setActivetab] = useState("posts");
  const { id } = useParams();
  const dispatch = useDispatch();
  getUserProfile(id);
  const { userProfile, user } = useSelector((store) => store.user);

  const handleTabChange = (tab) => {
    setActivetab(tab);
  };

  const isFollowing = user?.following?.includes(id);
  const loggedInUser = user?.userId === id;

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const followOrUnfollowHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/user/followorunfollow/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(updateFollowing(id));
        dispatch(updateFollowers(user?.userId));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("displayedPost", displayedPost);
  return (
    <div className="flex justify-center max-w-5xl mx-auto pl-10 my-6">
      <div className="flex flex-col gap-20 pl-20 pt-10">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-40 h-40 ">
              <AvatarImage
                className="object-cover"
                src={userProfile?.profilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{userProfile?.username}</span>
              {user.userId === userProfile?._id ? (
                <>
                  <Link to="/account/edit">
                    <Button variant="secondary" className="h-9 cursor-pointer">
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant="secondary" className="h-9 cursor-pointer">
                    View Archive
                  </Button>
                  <img
                    src="https://yt3.googleusercontent.com/ytc/AIdro_lg7e2xDmfDt1xA9PPYy_HG8IU1OzYwvdBPXlWMHSeak9M=s160-c-k-c0x00ffffff-no-rj"
                    alt=""
                    className="w-6 h-6 cursor-pointer bg-transparent"
                  />
                </>
              ) : (
                <>
                  {user?.following?.includes(id) ? (
                    <Button
                      variant="secondary"
                      className="h-9 cursor-pointer text-md "
                      onClick={followOrUnfollowHandler}
                    >
                      Following
                      <FaAngleDown className="pl-1 font-thin text-gray-900" />
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="h-9 cursor-pointer bg-blue-500 text-white text-md hover:bg-blue-600"
                      onClick={followOrUnfollowHandler}
                    >
                      Follow
                    </Button>
                  )}
                  <Link to='/chat'>
                  <Button variant="secondary" className="h-9 cursor-pointer">
                    Message
                  </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-10 my-8">
              <p className="text-lg">
                <span className="font-bold pr-1">
                  {userProfile?.posts?.length}
                </span>
                posts
              </p>
              <p className="text-lg">
                <span className="font-bold pr-1">
                  {userProfile?.followers?.length}
                </span>
                followers
              </p>
              <p className="text-lg">
                <span className="font-bold pr-1">
                  {userProfile?.following?.length}
                </span>
                following
              </p>
            </div>
            <div className="flex flex-col">
              <Badge className="w-fit my-1" variant="secondary">
                <AtSign className="pr-1" />
                {userProfile?.username}
              </Badge>
              <span>{userProfile?.bio}</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold mt-3">
                {userProfile?.name.toUpperCase()}
              </h1>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-400">
          {isFollowing || loggedInUser ? (
            <>
              {" "}
              <div className="flex items-center justify-center gap-10">
                <span
                  className={`my-3 text-gray-600 cursor-pointer hover:border-b border-b-gray-600 ${
                    activeTab === "posts"
                      ? "font-bold border-b border-b-gray-600"
                      : ""
                  }`}
                  onClick={() => handleTabChange("posts")}
                >
                  POSTS{" "}
                </span>
                <span
                  className={`my-3 text-gray-600 cursor-pointer hover:border-b border-b-gray-600 ${
                    activeTab === "saved"
                      ? "font-bold border-b border-b-gray-600"
                      : ""
                  }`}
                  onClick={() => handleTabChange("saved")}
                >
                  SAVED
                </span>
              </div>
              <div>
                {displayedPost?.length === 0 ? (
                  <div className="flex items-center justify-center mt-14 ml-30">
                    <div className="flex flex-col items-center justify-center">
                      <img className="w-30 h-30" src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRYG_p-6wUBUpSzEVjkLpw1l3FKjk2VKirKV8qAY89SVkiRk6TD" alt="" />
                      <h1 className="text-4xl font-extrabold">No Posts Yet</h1>
                    </div>
                  </div>
                ) : (
                  displayedPost?.map((post) => {
                    return (
                      <div key={post?._id} className="grid grid-cols-3 gap-1">

                      <div
                        
                        className="relative group cursor-pointer "
                      >
                        <img
                          src={post?.image}
                          alt=""
                          className="rounded-sm w-full object-cover aspect-square my-2 "
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center text-white space-x-4">
                            <button className="flex items-center gap-2 hover:text-gray-300">
                              <FaHeart />
                              <span>{post?.likes?.length}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-gray-300">
                              <MessageCircle size={"19px"} />
                              <span>{post?.comments?.length}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center flex-col gap-6 ">
                  <div className="flex items-center gap-5">
                    <img
                      className="h-12 w-12"
                      src="https://pic.onlinewebfonts.com/thumbnails/icons_186750.svg"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold text-lg">
                        This account is private
                      </p>
                      <p className="text-md text-gray-500">
                        Follow to see their photos and videos.
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="h-9 cursor-pointer bg-blue-500 text-white text-md hover:bg-blue-600"
                      onClick={followOrUnfollowHandler}
                    >
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
