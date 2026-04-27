import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname für ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "200kb" }));

// Website-Dateien ausliefern
app.use(express.static(__dirname));

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function beautifyPlatform(platform) {
  if (platform === "MacIntel") return "Mac";
  if (platform === "Win32") return "Windows-Gerät";
  if (platform === "Linux x86_64") return "Linux-Gerät";
  return platform || "unbekanntes Gerät";
}

function buildFacts(deviceInfo = {}) {
  return {
    language: String(deviceInfo.language || "unbekannt"),
    platform: beautifyPlatform(deviceInfo.platform),
    screenWidth: deviceInfo.screenWidth || "unbekannt",
    screenHeight: deviceInfo.screenHeight || "unbekannt",
    timeZone: String(deviceInfo.timeZone || "unbekannt"),
    city: String(deviceInfo.city || "unbekannt"),
    region: String(deviceInfo.region || "unbekannt"),
    country: String(deviceInfo.country || "unbekannt"),
    cookieEnabled: String(deviceInfo.cookieEnabled || "unbekannt"),
    uniqueId: String(deviceInfo.uniqueId || "keine Signatur"),
    prefersDark: deviceInfo.prefersDark ? "Dark Mode" : "Light Mode",
  };
}

function buildHoroskop(facts) {
  const signatur = facts.uniqueId.slice(0, 8);

  const line1 = pick([
    `Die Konstellation deines Geräts zeigt ein ${facts.platform}.`,
    `In den Daten zeichnet sich ein ${facts.platform} ab.`,
    `Dein Gerät erscheint in dieser Lesung als ${facts.platform}.`,
  ]);

  const line2 = pick([
    `Dein Blickfeld von ${facts.screenWidth} x ${facts.screenHeight} Pixeln bestimmt, wie sich deine Welt entfaltet.`,
    `Die Auflösung ${facts.screenWidth} x ${facts.screenHeight} formt den Rahmen deiner Wahrnehmung.`,
    `Mit ${facts.screenWidth} x ${facts.screenHeight} Pixeln entfaltet sich deine sichtbare Welt.`,
  ]);

  const line3 = pick([
    `Der ${facts.prefersDark} liegt wie ein Schleier über deiner digitalen Aura.`,
    `Dein ${facts.prefersDark} wirkt wie ein Schleier über deiner Oberfläche.`,
    `Auch dein ${facts.prefersDark} wird Teil deiner digitalen Aura.`,
  ]);

  const line4 = pick([
    `Ein Ort zeichnet sich in den Daten ab: ${facts.city}, ${facts.country}.`,
    `Die Daten verweisen auf einen Ort: ${facts.city}, ${facts.country}.`,
    `Ein ungefährer Ort wird sichtbar: ${facts.city}, ${facts.country}.`,
  ]);

  const line5 = pick([
    `Sprache ${facts.language}, Zeitzone ${facts.timeZone}, Cookies ${facts.cookieEnabled} und die Signatur ${signatur} formen dein technisches Sternbild.`,
    `Aus Sprache ${facts.language}, Zeitzone ${facts.timeZone}, Cookies ${facts.cookieEnabled} und der Signatur ${signatur} entsteht dein technisches Sternbild.`,
    `Sprache ${facts.language}, Zeitzone ${facts.timeZone}, Cookies ${facts.cookieEnabled} und Signatur ${signatur} verweben sich zu deinem technischen Sternbild.`,
  ]);

  return [line1, line2, line3, line4, line5].join(" ");
}

// API
app.post("/api/horoskop", (req, res) => {
  try {
    const deviceInfo = req.body?.deviceInfo || {};
    const facts = buildFacts(deviceInfo);
    const horoskop = buildHoroskop(facts);

    res.json({ horoskop });
  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({
      error: "Fehler bei der Generierung.",
    });
  }
});

// Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🔮 Server läuft auf Port ${PORT}`);
});
