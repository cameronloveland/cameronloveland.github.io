# cameronloveland.github.io

This is my personal portfolio and visualization showcase site, built with **Next.js** and **React**. It’s statically exported for GitHub Pages hosting, so everything runs fast and clean!

---

## 🚀 Local Development

```bash
npm install
npm run dev
```

✅ **`npm run dev`**  
- Starts the live Next.js dev server for local preview and development.

---

## 🏗️ Build and Deploy

```bash
npm run build
```

✅ **`npm run build`**  
- Runs the Next.js build process, creating a **static site export** in the `out/` directory.

✅ The deploy workflow then:  
- Copies `out/` to the `/docs` folder  
- Adds a `.nojekyll` file so GitHub Pages serves the `_next/` folder (no Jekyll interference)  
- Pushes `/docs` to the `main` branch for GitHub Pages hosting

---

## 🟢 GitHub Pages

- **Branch**: `main`  
- **Folder**: `/docs`  
- **URL**: [https://cameronloveland.github.io/](https://cameronloveland.github.io/)

---

## 🧩 Tech Stack & Features

- **Framework**: [Next.js](https://nextjs.org/)  
- **Language**: [React](https://reactjs.org/) with TypeScript  
- **Visualizations**: 3D and data views via `three.js`, `react-three-fiber`, `Chart.js`, etc.  
- **Static Export**: Next.js `output: 'export'` for optimized GitHub Pages hosting

---

## ⚙️ Deployment Automation

The deploy workflow is handled by **GitHub Actions** in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)  
✅ Automatically deploys on push to `main`

---

## 🟡 Development Notes

- `.nojekyll` is required for GitHub Pages to serve `_next/` static files  
- All routes and pages live in `src/app/` using the Next.js App Router  
- `next.config.js` is preconfigured for static export compatibility

---

## 🛸 Immersive Theme Overview

This site is more than a portfolio — it's an interactive cockpit experience in orbit. Designed with layered parallax, real-time GitHub integration, and a sci-fi interface inspired by space stations and control panels.

### 🧠 Tech Enhancements

- **3D Engine**: `@react-three/fiber`, `drei`, `@react-three/postprocessing`
- **Styling**: Tailwind CSS + custom `@keyframes` animations
- **Mouse-Based Parallax**: Custom React hooks for immersive first-person camera feel
- **Dynamic GitHub Feed**: Commits, PRs, and features loaded in real-time into a Captain’s Log

---

### 🗂 Folder Structure

```
src/
├── app/                # App Router entry: layout.tsx, page.tsx
│   ├── components/     # HUD, Earth layer, Log panels
│   ├── lib/            # GitHub API fetchers and utilities
│   └── styles/         # Global Tailwind and theme styles
├── hooks/              # Custom hooks (mouse position, mount logic)
public/
├── textures/           # Earth and space image assets
.nojekyll               # Needed for GitHub Pages _next/ support
tailwind.config.js      # Extended sci-fi color/animation palette
```

---

### 🌌 UI Highlights

- 🌍 Spinning Earth with atmospheric cloud layer
- 🌠 Animated nebulae using layered twinkle effects
- 📜 Captain’s Log: real-time log of commits, PRs, and features
- 🖱 Mouse-responsive parallax scroll layers
- 🎬 Entry sequence with swing/fade transitions

---

### 🧩 Next Features

- [ ] Cockpit frame overlay
- [ ] Scanline & glow HUD panels
- [ ] Ambient scan sweeps, flickers, starspeed
- [ ] Comets and astronaut float layers
- [ ] Astronaut jetpack animation and idle float logic
- [ ] Interactive ship controls (possibly via terminal or key commands)

---

Welcome aboard, and thanks for visiting! 👨‍🚀