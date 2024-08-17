import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateFollowers, updateFollowing, updateOtherUsers } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const Rightidebar = () => {
  const { user, otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const followOrUnfollowHandler = async (id) =>{
    try {
      const res = await axios.get(`http://localhost:8080/user/followorunfollow/${id}`,{withCredentials:true
    
      })
      if (res.data.success) {
        console.log("response" , res)
        dispatch(updateFollowing(id))
        dispatch(updateFollowers(user?.userId))
        dispatch(updateOtherUsers(user?.userId))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className=" w-[25%] my-10 pr-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate(`/profile/${user?.userId}`)}>
          <Link to={`/profile/${user?.userId}`}>
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
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
        <div>
          <span className="text-[#3BADF8] hover:text-gray-900 font-semibold text-md cursor-pointer">
            switch
          </span>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-gray-500 my-6">Suggested for you</h1>
      </div>
      <div>
        {otherUsers &&
          otherUsers.map((otherUser) => {
            console.log(otherUser.followers, "jdfd");
            console.log(otherUser._id, "jdfd");
            return (
              <div
                key={otherUser?._id}
                className="flex items-center justify-between my-5"
              >
                <div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate(`/profile/${otherUser?._id}`)}>
                  <Link to={`/profile/${otherUser?._id}`}>
                    <Avatar>
                      <AvatarImage src={otherUser?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <h1 className="font-semibold text-md">
                      {otherUser?.username}
                    </h1>
                    <p
                      className="text-xs text-gray-700
              "
                    >
                      {otherUser?.name.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div>
                  {user?.following?.includes(otherUser?._id)? ( <span className="text-gray-900 font-semibold text-md cursor-pointer" onClick={()=>followOrUnfollowHandler(otherUser?._id)}>
                    following
                  </span>) : ( <span className="text-[#3BADF8] font-semibold text-md cursor-pointer" onClick={()=>followOrUnfollowHandler(otherUser?._id)}>
                    follow
                  </span>)}
                 
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Rightidebar;
