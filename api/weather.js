export default async function handler(req, res) {
  try {
    const city = req.query.city || "Yaoundé";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=fr`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message });
    }

    res.status(200).json({
      city: data.name,
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur météo" });
  }
}