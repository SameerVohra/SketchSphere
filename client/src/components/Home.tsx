import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import JoiningProject from "./JoiningProject";
import CreatingProject from "./CreatingProject";
import { useParams } from "react-router";
import axios from "axios";
import link from "../assets/link.json";
import ProjectCard from "./ProjectCard";

type Project = {
  projectName: string;
  projectId: string;
  projectKey: string;
};

function Home() {
  const { id } = useParams<{ id: string }>();

  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const [proj, setProj] = useState<Project[]>([]);

  const handleJoin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCreating(false);
    setIsJoining(true);
  };

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsJoining(false);
    setIsCreating(true);
  };

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");

    if (!token) {
      setErr("Login To Continue");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${link.url}/project-details`,
          { uId: id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProj(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          setErr(error.response.data || "An error occurred");
        } else {
          setErr("An error occurred");
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 ">
      {err && <h1 className="text-red-500 text-xl">{err}</h1>}
      {isCreating && <CreatingProject />}
      {isJoining && <JoiningProject />}
      <div className="flex flex-row justify-around items-center min-w-full mt-4">
        <Button
          variant={!isJoining ? "outlined" : "contained"}
          size="large"
          onClick={handleJoin}
          style={{ color: "white", borderColor: "white", fontSize: "20px" }}
          className={`text-white border-white hover:bg-gray-700 ${
            isJoining ? "bg-gray-700" : ""
          }`}
        >
          Join Existing Project
        </Button>
        <Button
          variant={!isCreating ? "outlined" : "contained"}
          size="large"
          style={{ color: "white", borderColor: "white", fontSize: "20px" }}
          onClick={handleCreate}
          className={`text-white border-white hover:bg-gray-700 ${
            isCreating ? "bg-gray-700" : ""
          }`}
        >
          Create New Project
        </Button>
      </div>
      <div className="flex flex-wrap flex-row mt-6 justify-evenly min-w-full">
        {proj.map((p, i) => (
          <ProjectCard
            key={i}
            projectName={p.projectName}
            projectId={p.projectId}
            password={p.projectKey}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
