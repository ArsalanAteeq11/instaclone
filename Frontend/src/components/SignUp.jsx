import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const SignUp = () => {
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  const signUpHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login')
        setInput({
          name: "",
          username: "",
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
        onSubmit={signUpHandler}
        className="flex flex-col gap-5 p-8 my-3 w-[350px] border border-gray-300"
      >
        <div className="flex flex-col items-center justify-start">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxCl4AJyJtz8xnJgKEGYdFaFk9pC86Nr3uw&s"
            className="w-40"
            alt=""
          />
          <p className="text-lg text-gray-600 font-semibold text-center">
            Sign up to see photos and videos from your friends.
          </p>
        </div>
        <div>
          <Input
            type="text"
            name="name"
            value={input.name}
            onChange={changeEventHandler}
            placeholder="Full Name"
            className="focus-visible:ring-transparent bg-gray-50"
          />
        </div>
        <div>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            placeholder="Username"
            className="focus-visible:ring-transparent bg-gray-50"
          />
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
            Sign Up
          </Button>
        )}
      </form>
      <div className="flex flex-col gap-5 px-8 py-6 w-[350px] border border-gray-300">
        <p className="text-center text-md text-gray-700">
          Have an account?
          <Link to='/login' className="text-blue-500 text-md underline cursor-pointer font-semibold ">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
