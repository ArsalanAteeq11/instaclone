import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Message from "./Message";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textInputRef = useRef(null);
  const { user, otherUsers, selectedUser } = useSelector((store) => store.user);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/message/send/${id}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log("message", res.data.newMessage);
        dispatch(setMessages([...messages, res?.data?.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addEmoji = (emoji) => {
    const cursorPosition = textInputRef.current.selectionStart;
    const newText =
      textMessage.slice(0, cursorPosition) +
      emoji.native +
      textMessage.slice(cursorPosition);
    setTextMessage(newText);

    // Set the cursor position after the emoji
    setTimeout(() => {
      textInputRef.current.selectionStart =
        cursorPosition + emoji.native.length;
      textInputRef.current.selectionEnd = cursorPosition + emoji.native.length;
      textInputRef.current.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessageHandler(selectedUser?._id);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[18%] h-screen">
      <section className="w-full md:w-1/4">
        <h1 className="font-bold px-3 py-4 mb-4 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <span className="font-bold text-md text-gray-600 pl-3">Messages</span>
        <div className="overflow-y-auto h-[80vh] ">
          {otherUsers.map((otherUser) => {
            const isOnline = onlineUsers.includes(otherUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(otherUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={otherUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1>{otherUser?.username}</h1>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-700"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col h-full">
          <div className="flex px-3 py-3.5 sticky top-0 z-10 border-b border-gray-300 items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex">
              <h1>{selectedUser?.username}</h1>
            </div>
          </div>
          <Message selectedUser={selectedUser} />
          <div className="flex items-center p-3 border-t border-gray-300 relative">
            <HiOutlineEmojiHappy
              color="gray"
              size={"25px"}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="cursor-pointer"
            />
            {showEmojiPicker && (
              <div
                style={{ position: "absolute", bottom: "60px", left: "10px" }}
              >
                <Picker data={data} onEmojiSelect={addEmoji} />
              </div>
            )}
            <input
              ref={textInputRef}
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 mr-2 focus-visible:ring-transparent outline-none ml-1"
              placeholder="Message.."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center mx-auto border-l border-gray-300 h-full">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-bold text-lg">Your messages</h1>
          <p>Send a message to start a chart</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
