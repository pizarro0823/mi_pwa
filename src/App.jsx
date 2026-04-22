import SplashScreen from "./SplashScreen";
import { useEffect, useMemo, useState } from "react";
import MatchCard from "./components/MatchCard";
import "./App.css";
import Auth from "./Auth";
import { supabase } from "./lib/supabase";

export default function App() {

  // Partidos del JSON
  const [matches, setMatches] = useState([]);

  // Fase seleccionada
  const [phase, setPhase] = useState("groups");

  // Grupo seleccionado
  const [group, setGroup] = useState("Group A");

  // Marcadores escritos por partido (clave = ID REAL del partido)
  const [scores, setScores] = useState({});

  // Usuario logueado
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [countdown, setCountdown] = useState("");
const [locked, setLocked] = useState(false);

  // Splash
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Cuando se escribe un marcador
const handleScoreChange = (matchId, team, value) => {
  setScores((prev) => {
    const updated = {
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value,
      },
    };

    const score = updated[matchId];

    if (score.home !== undefined && score.away !== undefined) {
      savePrediction(matchId, score);
    }

    return updated;
  });
};
  // Guardar en Supabase asociado al usuario
const savePrediction = async (matchId, score) => {
  const { error } = await supabase
    .from("predictions")
    .upsert(
      {
        user_id: user.id,
        match_id: matchId,
        predicted_home_goals: Number(score.home),
        predicted_away_goals: Number(score.away),
        create_date: new Date().toISOString(),
      },
      {
        onConflict: "user_id,match_id",
      }
    );

  if (error) console.error(error);
};

  // Traer partidos
useEffect(() => {
  fetch("https://cdn.jsdelivr.net/gh/pizarro0823/worldcup.json@master/2026/worldcup.json")
    .then((res) => res.json())
    .then((data) => {
      // 👇 asignamos id único REAL a cada partido
      const matchesWithId = data.matches.map((m, index) => ({
        ...m,
        globalId: index + 1,
      }));
      setMatches(matchesWithId);
    });
}, []);


useEffect(() => {
  if (!matches.length) return;

  // 🥇 Buscar el primer partido (fecha más cercana)
  const firstMatch = matches.reduce((earliest, current) => {
    const d1 = new Date(`${earliest.date} ${earliest.time}`);
    const d2 = new Date(`${current.date} ${current.time}`);
    return d2 < d1 ? current : earliest;
  });

  const firstMatchDate = new Date(`${firstMatch.date} ${firstMatch.time}`);

  const interval = setInterval(() => {
    const now = new Date();
    const diff = firstMatchDate - now;

    if (diff <= 0) {
      setCountdown("¡El mundial ya inició!");
      setLocked(true);
      clearInterval(interval);
      return;
    }

    // ⏰ Calcular horas, minutos, segundos
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setCountdown(`${hours}h ${minutes}m ${seconds}s`);

    // 🔒 Si faltan 24 horas o menos, bloquear inputs
    if (diff <= 24 * 60 * 60 * 1000) {
      setLocked(true);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [matches]);

  // Detectar fase
  const detectPhase = (round) => {
    if (round.toLowerCase().includes("matchday")) return "groups";
    if (round.includes("32")) return "32";
    if (round.toLowerCase().includes("octavos")) return "octavos";
    if (round.toLowerCase().includes("cuartos")) return "cuartos";
    if (round.toLowerCase().includes("semi")) return "semis";
    if (round.toLowerCase().includes("final")) return "final";
    return "groups";
  };

  useEffect(() => {
  if (!user) return;

  const loadPredictions = async () => {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    const loadedScores = {};

    data.forEach((p) => {
      loadedScores[p.match_id] = {
        home: p.predicted_home_goals,
        away: p.predicted_away_goals,
      };
    });

    setScores(loadedScores);
  };

  loadPredictions();
}, [user]);

  // Opciones del combo
  const phases = [
    { value: "groups", label: "Fase de grupos" },
    { value: "32", label: "Ronda de 32" },
    { value: "octavos", label: "Octavos" },
    { value: "cuartos", label: "Cuartos" },
    { value: "semis", label: "Semifinales" },
    { value: "final", label: "Final" },
  ];

  // Filtrar partidos
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const p = detectPhase(m.round);
      if (p !== phase) return false;
      if (phase === "groups") return m.group === group;
      return true;
    });
  }, [matches, phase, group]);

  // Splash primero
  if (loading) return <SplashScreen />;

  // Si no hay usuario, mostrar login limpio
  if (!user) {
    return (
      <Auth
        onLogin={(u) => {
          localStorage.setItem("user", JSON.stringify(u));
          setUser(u);
        }}
      />
    );
  }

  return (
    <div className="page">

      <div className="header-card">
        <div className="welcome">
          <span>Bienvenido</span>
          <strong>{user.name}</strong>
        </div>

        <div className="phase-select">
          <label>Elige la fase</label>
          <select value={phase} onChange={(e) => setPhase(e.target.value)}>
            {phases.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>


<div className="countdown-box">
  ⏳ Faltan para el primer partido: <strong>{countdown}</strong>
  {locked && (
    <div className="locked-msg">
      🔒 Los marcadores están cerrados
    </div>
  )}
</div>


      {/* Tabs de grupos */}
      {phase === "groups" && (
        <div className="groups-bar">
          {["A","B","C","D","E","F","G","H","I","J","K","L"].map((g) => {
            const current = `Group ${g}`;
            return (
              <span
                key={g}
                onClick={() => setGroup(current)}
                className={`group-pill ${group === current ? "active" : ""}`}
              >
                {g}
              </span>
            );
          })}
        </div>
      )}

      {/* Partidos */}
      <div className="matches">
        {filteredMatches.map((m) => {
  const matchId = m.globalId; // 🔥 ID ÚNICO REAL DEL JSON

          return (
      <MatchCard
  key={matchId}
  match={m}
  matchId={matchId}
  score={scores[matchId] || {}}
  onScoreChange={handleScoreChange}
  locked={locked}
/>
          );
        })}
      </div>
    </div>
  );
}