// src/hooks/useCountdown.js

// Importamos hooks de React
import { useEffect, useState } from "react";

/**
 * Hook personalizado que:
 * 1️⃣ Calcula la cuenta regresiva al primer partido
 * 2️⃣ Indica cuándo bloquear los marcadores (24h antes)
 */
export default function useCountdown(matches) {
  // Estado con días, horas, minutos y segundos restantes
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Estado que indica si los marcadores deben bloquearse
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // Si aún no han cargado los partidos, no hacemos nada
    if (!matches.length) return;

    /**
     * Función que convierte la fecha del JSON
     * "2026-06-11" y "13:00 UTC-6"
     * en una fecha REAL que JavaScript entiende
     */
    const parseMatchDate = (dateStr, timeStr) => {
      // Separar año, mes y día
      const [year, month, day] = dateStr.split("-").map(Number);

      // Quedarnos solo con la hora y minuto, ignorando el UTC
      const hourMinute = timeStr.split(" ")[0];
      const [hour, minute] = hourMinute.split(":").map(Number);

      // Crear fecha válida local
      return new Date(year, month - 1, day, hour, minute);
    };

    // Buscar el partido más cercano en el tiempo
    const firstMatch = matches.reduce((earliest, current) => {
      const d1 = parseMatchDate(earliest.date, earliest.time);
      const d2 = parseMatchDate(current.date, current.time);
      return d2 < d1 ? current : earliest;
    });

    // Obtener el timestamp del primer partido
    const firstMatchDate = parseMatchDate(
      firstMatch.date,
      firstMatch.time
    ).getTime();

    // Ejecutar contador cada segundo
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = firstMatchDate - now;

      // Si ya inició el mundial
      if (diff <= 0) {
        setLocked(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      // Si faltan 24 horas o menos → bloquear marcadores
      if (diff <= 24 * 60 * 60 * 1000) {
        setLocked(true);
      }

      // Calcular días, horas, minutos y segundos
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Actualizar estado
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    // Limpiar intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [matches]);

  // Retornamos lo que necesita App.jsx
  return { timeLeft, locked };
}