import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import Rightidebar from "./Rightidebar";
import { getAllPost } from "@/hooks/useGetAllpost";
import { getSuggestedUsers } from "@/hooks/useSuggestedUser";

const Home = () => {
  getAllPost();
  getSuggestedUsers()

  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <Rightidebar />
    </div>
  );
};

export default Home;
