# Sonora 🎧

**A minimal music listening experience, built for the web.**

Sonora is a lightweight, installable music Progressive Web App (PWA) focused on a clean interface and simple music playback. Browse music by genre, discover tracks, and listen without the clutter of a traditional music streaming interface.

## ✨ Features

- **Genre-based discovery** — Explore genres such as Electronic, Hip-hop, Rock, Jazz, Classical, Ambient, Lo-fi, and Pop.
- **Music playback** — Play, pause, skip to the next track, or return to the previous track.
- **Playback progress** — View track progress and control playback position.
- **Volume control** — Adjust audio volume directly from the player.
- **Responsive design** — Designed for both desktop and mobile screens.
- **Progressive Web App** — Includes a web app manifest and service worker for installability and app-shell caching.
- **Jamendo integration** — Fetch music using the Jamendo API.

## 🛠️ Built With

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- HTML Audio API
- Jamendo API
- Progressive Web App technologies

No frontend framework is required.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/sonora-pwa.git
cd sonora-pwa
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Configure the Jamendo API

Create a Jamendo application and obtain your Client ID from the Jamendo developer portal.

Open `js/config.js` and add your Client ID:

```javascript
window.SONORA_CONFIG = {
  JAMENDO_CLIENT_ID: "YOUR_JAMENDO_CLIENT_ID"
};
```

Replace the placeholder with your actual Client ID.

**Note:** A client ID used in browser-side JavaScript is public. Do not put private API secrets, passwords, or other confidential credentials in frontend files.

### 3. Run the app locally

Serve the project through a local development server. For example, with Visual Studio Code:

1. Open the project folder.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

Avoid opening `index.html` directly using a `file://` URL, as modules and service workers require an appropriate local server context.

## 📁 Project Structure

```text
sonora-pwa/
├── index.html
├── manifest.json
├── sw.js
├── assets/
│   └── icon.svg
├── css/
│   └── styles.css
└── js/
    ├── config.js
    ├── jamendo.js
    ├── player.js
    └── app.js
```

## 🎵 Music and API

Sonora uses the Jamendo API to retrieve music. Track availability, playback URLs, and API access depend on Jamendo's service and applicable terms.

Please review the relevant API terms and music licensing conditions before deploying or redistributing the app.

## 📱 Installation

When hosted over HTTPS on a supported browser, Sonora can be eligible for installation as a Progressive Web App. Available installation options depend on the browser and device.

## 🗺️ Roadmap

- [ ] Improve playback and loading states.
- [ ] Refine the mobile listening experience.
- [ ] Test installation and offline app-shell behavior across devices.
- [ ] Improve error handling for unavailable tracks and API failures.

## 🤝 Contributing

Suggestions, bug reports, and contributions are welcome. Feel free to open an issue or submit a pull request.

## 📄 License

No license has been specified yet. Add a `LICENSE` file before explicitly permitting others to reuse, modify, or redistribute this project.

---

**Sonora** — less clutter, more listening.
