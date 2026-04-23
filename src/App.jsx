// Pantalla splash inicial
import SplashScreen from "./SplashScreen";

// Hooks de React
import { useEffect, useMemo, useState } from "react";

// Componente de cada partido
import MatchCard from "./components/MatchCard";

// Estilos
import "./App.css";

// Pantalla de login
import Auth from "./Auth";

// Conexión a Supabase
import { supabase } from "./lib/supabase";

// Conexion con el contador cuenta regresiva
import useCountdown from "./hooks/useCountdown";

export default function App() {

  // ---------------- ESTADOS PRINCIPALES ----------------

  // Lista de partidos del JSON
  const [matches, setMatches] = useState([]);

  // Fase seleccionada (grupos, octavos, etc)
  const [phase, setPhase] = useState("groups");

  // Grupo seleccionado
  const [group, setGroup] = useState("Group A");

  // Marcadores escritos (clave = ID ÚNICO DEL PARTIDO)
  const [scores, setScores] = useState({});

  // Usuario logueado
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // Cuenta regresiva
const { timeLeft, locked } = useCountdown(matches);

  // Splash inicial
  const [loading, setLoading] = useState(true);

  // Función para mostrar siempre 2 dígitos (08, 09, etc)
  const pad = (n) => String(n).padStart(2, "0");

  // ---------------- SPLASH ----------------
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ---------------- TRAER PARTIDOS DEL JSON ----------------
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/gh/pizarro0823/worldcup.json@master/2026/worldcup.json")
      .then((res) => res.json())
      .then((data) => {
        // Asignamos un ID ÚNICO GLOBAL a cada partido
        const matchesWithId = data.matches.map((m, index) => ({
          ...m,
          globalId: index + 1,
        }));
        setMatches(matchesWithId);
      });
  }, []);

 

  // ---------------- CUANDO EL USUARIO ESCRIBE MARCADOR ----------------
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

      // Guardar SOLO cuando ambos valores existan
      if (score.home !== undefined && score.away !== undefined) {
        savePrediction(matchId, score);
      }

      return updated;
    });
  };

  // ---------------- GUARDAR EN SUPABASE ----------------
  const savePrediction = async (matchId, score) => {
    await supabase
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
  };

  // ---------------- CARGAR MARCADORES GUARDADOS ----------------
  useEffect(() => {
    if (!user) return;

    const loadPredictions = async () => {
      const { data } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id);

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

  // ---------------- FILTRAR PARTIDOS ----------------
  const detectPhase = (round) => {
    if (round.toLowerCase().includes("matchday")) return "groups";
    if (round.toLowerCase().includes("octavos")) return "octavos";
    if (round.toLowerCase().includes("cuartos")) return "cuartos";
    if (round.toLowerCase().includes("semi")) return "semis";
    if (round.toLowerCase().includes("final")) return "final";
    return "groups";
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const p = detectPhase(m.round);
      if (p !== phase) return false;
      if (phase === "groups") return m.group === group;
      return true;
    });
  }, [matches, phase, group]);

  // ---------------- PANTALLAS ----------------

  if (loading) return <SplashScreen />;

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

  // ---------------- UI PRINCIPAL   ----------------
  return (
    <div className="page">

      {/* Header */}
      <div className="header-card">
        <div className="welcome">
          <span>Bienvenido</span>
          <strong>{user.name}</strong>
        </div>
      </div>

      {/* Contador */}
      <div className="countdown">
        <span className="cd-item">
          <strong>{pad(timeLeft.days)}</strong>
          <small>días</small>
        </span>
        <span className="cd-sep">·</span>
        <span className="cd-item">
          <strong>{pad(timeLeft.hours)}</strong>
          <small>horas</small>
        </span>
        <span className="cd-sep">·</span>
        <span className="cd-item">
          <strong>{pad(timeLeft.minutes)}</strong>
          <small>min</small>
        </span>
        <span className="cd-sep">·</span>
        <span className="cd-item">
          <strong>{pad(timeLeft.seconds)}</strong>
          <small>seg</small>
        </span>

        {locked && (
          <div className="locked-msg">
            🔒 Los marcadores están cerrados
          </div>
        )}
      </div>

      {/* Tabs grupos */}
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

      {/* Partidos */}
      <div className="matches">
        {filteredMatches.map((m) => {
          const matchId = m.globalId;

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