import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface ProjectCardProps {
  projectName: string;
  projectId: string;
  password: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  projectId,
  password,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${projectId}/${projectName}`);
  };

  const setVisibility = (): void => {
    setIsVisible(!isVisible);
  };

  return (
    <Card className="w-full max-w-xs text-left rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-1000 ease-in-out transform hover:scale-101 hover:shadow-lg hover:shadow-white">
      <CardContent className="p-6 bg-gray-300 rounded-2xl">
        <Typography
          variant="h6"
          component="div"
          className="text-black font-semibold "
        >
          Name: {projectName}
          <br />
          ID: {projectId}
          <br />
          <div className="flex flex-row items-center gap-4">
            Project Password: {isVisible ? `${password}` : "******"}
            <button onClick={setVisibility}>
              {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>
          <button
            onClick={handleClick}
            className="text-right text-sm text-blue-600 hover:text-blue-800 hover:underline "
          >
            Go to project
          </button>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
