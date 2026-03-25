import React from "react";
import ReactDOM from "react-dom/client";
import "framework7/css/bundle";
import "framework7-icons/css/framework7-icons.css";
import App2 from "./app/App2";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App2 />
  </React.StrictMode>,
);
