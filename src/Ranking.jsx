import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./ranking.css";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetchRanking();
  }, []);

  async function fetchRanking() {
    const { data, error } = await supabase
      .from("ranking_polla")
      .select("*");

    if (!error) {
      setRanking(data);
    }
  }

  return (
    <div className="ranking-container">
      <h1>🏆 Tabla de Posiciones</h1>

      <table className="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Jugador</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((u, index) => (
            <tr key={u.user_id} className={index < 8 ? "top8" : ""}>
              <td>{index + 1}</td>
              <td>{u.name}</td>
              <td>{u.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}