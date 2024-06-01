import { useState } from "react";
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import link from "../assets/link.json";
import { useNavigate } from "react-router";

function Login() {
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
      console.log(res);
      if (res.status == 201) {
        localStorage.setItem("token", res.data.token);
        navigate(`/${res.data.id}/home`);
      }
    } catch (error) {
      setErr(error.response.data);
      console.error(error);
    }
  };

  return (
    <>
      {err && <h1 className="text-red-500 text-xl">{err}</h1>}
      <form onSubmit={handleLogin}>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={handleUser}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={handlePass}
          type="password"
        />
        <Button variant="outlined" type="submit">
          Login
        </Button>
      </form>
    </>
  );
}

export default Login;
