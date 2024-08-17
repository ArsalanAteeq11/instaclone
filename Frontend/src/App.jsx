import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import SignUp from "./components/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setNotification } from "./redux/rtnSlice";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoute><MainLayout /></ProtectedRoute> ,
    children: [
      {
        path: "/",
        element:<ProtectedRoute> <Home /></ProtectedRoute>,
      },
      {
        path: "/profile/:id",
        element:<ProtectedRoute><Profile /></ProtectedRoute> ,
      },
      {
        path: "/account/edit",
        element:<ProtectedRoute><EditProfile /></ProtectedRoute> ,
      },
      {
        path: "/chat",
        element:<ProtectedRoute><ChatPage /></ProtectedRoute> ,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => {
  const { user } = useSelector((store) => store.user);
  const {socket} = useSelector(store=>store.socketio)
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8080", {
        query: {
          userId: user?.userId,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification",(notifiacation)=>{
         dispatch(setNotification(notifiacation))
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if(socket){
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
