# cameronloveland.github.io

## Summary
Sci‑fi themed portfolio built with Next.js, React, and TypeScript. The site exports statically for hosting on GitHub Pages and features a cockpit‑style interface with parallax layers, animations, and real‑time GitHub activity.

## Live URL
[https://cameronloveland.github.io](https://cameronloveland.github.io)

## Tech Stack
- Next.js + React + TypeScript
- Tailwind CSS with custom animations
- Three.js via @react-three/fiber

## Features
- ✅ Next.js + React + TypeScript
- ✅ Static export for GitHub Pages (`/docs`, `.nojekyll`)
- ✅ Tailwind CSS with custom animation config
- ✅ Floating astronaut with jetpack animation
- ✅ EarthBackground with glow, cloud layer, and parallax
- ✅ Parallax mouse tracking (1st-person POV)
- ✅ HUD cockpit overlay frame
- ✅ Real-time Captain’s Log with GitHub commits and PRs
- ✅ Intro entry sequence (fade + swing transitions)
- ✅ RadioPlayer docked footer with animated UI
- ✅ Auto-scrolling log with pause-on-hover logic

### 📋 TODO
- [ ] HUD scanline glow + ambient pulses
- [ ] Starfield speed / comet flybys
- [ ] Interactive cockpit controls (via keyboard or terminal)
- [ ] Earth Day/Night shadow logic
- [ ] Planets / additional layers

## Local Dev / Build Steps
```bash
cd portfolio
npm install
npm run dev
npm run build
```

## Folder Structure
```
portfolio/
├── src/           # Next.js App Router source
├── public/        # Static assets
└── docs/          # Static export for GitHub Pages
```

## License
See [LICENSE](LICENSE) for usage details.
