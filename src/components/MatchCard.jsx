// src/components/MatchCard.jsx
import { getFlagUrl } from "../data/flags";
import "./MatchCard.css";

export default function MatchCard({ match, matchId, score, onScoreChange, locked }) {
  return (
    <div className="card">
      {/* Encabezado */}
      <div className="card-header">
        {match.group} · {match.round}
      </div>

      {/* Equipos y marcador */}
      <div className="teams-row">
        {/* Equipo 1 */}
        <div className="team vertical">
          <img src={getFlagUrl(match.team1)} className="flag" />
          <span className="team-name">{match.team1}</span>
        </div>

        {/* Marcadores */}
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
          <span>:</span>
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

        {/* Equipo 2 */}
        <div className="team vertical">
          <img src={getFlagUrl(match.team2)} className="flag" />
          <span className="team-name">{match.team2}</span>
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