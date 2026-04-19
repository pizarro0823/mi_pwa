/*export default async function handler(req, res) {
  const response = await fetch(
    "https://v3.football.api-sports.io/fixtures?league=1&season=2022",
    {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY,
      },
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}   

*/

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?league=1&season=2022",
      {
        headers: {
          "x-apisports-key": process.env.API_KEY,
        },
      }
    );

    const data = await response.json();

    // 🔥 MISMA estructura que Express
    res.status(200).json({ response: data.response });
  } catch (error) {
    res.status(500).json({ error: "Error trayendo fixtures" });
  }
}