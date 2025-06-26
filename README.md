# cameronloveland.github.io

This is my personal portfolio and visualization showcase site, built with **Next.js** and **React**. It’s statically exported for GitHub Pages hosting, so everything runs fast and clean!

---

## 🚀 Local Development

```bash
cd portfolio
npm install
npm run dev
```

✅ **`npm run dev`**  
- Starts the live Next.js dev server for local preview and development.

---

## 🏗️ Build and Deploy

```bash
cd portfolio
npm run build
```

✅ **`npm run build`**  
- Runs the Next.js build process, creating a **static site export** in the `out/` directory.

✅ The deploy workflow then:  
- Copies `portfolio/out/` to the `/docs` folder.  
- Adds a `.nojekyll` file so GitHub Pages serves the `_next/` folder (no Jekyll interference).  
- Pushes `/docs` to the `main` branch for GitHub Pages hosting.

---

## 🟢 GitHub Pages

- **Branch**: `main`  
- **Folder**: `/docs`  
- **URL**: [https://cameronloveland.github.io/](https://cameronloveland.github.io/)

---

## 🧩 Tech Stack & Features

- **Framework**: [Next.js](https://nextjs.org/)  
- **Language**: [React](https://reactjs.org/) with TypeScript  
- **Visualizations**: Using any modern JS/TS visualization libraries (D3.js, Chart.js, Three.js, etc.).  
- **Static Export**: Next.js’s built-in `output: 'export'` for blazing fast static deployment.

---

## ⚙️ Deployment Automation

The deploy workflow is handled by **GitHub Actions** in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).  
✅ It automatically deploys the latest build whenever changes are pushed to the `main` branch.

---

## 🟡 Development Notes

- `.nojekyll` is **critical** for GitHub Pages to serve `_next/` static assets.  
- If you want to add new visualizations or pages, just add React components—Next.js will build them into the static site.  
- No need to toggle `output: 'export'`—it’s always on in `next.config.js` for simplicity.

---

Enjoy the site! 🚀✨
---

## 🛸 Immersive Theme Overview

This site is more than a portfolio — it's an interactive cockpit experience in orbit. Designed with layered parallax, real-time GitHub integration, and a sci-fi interface inspired by space stations and control panels.

### 🧠 Tech Enhancements

- **3D Engine**: `@react-three/fiber`, `drei`, `@react-three/postprocessing`
- **Styling**: Tailwind CSS + custom `@keyframes` animations
- **Mouse-Based Parallax**: React hooks for smooth POV-style movement
- **Dynamic GitHub Feed**: Commits, branches, PRs updated live via API

### 🗂 Folder Structure

```
.
├── app/                # Next.js app routes (app directory)
├── components/         # UI panels, HUD, Earth, Captain’s Log
├── hooks/              # Custom hooks like useMousePosition
├── lib/                # GitHub API clients
├── public/textures/    # 3D assets like Earth, clouds
├── styles/             # Global CSS and fonts
└── tailwind.config.js  # Custom themes, animations
```

### 🌌 UI Highlights

- 🌍 Spinning Earth with cloud layers
- 🌠 Animated nebulae background with `twinkle` effect
- 📜 Captain’s Log with GitHub + interaction history
- 🎬 Animated hero sequence → cockpit HUD panels
- 👨‍🚀 Mouse-based parallax for immersive navigation

### 🧩 Next Features

- [ ] Cockpit frame overlay
- [ ] Scanline & glow HUD panels
- [ ] Ambient scan sweeps, flickers, starspeed
- [ ] Comets and astronaut float layers

---

Welcome aboard, and thanks for visiting! 👨‍🚀
