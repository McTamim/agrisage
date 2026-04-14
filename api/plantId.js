export default async function handler(req, res) {
  try {
    const formData = req.body;

    const response = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Api-Key": process.env.PLANT_API_KEY,
      },
      body: formData,
    });

    const data = await response.json();

    if (!data.suggestions?.length) {
      return res.status(404).json({ error: "Plante inconnue" });
    }

    const best = data.suggestions[0];

    res.status(200).json({
      plant: best.plant_name,
      disease: best.disease || "Aucune",
      confidence: (best.probability * 100).toFixed(1),
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur plante" });
  }
}