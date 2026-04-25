// -----------------------------
// Horoskop vom Server holen
// -----------------------------
async function requestHoroskop(deviceInfo) {
  try {
    const response = await fetch("/api/horoskop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceInfo }),
    });

    if (!response.ok) {
      throw new Error(`Fehler bei der Horoskop-Anfrage: ${response.status}`);
    }

    const data = await response.json();
    return data.horoskop || "Kein Horoskop erhalten.";
  } catch (error) {
    console.error("Fehler bei der Horoskop-Anfrage:", error);
    return "Die Sterne bleiben heute still. Beim Laden deines Datenhoroskops ist ein Fehler aufgetreten.";
  }
}

// -----------------------------
// Text Satz für Satz einblenden
// -----------------------------
function splitIntoSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function showTextSlow(text, element) {
  const sentences = splitIntoSentences(text);

  element.innerHTML = "";

  if (sentences.length === 0) {
    const p = document.createElement("p");
    p.textContent = text;
    element.appendChild(p);
    return;
  }

  sentences.forEach((sentence, index) => {
    setTimeout(() => {
      const p = document.createElement("p");
      p.textContent = sentence;
      p.style.opacity = "0";
      p.style.transform = "translateY(8px)";
      p.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      element.appendChild(p);

      requestAnimationFrame(() => {
        p.style.opacity = "1";
        p.style.transform = "translateY(0)";
      });
    }, index * 900);
  });
}

// -----------------------------
// Hinweis verzögert einblenden
// -----------------------------
function revealDataHint(delay = 6000) {
  setTimeout(() => {
    const hint = document.querySelector(".data-hint");
    if (hint) {
      hint.style.opacity = "1";
    }
  }, delay);
}

// -----------------------------
// Geräteinfos sammeln
// -----------------------------
async function getData(startTime, minDisplayTime) {
  const overlay = document.getElementById("loadingOverlay");
  const horoskopDiv = document.getElementById("horoskopText");
  const textElement = document.querySelector(".crystal-ball-text");

  const language = navigator.language || "unbekannt";
  const userAgent = navigator.userAgent || "unbekannt";
  const screenSize = `${screen.width} × ${screen.height}`;
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  const platform = navigator.platform || "unbekannt";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dateTime = new Date().toLocaleString();
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "unbekannt";
  const deviceMemory = navigator.deviceMemory || "unbekannt";
  const hardwareConcurrency = navigator.hardwareConcurrency || "unbekannt";
  const touchSupport = navigator.maxTouchPoints > 0 ? "ja" : "nein";
  const cookieEnabled = navigator.cookieEnabled ? "ja" : "nein";
  const doNotTrack = navigator.doNotTrack === "1" ? "ja" : "nein";
  const colorDepth = `${screen.colorDepth}-bit`;

  let uniqueId = localStorage.getItem("cosmicId");
  if (!uniqueId) {
    uniqueId = crypto.randomUUID();
    localStorage.setItem("cosmicId", uniqueId);
  }

  try {
    // ungefähren Standort über IP holen
    const ipRes = await fetch("https://ipapi.co/json/");
    if (!ipRes.ok) {
      throw new Error("IP-Daten konnten nicht geladen werden");
    }

    const ipData = await ipRes.json();

    const deviceInfo = {
      language,
      userAgent,
      screenSize,
      screenWidth,
      screenHeight,
      platform,
      prefersDark,
      dateTime,
      timeZone,
      deviceMemory,
      hardwareConcurrency,
      touchSupport,
      cookieEnabled,
      doNotTrack,
      colorDepth,
      ip: ipData.ip || "unbekannt",
      city: ipData.city || "unbekannt",
      region: ipData.region || "unbekannt",
      country: ipData.country_name || "unbekannt",
      lat: ipData.latitude || "unbekannt",
      lon: ipData.longitude || "unbekannt",
      uniqueId,
    };

    const horoskop = await requestHoroskop(deviceInfo);

    // erst Overlay ausblenden, dann Text aufbauen
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(minDisplayTime - elapsed, 0);

    setTimeout(() => {
      if (textElement) {
        textElement.classList.add("fly-away");

        const woosh = new Audio("sounds/woosh.mp3");
        woosh.volume = 0.5;
        woosh.play().catch(() => {
          // ignorieren, wenn Browser Audio blockt
        });
      }

      setTimeout(() => {
        if (overlay) {
          overlay.classList.add("hidden");

          setTimeout(() => {
            overlay.style.display = "none";
            showTextSlow(horoskop, horoskopDiv);
            revealDataHint(6000);
          }, 500);
        } else {
          showTextSlow(horoskop, horoskopDiv);
          revealDataHint(6000);
        }
      }, 1200);
    }, remaining);
  } catch (error) {
    console.error("Fehler beim Laden des Horoskops:", error);

    const fallbackText =
      "Dein digitales Sternbild bleibt heute verschleiert. Die Daten konnten nicht vollständig gelesen werden, doch eine Spur ist bereits entstanden.";

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(minDisplayTime - elapsed, 0);

    setTimeout(() => {
      if (textElement) {
        textElement.classList.add("fly-away");
      }

      setTimeout(() => {
        if (overlay) {
          overlay.classList.add("hidden");

          setTimeout(() => {
            overlay.style.display = "none";
            showTextSlow(fallbackText, horoskopDiv);
            revealDataHint(6000);
          }, 500);
        } else {
          showTextSlow(fallbackText, horoskopDiv);
          revealDataHint(6000);
        }
      }, 1200);
    }, remaining);
  }
}

// -----------------------------
// Start
// -----------------------------
window.addEventListener("load", () => {
  const minDisplayTime = 4500;
  const startTime = Date.now();

  getData(startTime, minDisplayTime);
});
