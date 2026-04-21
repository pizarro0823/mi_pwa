import { useState } from "react";
import "./auth.css";

export default function Auth() {
  const [isNew, setIsNew] = useState(false);

  return (
    <div className="auth-container">
      {/* LOGO ARRIBA */}
      <img src="/logo.png" alt="Logo" className="auth-logo" />

      {/* TARJETA */}
      <div className="auth-card">
        <h2 className="auth-title">
          {isNew ? "Crear cuenta" : "Ingresar"}
        </h2>

        {isNew && (
          <input className="auth-input" placeholder="Nombre completo" />
        )}

        <input className="auth-input" placeholder="Cedula" />

        <input
          className="auth-input"
          placeholder="Contraseña (4 dígitos)"
          maxLength={4}
          type="password"
        />

        <button className="auth-button">
          {isNew ? "Registrarse" : "Entrar"}
        </button>

        <p
          className="auth-link"
          onClick={() => setIsNew(!isNew)}
        >
          {isNew ? "Ya tengo cuenta" : "Usuario nuevo"}
        </p>
      </div>
    </div>
  );
}