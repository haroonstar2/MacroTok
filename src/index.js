import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css"; // Tailwind first
import "./style.css";   // Your design second

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
