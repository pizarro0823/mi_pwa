const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/fixtures", async (req, res) => {
  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?league=1&season=2022",
      {
        headers: {
          "x-apisports-key": "9847608a77b0a2790c369a848f720060",
        },
      }
    );

    const data = await response.json();
    console.log("OK 👉", data.response?.length);
    res.json(data);
  } catch (e) {
    console.log("ERROR 👉", e);
    res.status(500).send("error");
  }
});

app.listen(3000, () => {
  console.log("🔥 SERVER EN http://localhost:3000");
});

/*

server/index.js no se toca.
Solo lo usas cuando estás en modo local.
cd server
node index.js

*/ 