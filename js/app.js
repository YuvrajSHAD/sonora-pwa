import { fetchTracks, hasClientId } from "./jamendo.js";
import { MusicPlayer } from "./player.js";

const $ = id => document.getElementById(id);
const ui = {
  genreScreen: $("genre-screen"), playerScreen: $("player-screen"),
  genreGrid: $("genre-grid"), selectionCount: $("selection-count"),
  start: $("start-button"), back: $("back-button"), changeGenre: $("change-genre"),
  mood: $("mood-label"), audio: $("audio"), artwork: $("artwork"),
  title: $("track-title"), artist: $("track-artist"), genre: $("track-genre"),
  index: $("track-index"), seek: $("seek"), currentTime: $("current-time"),
  duration: $("duration"), play: $("play-button"), playIcon: $("play-icon"),
  pauseIcon: $("pause-icon"), previous: $("previous-button"), next: $("next-button"),
  volume: $("volume"), volumeValue: $("volume-value"), status: $("status-message"),
  toast: $("toast")
};

const selectedGenres = new Set();
const player = new MusicPlayer(ui.audio, ui, setStatus);
let toastTimer;

ui.genreGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-genre]");
  if (!button) return;
  const genre = button.dataset.genre;
  if (selectedGenres.has(genre)) selectedGenres.delete(genre);
  else selectedGenres.add(genre);
  button.setAttribute("aria-pressed", String(selectedGenres.has(genre)));
  ui.selectionCount.textContent = `${selectedGenres.size} SELECTED`;
  ui.start.disabled = selectedGenres.size === 0;
});

ui.start.addEventListener("click", enterPlayer);
ui.back.addEventListener("click", returnToGenres);
ui.changeGenre.addEventListener("click", returnToGenres);

async function enterPlayer() {
  ui.genreScreen.classList.add("hidden");
  ui.playerScreen.classList.remove("hidden");
  window.scrollTo(0, 0);
  const names = [...selectedGenres].map(genreName);
  ui.mood.textContent = names.length ? names.join(" · ") : "A mix made for you";
  ui.title.textContent = "Finding your sound…";
  ui.artist.textContent = "Connecting to Jamendo";
  ui.genre.textContent = "CURATING YOUR MIX";
  ui.status.classList.remove("error");
  if (!hasClientId()) {
    ui.title.textContent = "Your sound is waiting.";
    ui.artist.textContent = "One quick setup step";
    setStatus("Add a Jamendo client ID in js/config.js, then refresh. See README.md for instructions.", "error");
    showToast("Jamendo setup needed — see README.md");
    return;
  }
  setStatus("Finding tracks that match your taste…");
  try {
    const tracks = await fetchTracks([...selectedGenres]);
    player.setTracks(tracks);
    setStatus(`${tracks.length} tracks found. Press play when you're ready.`);
  } catch (error) {
    ui.title.textContent = "The quiet before the music.";
    ui.artist.textContent = "We couldn't load your mix";
    setStatus(error.message || "Couldn't load music. Check your connection and try again.", "error");
    showToast("Couldn't load tracks");
  }
}

function returnToGenres() {
  ui.audio.pause();
  ui.playerScreen.classList.add("hidden");
  ui.genreScreen.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function genreName(value) {
  return ({hiphop:"Hip-hop",lofi:"Lo-fi",electronic:"Electronic",classical:"Classical"})[value] ||
    value.charAt(0).toUpperCase() + value.slice(1);
}

function setStatus(message, type = "") {
  ui.status.textContent = message;
  ui.status.classList.toggle("error", type === "error");
}

function showToast(message) {
  clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 3000);
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => console.warn("Service worker registration failed:", error));
  });
}
