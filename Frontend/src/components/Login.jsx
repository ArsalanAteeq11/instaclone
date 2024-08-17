import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/user/login", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(setUser(res.data.user))
      if (res.data.success) {
        navigate('/')
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen justify-center">
      <form
        onSubmit={loginHandler}
        className="flex flex-col gap-5 p-8 my-3 w-[350px] border border-gray-300"
      >
        <div className="flex flex-col items-center justify-start pb-7">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxCl4AJyJtz8xnJgKEGYdFaFk9pC86Nr3uw&s"
            className="w-40"
            alt=""
          />
          <p className="text-lg text-gray-600 font-semibold text-center">
            Login to see photos and videos from your friends.
          </p>
        </div>
        <div>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Email"
            className="focus-visible:ring-transparent bg-gray-50"
          />
        </div>
        <div className="flex justify-center items-center ">
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Password"
            className="focus-visible:ring-transparent bg-gray-50"
          />
        </div>
        {loading ? (
          <Button className="bg-blue-400 hover:bg-blue-400">
            <Loader2 className="mr-3 h-4 w-4 animate-spin"/>
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="bg-blue-400 hover:bg-blue-400">
            Login
          </Button>
        )}
      </form>
      <div className="flex flex-col gap-5 px-8 py-6 w-[350px] border border-gray-300">
        <p className="text-center text-md text-gray-700">
          Don't Have an account?
          <Link
            to="/signup"
            className="text-blue-500 text-md underline cursor-pointer font-semibold "
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
