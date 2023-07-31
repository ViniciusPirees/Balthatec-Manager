import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Dana/Principal" />,
  },
  {
    path: "/Dana/Principal",
    element: <App></App>
  },
  {
    path: "*",
    element: <Navigate to="/Dana/Principal" />,
  }
 
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
