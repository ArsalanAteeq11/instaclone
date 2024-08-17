import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const getAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:8080/post/allpost", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPost(res.data.posts));
          console.log(res.data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};
