import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import link from "../assets/link.json";
import { useNavigate, useParams } from "react-router";
import Alert from "@mui/material/Alert";

function CreatingProject() {
  const { id } = useParams<{ id: string }>();
  const [projName, setProjName] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setErr("");
    setSuccess(false);
    e.preventDefault();
    const token: string | null = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${link.url}/${id}/new-project`,
        { projectName: projName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(res);
      if (res.status === 201) {
        setSuccess(true);
        setProjName("");
        navigate(
          `/${res.data.project.projectId}/${res.data.project.projectName}`,
        );
      }
    } catch (error) {
      setErr(error.response?.data || "An error occurred");
    }
  };

  return (
    <>
      {err && <Alert severity="error">{err}</Alert>}
      {success && (
        <Alert severity="success">Project Created Successfully</Alert>
      )}
      <TextField
        variant="outlined"
        label="Project Name"
        id="projectId"
        value={projName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setProjName(e.target.value)
        }
      />
      <Button size="large" onClick={handleCreate}>
        Create Project
      </Button>
    </>
  );
}

export default CreatingProject;
