

///*

  // 🚀 ===== MODO LOCAL (Serverless) =====

export async function getFixtures() {
  const isLocal = window.location.hostname === "localhost";

  const url = isLocal
    ? "http://localhost:3001/api/fixtures"
    : "/api/fixtures";

  const res = await fetch(url);
  return res.json();
}


//*/
/*
  // 🚀 ===== MODO VERCEL (Serverless) =====
  export async function getFixtures() {

  const res = await fetch("/api/fixtures");

  const data = await res.json();
  return data.response;
}

*/

/*
export const getFixtures = async () => {
  const res = await fetch('/api/fixtures');
  const data = await res.json();

  console.log("DATA REAL:", data);

  return data.response;   // 👈 ESTA ES LA CLAVE
};

*/

