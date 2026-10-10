const API_BASE = "https://api.jamendo.com/v3.0";

const TAGS = {
  electronic: "electronic",
  hiphop: "hiphop",
  rock: "rock",
  jazz: "jazz",
  classical: "classical",
  ambient: "ambient",
  lofi: "lofi",
  pop: "pop"
};

function getClientId() {
  return (window.SONORA_CONFIG?.JAMENDO_CLIENT_ID || "").trim();
}

export function hasClientId() {
  return Boolean(getClientId());
}

export async function fetchTracks(genres, limit = 30) {
  const clientId = getClientId();
  if (!clientId) {
    const error = new Error("Add your Jamendo client ID in js/config.js to load real music.");
    error.code = "MISSING_CLIENT_ID";
    throw error;
  }

  const tags = [...new Set(genres.map(g => TAGS[g]).filter(Boolean))].join("+");
  const params = new URLSearchParams({
    client_id: clientId,
    format: "json",
    limit: String(limit),
    order: "popularity_total",
    audioformat: "mp32",
    include: "musicinfo",
    imagesize: "600",
    boost: "popularity_month"
  });
  if (tags) params.set("tags", tags);
  const response = await fetch(`${API_BASE}/tracks/?${params.toString()}`);
  if (!response.ok) throw new Error(`Jamendo returned HTTP ${response.status}.`);
  const payload = await response.json();
  if (payload.headers?.status === "error") {
    throw new Error(payload.headers.error_message || "Jamendo rejected the request. Check your client ID.");
  }
  const tracks = (payload.results || []).filter(track => track.audio && track.name);
  if (!tracks.length) throw new Error("No playable tracks were returned for these genres. Try selecting different genres.");
  return tracks;
}
