import React, { useState } from "react";
import Button from "@mui/material/Button";
import JoiningProject from "./JoiningProject";
import CreatingProject from "./CreatingProject";
import { useParams } from "react-router";

function Home() {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

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
  return (
    <>
      {" "}
      {isCreating && <CreatingProject />}
      {isJoining && <JoiningProject />}
      <Button
        variant={!isJoining ? "outlined" : "disabled"}
        size="large"
        onClick={handleJoin}
      >
        Join Exisiting Project
      </Button>
      <Button
        variant={!isCreating ? "outlined" : "disabled"}
        size="large"
        onClick={handleCreate}
      >
        Create New Project
      </Button>
    </>
  );
}

export default Home;
