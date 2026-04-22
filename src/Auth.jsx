import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./auth.css";
import logo from "/logo.png"; // pon tu logo dentro de /public

export default function Auth({ onLogin }) {
  const [isNew, setIsNew] = useState(false);

  const [name, setName] = useState("");
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // REGISTRO
  // =========================
  const handleRegister = async () => {
    if (!name || !cedula || password.length !== 4) {
      alert("Todos los campos son obligatorios y el PIN es de 4 dígitos");
      return;
    }

    const { error } = await supabase.from("users").insert([
      {
        name: name,
        cedula: parseInt(cedula),
        password: parseInt(password),
        estado: 1,
      },
    ]);

    if (error) {
      alert("La cédula ya existe o hubo un error");
    } else {
      alert("Usuario creado correctamente");
      setIsNew(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    if (!cedula || password.length !== 4) {
      alert("Datos incompletos");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("cedula", parseInt(cedula))
      .eq("password", parseInt(password))
      .eq("estado", 1)
      .single();

    if (error || !data) {
      alert("Usuario inactivo o datos incorrectos");
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      onLogin(data); // ← enviamos el usuario completo a App
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} className="auth-logo" />

        <h2>{isNew ? "Registro de usuario" : "Ingresar"}</h2>

        {isNew && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="number"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña (4 dígitos)"
          maxLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={isNew ? handleRegister : handleLogin}>
          {isNew ? "Registrarse" : "Entrar"}
        </button>

        <p className="switch" onClick={() => setIsNew(!isNew)}>
          {isNew ? "Ya estoy registrado" : "Usuario nuevo"}
        </p>
      </div>
    </div>
  );
}