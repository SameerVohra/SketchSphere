import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import link from "../assets/link.json";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Store/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      const res = await axios.post(`${link.url}/login`, {
        username: username,
        password: password,
      });
      if (res.status == 201) {
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("username", username);
        localStorage.setItem("token", res.data.token);
        dispatch(login());
        navigate(`/${res.data.id}/home`);
      }
    } catch (error) {
      setErr(error.response.data);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-900 text-white">
      {err && <h1 className="text-red-500 text-xl">{err}</h1>}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm border-2 border-gray-600 flex flex-col gap-4 bg-gray-800 px-4 py-6 rounded-2xl"
      >
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={handleUser}
          className="bg-gray-700 rounded"
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={handlePass}
          type="password"
          className="bg-gray-700 rounded"
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
        <Button
          variant="outlined"
          type="submit"
          className="border-gray-600 text-gray-200 hover:bg-gray-600"
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgb(75, 85, 99)", // Tailwind's bg-gray-600
            },
          }}
        >
          Login
        </Button>
        <div className="text-sm flex flex-row items-center font-thin justify-between mt-2">
          <Link
            to="/register"
            className="hover:underline ease-in-out hover:font-bold"
          >
            Sign Up?
          </Link>
          <Link
            to="/login"
            className="hover:underline ease-in-out hover:font-bold"
          >
            Forgot Password
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
