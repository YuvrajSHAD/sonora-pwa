export class MusicPlayer {
  constructor(audio, ui, onStatus = () => {}) {
    this.audio = audio;
    this.ui = ui;
    this.onStatus = onStatus;
    this.tracks = [];
    this.index = 0;
    this.isSeeking = false;

    audio.addEventListener("loadedmetadata", () => {
      ui.seek.max = String(Number.isFinite(audio.duration) ? audio.duration : 0);
      ui.duration.textContent = this.formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      if (!this.isSeeking) ui.seek.value = String(audio.currentTime || 0);
      ui.currentTime.textContent = this.formatTime(audio.currentTime);
    });
    audio.addEventListener("play", () => this.setPlaying(true));
    audio.addEventListener("pause", () => this.setPlaying(false));
    audio.addEventListener("ended", () => this.next());
    audio.addEventListener("error", () => {
      this.onStatus("This track couldn't be played. Skipping to the next one.", "error");
      if (this.tracks.length > 1) this.next();
    });

    ui.seek.addEventListener("input", () => {
      this.isSeeking = true;
      ui.currentTime.textContent = this.formatTime(Number(ui.seek.value));
    });
    ui.seek.addEventListener("change", () => {
      this.audio.currentTime = Number(ui.seek.value);
      this.isSeeking = false;
    });
    ui.volume.addEventListener("input", () => {
      this.audio.volume = Number(ui.volume.value);
      ui.volumeValue.textContent = `${Math.round(this.audio.volume * 100)}%`;
    });
    ui.play.addEventListener("click", () => this.toggle());
    ui.previous.addEventListener("click", () => this.previous());
    ui.next.addEventListener("click", () => this.next());
    this.audio.volume = Number(ui.volume.value);
  }

  setTracks(tracks) {
    this.tracks = tracks;
    this.index = 0;
    this.loadCurrent(false);
  }

  loadCurrent(autoplay = false) {
    const track = this.tracks[this.index];
    if (!track) return;
    this.audio.src = track.audio;
    this.audio.load();
    this.ui.title.textContent = track.name || "Untitled track";
    this.ui.artist.textContent = track.artist_name || "Unknown artist";
    this.ui.genre.textContent = (track.musicinfo?.tags?.genres || []).slice(0, 2).join(" · ").toUpperCase() || "YOUR MIX";
    this.ui.index.textContent = `${this.index + 1} / ${this.tracks.length}`;
    this.ui.seek.value = "0";
    this.ui.currentTime.textContent = "0:00";
    this.ui.duration.textContent = "0:00";
    const image = track.album_image || track.image;
    this.ui.artwork.replaceChildren();
    this.ui.artwork.classList.remove("artwork-placeholder");
    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.alt = `Artwork for ${track.name}`;
      img.referrerPolicy = "no-referrer";
      img.onerror = () => this.showArtworkPlaceholder();
      this.ui.artwork.append(img);
    } else {
      this.showArtworkPlaceholder();
    }
    if (autoplay) this.play();
    else this.setPlaying(false);
  }

  showArtworkPlaceholder() {
    this.ui.artwork.classList.add("artwork-placeholder");
    this.ui.artwork.innerHTML = '<div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="art-center"><span class="art-sun">✳</span><span class="art-word">SONORA</span></div>';
  }

  async play() {
    if (!this.tracks.length) return;
    try {
      await this.audio.play();
      this.onStatus("Now playing. Enjoy the moment.", "success");
    } catch (error) {
      this.onStatus("Playback was blocked or the stream is unavailable. Press play to try again.", "error");
    }
  }

  pause() {
    this.audio.pause();
  }

  toggle() {
    if (this.audio.paused) this.play();
    else this.pause();
  }

  next() {
    if (!this.tracks.length) return;
    this.index = (this.index + 1) % this.tracks.length;
    this.loadCurrent(true);
  }

  previous() {
    if (!this.tracks.length) return;
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    this.index = (this.index - 1 + this.tracks.length) % this.tracks.length;
    this.loadCurrent(true);
  }

  setPlaying(playing) {
    this.ui.play.setAttribute("aria-label", playing ? "Pause" : "Play");
    this.ui.playIcon.classList.toggle("hidden", playing);
    this.ui.pauseIcon.classList.toggle("hidden", !playing);
  }

  formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }
}
