import { getFlagUrl } from "../data/flags";
import "./MatchCard.css";

export default function MatchCard({
  match,
  matchId,
  score,
  official,      // ← resultado que viene de match_results
  onScoreChange,
  locked,
}) {
  return (
    <div className="card">
      {/* ===== HEADER ===== */}
      <div className="card-header">
        {match.group} · {match.round}
      </div>

      {/* ===== FILA PRINCIPAL ===== */}
      <div className="teams-row">

        {/* ===== EQUIPO LOCAL ===== */}
        <div className="team">
          <img
            src={getFlagUrl(match.team1)}
            alt={match.team1}
            className="flag"
          />
          <span className="team-name">{match.team1}</span>
        </div>

        {/* ===== ZONA MARCADORES ===== */}
        <div className="score-area">

          {/* Input usuario LOCAL */}
          <div className="score-inputs">
            <input
              type="number"
              min="0"
              disabled={locked}
              value={score?.home ?? ""}
              onChange={(e) =>
                onScoreChange(matchId, "home", e.target.value)
              }
            />
          </div>

          {/* Marcador OFICIAL pequeño al centro */}
          <div className="official-score">
            {official?.home ?? "P"} : {official?.away ?? "P"}
          </div>

          {/* Input usuario VISITANTE */}
          <div className="score-inputs">
            <input
              type="number"
              min="0"
              disabled={locked}
              value={score?.away ?? ""}
              onChange={(e) =>
                onScoreChange(matchId, "away", e.target.value)
              }
            />
          </div>

        </div>

        {/* ===== EQUIPO VISITANTE ===== */}
        <div className="team">
          <img
            src={getFlagUrl(match.team2)}
            alt={match.team2}
            className="flag"
          />
          <span className="team-name">{match.team2}</span>
        </div>

      </div>

      {/* ===== INFO PARTIDO ===== */}
      <div className="match-info">
        📅 {match.date} — {match.time} <br />
        📍 {match.ground}
      </div>
    </div>
  );
}