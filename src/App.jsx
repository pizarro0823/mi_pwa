
import SplashScreen from "./SplashScreen";
import { useEffect, useMemo, useState } from "react";
import MatchCard from "./components/MatchCard";
import "./App.css";
import Auth from "./Auth";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [phase, setPhase] = useState("groups");
  const [group, setGroup] = useState("Group A");
  const [scores, setScores] = useState({});
  const [user, setUser] = useState(null);

    // 👇 NUEVO estado del splash
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleScoreChange = (matchId, team, value) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value,
      },
    }));
  };



  useEffect(() => {
    fetch(
    "https://cdn.jsdelivr.net/gh/pizarro0823/worldcup.json@master/2026/worldcup.json",
      
    )
      .then((res) => res.json())
      .then((data) => setMatches(data.matches));
  }, []);

  // 🔥 Detectar fase automáticamente según el nombre de la ronda del JSON
  const detectPhase = (round) => {
    if (round.toLowerCase().includes("matchday")) return "groups";
    if (round.includes("32")) return "32";
    if (round.toLowerCase().includes("octavos")) return "octavos";
    if (round.toLowerCase().includes("cuartos")) return "cuartos";
    if (round.toLowerCase().includes("semi")) return "semis";
    if (round.toLowerCase().includes("final")) return "final";
    return "groups";
  };
  

  // 🔽 Opciones del combo
  const phases = [
    { value: "groups", label: "Fase de grupos (todos contra todos)" },
    { value: "32", label: "Ronda de 32" },
    { value: "Round of 16", label: "Octavos de final 16" },
    { value: "final", label: "Cuartos de final" },
    { value: "semi", label: "Semifinales" },
    { value: "final", label: "Final" },
  ];

  // 🎯 Filtrar partidos según fase y grupo
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const p = detectPhase(m.round);
      if (p !== phase) return false;
      if (phase === "groups") return m.group === group;
      return true;
    });
  }, [matches, phase, group]);

    if (loading) return <SplashScreen />;

    if (!user) {
  return <Auth onLogin={(alias) => setUser(alias)} />;
}

  return (
    <div className="container">
      <h2>World Cup 2026</h2>

      {/* 🔽 Combo fases */}
      <div className="round-select">
        <label>Elige la fase</label>
        <select value={phase} onChange={(e) => setPhase(e.target.value)}>
          {phases.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* 🧭 Tabs grupos (solo en fase grupos) */}
     {phase === "groups" && (
      
  <div className="groups-tabs">
    {["A","B","C","D","E","F","G","H","I","J","K","L"].map((g) => {
      const current = `Group ${g}`;

      return (
       <button
          key={g}
          onClick={() => setGroup(current)}
          className={`group-tab ${group === current ? "active" : ""}`}
        >
           {g}
        </button>
      );
    })}
  </div>
)}  
      {/* Partidos */}
      <div className="matches">
        <div className="matches">
  {filteredMatches.map((m, i) => {
    const matchId = `${m.team1}-${m.team2}-${m.date}`;

    return (
      <MatchCard
        key={i}
        match={m}
        matchId={matchId}
        score={scores[matchId] || {}}
        onScoreChange={handleScoreChange}
      />
    );
  })}
</div>
      </div>
    </div>
  );
}