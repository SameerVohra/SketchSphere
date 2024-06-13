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
      if (res.status === 201) {
        navigate(`/${projectId}/project`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErr(error.response.data || "An error occurred");
      } else {
        setErr("An error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white p-4 bg-gray-300 border-2 border-white rounded-2xl">
      {err && <h1 className="text-red-500 text-2xl">{err}</h1>}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <TextField
          variant="outlined"
          id="projectId"
          label="Project Id"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectId(e.target.value)
          }
          className="bg-gray-800 text-white border border-gray-700 rounded-md"
          InputLabelProps={{
            style: { color: "#000" },
          }}
          InputProps={{
            style: { color: "#000", background: "white" },
          }}
        />
        <TextField
          variant="outlined"
          id="projectKey"
          label="Project Key"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjectKey(e.target.value)
          }
          className="bg-gray-800 text-white border border-gray-700 rounded-md"
          InputLabelProps={{
            style: { color: "#000" },
          }}
          InputProps={{
            style: { color: "#000", background: "white" },
          }}
        />
        <Button
          onClick={handleJoin}
          style={{
            color: "white",
            border: "2px solid white",
            background: "gray",
            fontSize: "15px",
          }}
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          JOIN
        </Button>
      </div>
    </div>
  );
}

export default JoiningProject;
