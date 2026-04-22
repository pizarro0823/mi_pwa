import React from "react";
import ReactDOM from "react-dom/client";
import Tabs from "./Tabs";
import Auth from "./Auth";

const rawUser = localStorage.getItem("user");

let user = null;

try {
  user = rawUser ? JSON.parse(rawUser) : null;
} catch {
  localStorage.removeItem("user");
  user = null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  user ? <Tabs /> : <Auth />
);