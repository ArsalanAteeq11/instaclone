import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const getAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/message/get/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setMessages(res?.data?.messages));
          console.log(res?.data?.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessages();
  }, [selectedUser]);
};
export default getAllMessages;
