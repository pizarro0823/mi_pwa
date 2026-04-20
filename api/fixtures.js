export default async function handler(req, res) {
  const response = await fetch(
    "https://cdn.jsdelivr.net/gh/pizarro0823/worldcup.json@master/2026/worldcup.json",
    {
      headers: {
        "x-apisports-key": process.env.API_KEY,
      },
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}