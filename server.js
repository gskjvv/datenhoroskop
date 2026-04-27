import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// Helper
// -----------------------------
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// -----------------------------
// Daten aufbereiten
// -----------------------------
function buildFacts(deviceInfo) {
  const safe = deviceInfo || {};

  return {
    language: String(safe.language || "unbekannt"),
    platform: String(safe.platform || "unbekannt"),
    screenWidth: safe.screenWidth || "unbekannt",
    screenHeight: safe.screenHeight || "unbekannt",
    timeZone: String(safe.timeZone || "unbekannt"),
    city: String(safe.city || "unbekannt"),
    region: String(safe.region || "unbekannt"),
    country: String(safe.country || "unbekannt"),
    cookieEnabled: String(safe.cookieEnabled || "unbekannt"),
    uniqueId: String(safe.uniqueId || "keine Signatur"),
  };
}

// -----------------------------
// Horoskop generieren
// -----------------------------
function buildHoroskop(facts) {
  const signatur = facts.uniqueId.slice(0, 8);

  const line1 = pick([
    `Dein Gerät spricht die Sprache ${facts.language} und nutzt ein System wie ${facts.platform}.`,
    `Die Konstellation zeigt ein Gerät mit ${facts.platform} und einer bevorzugten Sprache von ${facts.language}.`,
  ]);

  const line2 = pick([
    `Die Auflösung von ${facts.screenWidth} × ${facts.screenHeight} bestimmt, wie deine Welt dargestellt wird.`,
    `Mit einer Anzeige von ${facts.screenWidth} × ${facts.screenHeight} formt dein Bildschirm deine Wahrnehmung.`,
  ]);

  const line3 = pick([
    `Deine Zeit ist auf ${facts.timeZone} ausgerichtet.`,
    `Die Zeitstruktur deines Systems verweist auf ${facts.timeZone}.`,
  ]);

  const line4 = pick([
    `Auch dein ungefährer Standort wird sichtbar: ${facts.city}, ${facts.country}.`,
    `Dein Gerät verrät einen Ort: ${facts.city}, ${facts.country}.`,
    `Aus deinen Daten lässt sich ein Standort ableiten: ${facts.city}, ${facts.country}.`,
  ]);

  const line5 = pick([
    `Cookies sind ${facts.cookieEnabled} aktiviert, und die Signatur ${signatur} bleibt bestehen.`,
    `Der Zustand deiner Cookies ist ${facts.cookieEnabled}, begleitet von der Signatur ${signatur}.`,
    `Mit Cookies ${facts.cookieEnabled} und der Kennung ${signatur} entsteht ein wiedererkennbares Muster.`,
  ]);

  return [line1, line2, line3, line4, line5].join(" ");
}

// -----------------------------
// API Route
// -----------------------------
app.post("/api/horoskop", (req, res) => {
  try {
    const deviceInfo = req.body.deviceInfo;
    const facts = buildFacts(deviceInfo);
    const horoskop = buildHoroskop(facts);

    res.json({ horoskop });
  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({
      horoskop:
        "Die Sterne bleiben heute still. Beim Generieren ist ein Fehler aufgetreten.",
    });
  }
});

// -----------------------------
// Server starten
// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
