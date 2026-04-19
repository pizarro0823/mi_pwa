/*import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('teams').select('*')
      setPedidos(data)
    }
    cargar()
  }, [])

  return (
    <div className="p-4">
      {pedidos.map(p => (
        <div key={p.id}>
          Mesa {p.name} 
        </div>
      ))}
    </div>
  )
}*/

import { useEffect, useState } from "react";
import { getFixtures } from "./lib/apiFootball";

export default function App() {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await getFixtures();
      setFixtures(data.response); // aquí vienen los partidos
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Partidos</h1>

      <div className="space-y-3">
      {Array.isArray(fixtures) && fixtures.map((match) => (
          <div
            key={match.fixture.id}
            className="bg-slate-800 p-3 rounded-lg shadow"
          >
            <p className="text-sm text-gray-400">
              {new Date(match.fixture.date).toLocaleString()}
            </p>

            <div className="flex justify-between items-center mt-2">
              <span>{match.teams.home.name}</span>
              <span className="font-bold">
                {match.goals.home ?? "-"} : {match.goals.away ?? "-"}
              </span>
              <span>{match.teams.away.name}</span>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {match.league.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}