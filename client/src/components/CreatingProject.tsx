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
      if (projName === "") {
        setErr("Enter Project Name");
        return;
      }
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
    <div className="flex flex-col items-center justify-center text-white p-4 bg-gray-300 border-2 border-white rounded-2xl">
      {err && <Alert severity="error">{err}</Alert>}
      {success && (
        <Alert severity="success">Project Created Successfully</Alert>
      )}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <TextField
          variant="outlined"
          label="Project Name"
          id="projectId"
          value={projName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProjName(e.target.value)
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
          size="large"
          onClick={handleCreate}
          style={{
            color: "white",
            border: "2px solid white",
            background: "gray",
            fontSize: "15px",
          }}
          className="bg-blue-500 text-white hover:bg-blue-700"
        >
          Create Project
        </Button>
      </div>
    </div>
  );
}

export default CreatingProject;
