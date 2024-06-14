import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Home from "./components/Home.tsx";
import Projectpage from "./components/Projectpage.tsx";
import { Provider } from "react-redux";
import store from "./Store/store.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/:id/home",
        element: <Home />,
      },
      {
        path: "/:projid/:projname",
        element: <Projectpage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>,
);
