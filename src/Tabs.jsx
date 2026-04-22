import { useState } from "react";
import App from "./App"; // 👈 tu pantalla actual de marcadores
import "./Tabs.css";

function Resultados() {
  return <div style={{ padding: 20 }}>Resultados oficiales</div>;
}

function Participantes() {
  return <div style={{ padding: 20 }}>Tabla de participantes y puntos</div>;
}

function Perfil() {
  return <div style={{ padding: 20 }}>Perfil del usuario 
  
    <button
  onClick={() => {
    window.location.reload();
    localStorage.removeItem("user");
    setUser(null);
  }}
>CERRAR SECCION
</button>
  
  </div>;
}

export default function Tabs() {
  const [tab, setTab] = useState("mis-marcadores");

  const renderScreen = () => {
    switch (tab) {
      case "resultados":
        return <Resultados />;
      case "mis-marcadores":
        return <App />;
      case "participantes":
        return <Participantes />;
      case "perfil":
        return <Perfil />;
      default:
        return <App />;
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs-content">{renderScreen()}</div>

      <div className="tab-bar">
        <div
          className={`tab-item ${tab === "resultados" ? "active" : ""}`}
          onClick={() => setTab("resultados")}
        >
          🏆
          <span>Resultados</span>
        </div>

        <div
          className={`tab-item ${tab === "mis-marcadores" ? "active" : ""}`}
          onClick={() => setTab("mis-marcadores")}
        >
          ✍️
          <span>Mis marcadores</span>
        </div>

        <div
          className={`tab-item ${tab === "participantes" ? "active" : ""}`}
          onClick={() => setTab("participantes")}
        >
          📊
          <span>Participantes</span>
        </div>

        <div
          className={`tab-item ${tab === "perfil" ? "active" : ""}`}
          onClick={() => setTab("perfil")}
        >
          👤
          <span>Perfil</span>
        </div>
      </div>
    </div>
  );
}