
# cameronloveland.github.io

This is my personal portfolio and visualization showcase site, built with **Next.js** and **React**. It’s statically exported for GitHub Pages hosting, so everything runs fast and clean!

---

## 🚀 Local Development

\`\`\`bash
cd portfolio
npm install
npm run dev
\`\`\`

✅ **\`npm run dev\`**  
- Starts the live Next.js dev server for local preview and development.

---

## 🏗️ Build and Deploy

\`\`\`bash
cd portfolio
npm run build
\`\`\`

✅ **\`npm run build\`**  
- Runs the Next.js build process, creating a **static site export** in the \`out/\` directory.

✅ The deploy workflow then:  
- Copies \`portfolio/out/\` to the \`/docs\` folder.  
- Adds a \`.nojekyll\` file so GitHub Pages serves the \`_next/\` folder (no Jekyll interference).  
- Pushes \`/docs\` to the \`main\` branch for GitHub Pages hosting.

---

## 🟢 GitHub Pages

- **Branch**: \`main\`  
- **Folder**: \`/docs\`  
- **URL**: [https://cameronloveland.github.io/](https://cameronloveland.github.io/)

---

## 🧩 Tech Stack & Features

- **Framework**: [Next.js](https://nextjs.org/)  
- **Language**: [React](https://reactjs.org/) with TypeScript  
- **Visualizations**: Using any modern JS/TS visualization libraries (D3.js, Chart.js, Three.js, etc.).  
- **Static Export**: Next.js’s built-in \`output: 'export'\` for blazing fast static deployment.

---

## ⚙️ Deployment Automation

The deploy workflow is handled by **GitHub Actions** in [\`.github/workflows/deploy.yml\`](.github/workflows/deploy.yml).  
✅ It automatically deploys the latest build whenever changes are pushed to the \`main\` branch.

---

## 🟡 Development Notes

- \`.nojekyll\` is **critical** for GitHub Pages to serve \`_next/\` static assets.  
- If you want to add new visualizations or pages, just add React components—Next.js will build them into the static site.  
- No need to toggle \`output: 'export'\`—it’s always on in \`next.config.js\` for simplicity.

---

Enjoy the site! 🚀✨
