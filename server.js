import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// Für __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "200kb" }));

// 👉 Frontend ausliefern (WICHTIG!)
app.use(express.static(__dirname));

// Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// -----------------------------
// Horoskop Generator (ohne OpenAI)
// -----------------------------
function generateHoroskop(data) {
  const {
    platform,
    screenWidth,
    screenHeight,
    prefersDark,
    lat,
    lon,
    language,
    timeZone,
    uniqueId,
  } = data;

  const mode = prefersDark ? "Dark Mode" : "Light Mode";

  const idShort = uniqueId ? uniqueId.slice(0, 8) : "unbekannt";

  return `Dein Gerät meldet sich hier als ${platform}. Auf deinem Bildschirm mit ${screenWidth} x ${screenHeight} Pixeln wird mehr sichtbar, als nur Oberfläche. ${platform} im ${mode} wirkt ruhig, doch diese Kombination wird registriert und gespeichert. Selbst dein Standort hinterlässt Spuren: ${lat}, ${lon}. Mit Sprache ${language}, Zeitzone ${timeZone} und der Signatur ${idShort} entsteht ein Profil, das sich nicht mehr vollständig von dir lösen lässt.`;
}

// -----------------------------
// API Route
// -----------------------------
app.post("/api/horoskop", (req, res) => {
  try {
    const deviceInfo = req.body?.deviceInfo || {};

    const horoskop = generateHoroskop(deviceInfo);

    res.json({ horoskop });
  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({
      error: "Fehler bei der Generierung",
    });
  }
});

// -----------------------------
app.listen(port, () => {
  console.log(`🔮 Server läuft auf http://localhost:${port}`);
});
