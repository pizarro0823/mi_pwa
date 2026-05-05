// Hooks de React
import { useEffect, useState } from "react";

// Conexión a Supabase
import { supabase } from "../../lib/supabase";

// Estilos
import "./admin.css";

export default function AdminResults() {
  // ================== ESTADOS ==================

  // Saber si el usuario puede entrar al admin
  const [authorized, setAuthorized] = useState(false);

  // Lista de partidos traídos de la BD
  const [matches, setMatches] = useState([]);

  // Estado reactivo donde guardamos lo que se escribe en inputs
  const [scores, setScores] = useState({});

  // ================== VALIDAR CÉDULA ==================
  useEffect(() => {
    // Traemos el usuario guardado en el login
    const user = JSON.parse(localStorage.getItem("user"));

    // Tus dos cédulas permitidas
    const cedulasPermitidas = ["1115082945", "2222222222"];

    // Si la cédula coincide → entra al panel
    if (cedulasPermitidas.includes(String(user?.cedula))) {
      setAuthorized(true);
      fetchMatches(); // cargamos partidos
    }
  }, []);

  // ================== TRAER PARTIDOS + RESULTADOS ==================
 async function fetchMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      id,
      match_date,
      home:teams!matches_home_team_id_fkey(name),
      away:teams!matches_away_team_id_fkey(name),
      match_results (
        home_goals,
        away_goals
      )
    `)
    .order("match_date");

  if (error) {
    console.error(error);
    return;
  }

  setMatches(data || []);

  const initialScores = {};

  data.forEach((m) => {
    initialScores[m.id] = {
      home: m.match_results?.home_goals ?? "",
      away: m.match_results?.away_goals ?? "",
    };
  });

  setScores(initialScores);
}

  // ================== CUANDO ESCRIBES UN GOL ==================
  const handleChange = async (matchId, team, value) => {
    // Actualizamos el estado reactivo
    const updated = {
      ...scores,
      [matchId]: {
        ...scores[matchId],
        [team]: value,
      },
    };

    setScores(updated);

    const home = updated[matchId].home;
    const away = updated[matchId].away;

    // 🔥 Solo guarda cuando ambos campos tienen valor
    if (home !== "" && away !== "") {
      await supabase.from("match_results").upsert({
        match_id: matchId,
        home_goals: Number(home),
        away_goals: Number(away),
      });
    }
  };

  // ================== BLOQUEO SI NO ESTÁ AUTORIZADO ==================
  if (!authorized) return <h1>No estás autorizado</h1>;

  // ================== UI ==================
  return (
    <div className="admin-container">
      <h1>⚽ Panel Admin - Resultados (Auto guardado)</h1>

      {matches.map((m) => (
        <div key={m.id} className="match-card">
          {/* Equipos */}
          <div className="teams">
            <span>{m.home.name}</span>
            <strong>vs</strong>
            <span>{m.away.name}</span>
          </div>

          {/* Inputs de goles */}
          <div className="inputs">
            <input
              type="number"
              value={scores[m.id]?.home ?? ""}
              placeholder="Local"
              onChange={(e) =>
                handleChange(m.id, "home", e.target.value)
              }
            />

            <input
              type="number"
              value={scores[m.id]?.away ?? ""}
              placeholder="Visitante"
              onChange={(e) =>
                handleChange(m.id, "away", e.target.value)
              }
            />
          </div>

          {/* Fecha del partido */}
          <small>{new Date(m.match_date).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}