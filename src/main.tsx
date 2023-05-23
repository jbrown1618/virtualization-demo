import React from "react";
import ReactDOM from "react-dom/client";
import VirtualizationDemo from "./VirtualizationDemo.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <VirtualizationDemo />
  </React.StrictMode>
);
