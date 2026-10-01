/* =========================================================
   Build de produção
   Gera a pasta docs/ (publicada no GitHub Pages) com:
   - JavaScript: todos os módulos unidos em um só arquivo e minificados
   - CSS: minificado
   - SVG: comentários e espaços removidos
   - HTML: comentários removidos e caminhos apontando para os arquivos otimizados
   Uso: npm install  (uma vez)  →  npm run build
   ========================================================= */
import { build } from "esbuild";
import { rm, mkdir, cp, readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ORIGEM = "patinha-solidaria";
const DESTINO = "docs";
const kb = (bytes) => (bytes / 1024).toFixed(1) + " KB";

async function tamanhoDaPasta(pasta) {
  let total = 0;
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, item.name);
    total += item.isDirectory() ? await tamanhoDaPasta(caminho) : (await stat(caminho)).size;
  }
  return total;
}

async function minificarSVGs(pasta) {
  for (const item of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) { await minificarSVGs(caminho); continue; }
    if (extname(item.name) !== ".svg") continue;
    const svg = await readFile(caminho, "utf8");
    const otimizado = svg
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/>\s+</g, "><")
      .replace(/(\d+\.\d{2})\d+/g, "$1") /* limita casas decimais */
      .trim();
    await writeFile(caminho, otimizado);
  }
}

console.log("🐾 Gerando build de produção...\n");
await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });

/* 1. JavaScript: une os módulos e minifica (a CDN do confetti continua externa) */
await build({
  entryPoints: [`${ORIGEM}/js/main.js`],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  outfile: `${DESTINO}/js/app.min.js`,
  external: ["https://*"],
  legalComments: "none"
});

/* 2. CSS minificado */
await build({
  entryPoints: [`${ORIGEM}/css/style.css`],
  minify: true,
  outfile: `${DESTINO}/css/style.min.css`
});

/* 3. Imagens e fragmentos HTML */
await cp(`${ORIGEM}/imagens`, `${DESTINO}/imagens`, { recursive: true });
await cp(`${ORIGEM}/html`, `${DESTINO}/html`, { recursive: true });
await minificarSVGs(`${DESTINO}/imagens`);

/* 4. index.html apontando para os arquivos otimizados */
let html = await readFile(`${ORIGEM}/index.html`, "utf8");
html = html
  .replace("css/style.css", "css/style.min.css")
  .replace('src="js/main.js"', 'src="js/app.min.js"')
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/\n\s*\n/g, "\n");
await writeFile(`${DESTINO}/index.html`, html);

/* 5. Desativa o processamento Jekyll do GitHub Pages */
await writeFile(`${DESTINO}/.nojekyll`, "");

const antes = await tamanhoDaPasta(ORIGEM);
const depois = await tamanhoDaPasta(DESTINO);
console.log(`✅ Build concluído em ./${DESTINO}`);
console.log(`   Código-fonte: ${kb(antes)}  →  Produção: ${kb(depois)}  (${Math.round((1 - depois / antes) * 100)}% menor)`);
