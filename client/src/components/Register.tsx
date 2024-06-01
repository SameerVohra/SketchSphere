import { TextField } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import link from "../assets/link.json";
import { useNavigate } from "react-router";

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
      console.log(res);
      if (res.status == 201) {
        navigate("/login");
      }
    } catch (error) {
      setErr(error.response.data);
      console.log(error);
    }
  };

  return (
    <>
      {err && <h1 className="text-red-500 text-xl">{err}</h1>}
      <form onSubmit={handleRegister}>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
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
        />

        <Button variant="contained" type="submit">
          Register
        </Button>
      </form>
    </>
  );
}

export default Register;
