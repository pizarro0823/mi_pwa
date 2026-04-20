// src/components/MatchCard.jsx
import { getFlagUrl } from "../data/flags";


export default function MatchCard({ match, matchId, score, onScoreChange }) {
  return (
    <div className="card">
      {/* Encabezado */}
      <div className="card-header">
        {match.group} · {match.round}
      </div>

      {/* Equipos y marcador */}
      <div className="teams-row">
        {/* Equipo 1 */}
        <div className="team">
          <img src={getFlagUrl(match.team1)} className="flag" />
          <span>{match.team1}</span>
        </div>

{/* Inputs marcador conectados al partido */}
<div className="score-inputs">
  <input
    type="number"
    min="0"
    value={score.home || ""}
    onChange={(e) =>
      onScoreChange(matchId, "home", e.target.value)
    }
  />
  <span>:</span>
  <input
    type="number"
    min="0"
    value={score.away || ""}
    onChange={(e) =>
      onScoreChange(matchId, "away", e.target.value)
    }
  />
</div>

        {/* Equipo 2 */}
        <div className="team">
          <span>{match.team2}</span>
          <img src={getFlagUrl(match.team2)} className="flag" />
        </div>
      </div>

      {/* Info del partido */}
      <div className="match-info">
        📅 {match.date} — {match.time} <br />
        📍 {match.ground}
      </div>
    </div>
  );
}