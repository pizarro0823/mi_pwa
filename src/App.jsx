// ================= PANTALLA SPLASH =================
import SplashScreen from "./SplashScreen";

// ================= REACT =================
import { useEffect, useMemo, useState } from "react";

// ================= COMPONENTES =================
import MatchCard from "./components/MatchCard";
import Auth from "./Auth";
import AdminResults from "./pages/admin/AdminResults";

// ================= ESTILOS =================
import "./App.css";

// ================= SUPABASE =================
import { supabase } from "./lib/supabase";

// ================= HOOK PERSONALIZADO =================
import useCountdown from "./hooks/useCountdown";

// ================= ROUTER =================
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  // ================= ESTADOS PRINCIPALES =================

  // Lista completa de partidos traídos del JSON
  const [matches, setMatches] = useState([]);

  // Fase actual (grupos, octavos, etc)
  const [phase, setPhase] = useState("groups");

  // Grupo seleccionado (A, B, C...)
  const [group, setGroup] = useState("Group A");

  // Marcadores digitados por el usuario
  const [scores, setScores] = useState({});

  // Usuario logueado (se guarda en localStorage)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // Hook que bloquea marcadores cuando empieza el partido
  const { timeLeft, locked } = useCountdown(matches);

  // Control del splash inicial
  const [loading, setLoading] = useState(true);

  // Función para mostrar 2 dígitos (ej: 04)
  const pad = (n) => String(n).padStart(2, "0");

  // ================= SPLASH 2 SEGUNDOS =================
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ================= TRAER PARTIDOS DESDE JSON =================
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/gh/pizarro0823/worldcup.json@master/2026/worldcup.json")
      .then((res) => res.json())
      .then((data) => {
        // Le creamos un ID global para usarlo en BD
        const matchesWithId = data.matches.map((m, index) => ({
          ...m,
          globalId: index + 1,
        }));
        setMatches(matchesWithId);
      });
  }, []);

  // ================= CUANDO EL USUARIO CAMBIA UN MARCADOR =================
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

      // Cuando ya tiene ambos goles → se guarda en BD
      if (score.home !== undefined && score.away !== undefined) {
        savePrediction(matchId, score);
      }

      return updated;
    });
  };

  // ================= GUARDAR PRONÓSTICO EN SUPABASE =================
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
          onConflict: "user_id,match_id", // evita duplicados
        }
      );
  };

  // ================= CARGAR PRONÓSTICOS GUARDADOS =================
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

  // ================= DETECTAR FASE POR TEXTO =================
  const detectPhase = (round) => {
    if (round.toLowerCase().includes("matchday")) return "groups";
    if (round.toLowerCase().includes("octavos")) return "octavos";
    if (round.toLowerCase().includes("cuartos")) return "cuartos";
    if (round.toLowerCase().includes("semi")) return "semis";
    if (round.toLowerCase().includes("final")) return "final";
    return "groups";
  };

  // ================= FILTRO DE PARTIDOS =================
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const p = detectPhase(m.round);
      if (p !== phase) return false;
      if (phase === "groups") return m.group === group;
      return true;
    });
  }, [matches, phase, group]);

  // ================= MOSTRAR SPLASH =================
  if (loading) return <SplashScreen />;

  // ================= SI NO HAY USUARIO → LOGIN =================
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

  // ================= RENDER PRINCIPAL CON RUTAS =================
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= RUTA ADMIN ================= */}
        <Route path="/admin" element={<AdminResults />} />

        {/* ================= APP NORMAL ================= */}
        <Route
          path="/*"
          element={
            <div className="page">
              
              {/* Bienvenida */}
              <div className="header-card">
                <div className="welcome">
                  <span>Bienvenido</span>
                  <strong>{user.name}</strong>
                </div>
              </div>

              {/* Contador */}
              <h4>Faltan</h4>
              <div className="countdown">
                <span><strong>{pad(timeLeft.days)}</strong> días</span> ·
                <span><strong>{pad(timeLeft.hours)}</strong> horas</span> ·
                <span><strong>{pad(timeLeft.minutes)}</strong> min</span> ·
                <span><strong>{pad(timeLeft.seconds)}</strong> seg</span>

                {locked && (
                  <div className="locked-msg">
                    🔒 Los marcadores están cerrados
                  </div>
                )}
              </div>

              {/* Selector de grupos */}
              <h4>Grupos</h4>
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
          }
        />
      </Routes>
    </BrowserRouter>
  );
}