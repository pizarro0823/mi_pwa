

/*

  // 🚀 ===== MODO LOCAL (Serverless) =====

 export async function getFixtures() {
  const res = await fetch("http://localhost:3000/api/fixtures");
  const data = await res.json();
 console.log("API DATA 👉", data); // 👈 IMPORTANTE
  return data;
}

*/
///*
  // 🚀 ===== MODO VERCEL (Serverless) =====
  export async function getFixtures() {

  const res = await fetch("/api/fixtures");

  const data = await res.json();
  return data.response;
}

//*/



