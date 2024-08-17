import { getOtherUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const getSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/user/suggested", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(getOtherUsers(res.data.user));
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUser();
  }, []);
};
