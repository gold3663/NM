import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City required' });

  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Properly encode the city name for the URL
  const encodedCity = encodeURIComponent(city);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather' });
    }
  }
});

app.listen(PORT, () => console.log(`🌦️ Server running on http://localhost:${PORT}`));
