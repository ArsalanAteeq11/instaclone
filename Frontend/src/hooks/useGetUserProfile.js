import { setUserProfile } from "@/redux/authSlice";
import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const getUserProfile = (id) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/user/profile/${id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res?.data?.user));
          console.log(res?.data?.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [id]);
};
