import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/Header";

function App() {
  const username: string | null = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  return (
    <>
      <div className="bg-black min-h-screen">
        {token && <Header username={username} />}

        <Outlet />
      </div>
    </>
  );
}

export default App;
