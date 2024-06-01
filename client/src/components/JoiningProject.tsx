import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import link from "../assets/link.json";

function JoiningProject() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [projectId, setProjectId] = useState<string>("");
  const [projectKey, setProjectKey] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const handleJoin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Joining");
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        setErr("Login to Continue");
        return;
      }
      const res = await axios.post(
        `${link.url}/${id}/join-project`,
        { projectKey, projectId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(res);
      if (res.status === 201) {
        navigate(`/${projectId}/project`);
      }
    } catch (error) {
      console.log(error);
      setErr(error.response.data);
    }
  };
  return (
    <>
      {err && <h1 className="text-red-500 text-2xl">{err}</h1>}
      <TextField
        variant="outlined"
        id="projectId"
        label="Project Id"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setProjectId(e.target.value)
        }
      />

      <TextField
        variant="outlined"
        id="projectKey"
        label="Project Key"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setProjectKey(e.target.value)
        }
      />
      <Button onClick={handleJoin}>JOIN</Button>
    </>
  );
}

export default JoiningProject;
