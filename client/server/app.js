console.log("🚀 Starting server...");
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public'))); // serve frontend

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Weather route
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_KEY;

  //console.log("City requested:", city);
  //console.log("API Key being used:", apiKey);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      return res.status(response.status).json({ error: data.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Fetch failed:", err.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
