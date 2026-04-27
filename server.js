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
    `Dein Gerät meldet sich hier als ${facts.platform}.`,
    `Diese Seite liest dein Gerät als ${facts.platform}.`,
    `In dieser Lesung erscheint dein Gerät als ${facts.platform}.`,
  ]);

  const line2 = pick([
    `Dein Bildschirm wurde als ${facts.screenWidth} x ${facts.screenHeight} Pixel ausgelesen.`,
    `Die Fläche deines Bildschirms verrät ${facts.screenWidth} x ${facts.screenHeight} Pixel.`,
    `Aus deinem Display wurden ${facts.screenWidth} x ${facts.screenHeight} Pixel gelesen.`,
  ]);

  const line3 = pick([
    `Dein System erscheint im ${facts.prefersDark}, und auch diese Oberfläche wird Teil deiner Spur.`,
    `${facts.prefersDark} wirkt wie eine Einstellung, wird hier aber als Datenpunkt sichtbar.`,
    `Der ${facts.prefersDark} ist nicht nur Gestaltung, sondern ebenfalls auslesbare Information.`,
  ]);

  const line4 = pick([
    `Auch dein ungefährer Standort wird sichtbar: ${facts.city}, ${facts.country}.`,
    `Aus deiner IP-Adresse lässt sich ein ungefährer Ort ableiten: ${facts.city}, ${facts.country}.`,
    `Dein Ort erscheint nicht als Geheimnis, sondern als Angabe: ${facts.city}, ${facts.country}.`,
  ]);

  const line5 = pick([
    `Cookies sind ${facts.cookieEnabled} aktiviert, und die Signatur ${signatur} bleibt als wiedererkennbare Spur bestehen.`,
    `Mit Sprache ${facts.language}, Zeitzone ${facts.timeZone}, Cookies ${facts.cookieEnabled} und Signatur ${signatur} entsteht ein technisches Profil.`,
    `Sprache ${facts.language}, Zeitzone ${facts.timeZone} und die Signatur ${signatur} reichen aus, um aus einzelnen Daten ein Muster zu formen.`,
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
