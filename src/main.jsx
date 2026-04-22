import React from "react";
import ReactDOM from "react-dom/client";
import Tabs from "./Tabs";
import Auth from "./Auth";

const user = JSON.parse(localStorage.getItem("user"));

ReactDOM.createRoot(document.getElementById("root")).render(
  user ? <Tabs /> : <Auth />
);
// ❌ COMENTA ESTO POR AHORA
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
*/