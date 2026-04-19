export default async function handler(req, res) {
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