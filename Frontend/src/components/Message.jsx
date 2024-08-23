import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import getAllMessages from "@/hooks/useGetAllMessages";
import getRTM from "@/hooks/useGetRTM";

const Message = ({ selectedUser }) => {
  getRTM();
  getAllMessages();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.user);

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  return (
    <div className=" flex-1 overflow-y-auto p-4">
      <div className="flex justify-center mt-5">
        <div className="flex flex-col items-center justify-center ">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold mt-2">{selectedUser?.name}</h1>
          <span className="flex items-center mb-4">
            {selectedUser?.username}
            <span className="px-1">.</span>instagram
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button variant="secondary">view profile</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages?.map((msg) => {
            return (
              <div
                key={msg?._id}
                className={`flex ${
                  msg.senderId === user?.userId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.senderId === user?.userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}

        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default Message;
