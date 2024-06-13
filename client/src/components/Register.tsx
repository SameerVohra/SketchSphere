import { TextField } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import link from "../assets/link.json";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${link.url}/register`, {
        username,
        email,
        mobile,
        password,
      });
      if (res.status == 201) {
        navigate("/login");
      }
    } catch (error) {
      setErr(error.response.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-900 text-white">
      {err && <h1 className="text-red-500 text-xl">{err}</h1>}
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md border-2 border-gray-600 flex flex-col gap-4 bg-gray-800 px-4 py-6 rounded-2xl"
      >
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          className="bg-gray-700 rounded"
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="bg-gray-700 rounded"
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
        <TextField
          id="number"
          label="Number"
          variant="outlined"
          type="number"
          value={mobile}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMobile(e.target.value)
          }
          className="bg-gray-700 rounded"
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="bg-gray-700 rounded"
          InputLabelProps={{ style: { color: "#ffffff" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />
        <Button variant="contained" type="submit">
          Register
        </Button>
        <Link
          to="/login"
          className="font-thin text-right text-xl hover:font-bold hover:underline hover:text-gray-400 ease-in-out"
        >
          Already a user?
        </Link>
      </form>
    </div>
  );
}

export default Register;
