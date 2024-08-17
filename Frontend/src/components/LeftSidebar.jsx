import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPost, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const [isActive,setIsActive] = useState("Home")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const {notification} = useSelector(store=>store.realTimeNotification)
  const [open, setOpen] = useState(false);

  const sidebarItem = [
    { icon: <Home className="w-8 h-8" />, text: "Home" },
    { icon: <Search className="w-8 h-8" />, text: "Search" },
    { icon: <TrendingUp className="w-8 h-8" />, text: "Trending" },
    { icon: <MessageCircle className="w-8 h-8" />, text: "Messages" },
    { icon: <Heart className="w-8 h-8" />, text: "Notifications" },
    { icon: <PlusSquare className="w-8 h-8" />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user?.profilePicture}
            className="object-cover w-full h-full"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut className="w-8 h-8" />, text: "Logout" },
  ];

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/logout", {
        withCredentials: true,
      });
      dispatch(setUser(null));
      dispatch(setSelectedPost(null))
      dispatch(setPost([]))
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const sidebarHandler = (typetext) => {
    if (typetext === "Logout") {
      logoutHandler();
    } else if (typetext === "Create") {
      setOpen(true);
      setIsActive("Create")
    } else if (typetext === "Profile") {
      setIsActive("Profile")
      navigate(`/profile/${user?.userId}`);
    } else if (typetext === "Home") {
      setIsActive("Home")
      navigate("/");
    }else if(typetext === "Messages"){
      setIsActive("Messages")
       navigate('/chat')
    }
  };
  return (
    <div className="flex flex-col fixed top-0 left-0 w-[18%] z-10 border-r border-gray-300 h-full">
      <div
        className="px-4 py-10"
        
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxCl4AJyJtz8xnJgKEGYdFaFk9pC86Nr3uw&s"
          className="w-40 cursor-pointer pb-6" onClick={() => {
            navigate("/");
          }}
          alt=""
        />
        {sidebarItem.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}

              className={`flex items-center gap-3 relative ${isActive === item.text ? "bg-gray-100 rounded-lg" : "" } hover:bg-gray-100 rounded-lg cursor-pointer px-3 py-2`}
            >
              {item.icon}
              <span className="text-lg font-semibold py-2">{item.text}</span>

              {
                item.text === "Notifications" && notification.length > 0 && (
                  <Popover>
                    <PopoverTrigger>
                      <Button size='icon' className='rounded-full h-5 w-5 absolute bottom-7 left-7 bg-red-600 hover:bg-red-600'>{notification.length}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {
                          notification.length === 0 ? (
                            <p>No new notifications</p>
                          ) : (
                            notification.map((n)=>{
                               return(
                                <div key={n.userId} className="flex items-center gap-2">
                                  <Avatar>
                                    <AvatarImage src={n.userDetail.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm"><span className="font-bold">{n.userDetail.username} </span>Liked your post</p>
                                </div>
                               )
                            })
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              }
            </div>


          );
        })}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
