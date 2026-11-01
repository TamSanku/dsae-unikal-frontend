/*
 * Recopie le moteur PDF.js dans `public/`, là où le navigateur le demande.
 *
 * PDF.js lit le document dans un fil de travail séparé, chargé depuis une
 * adresse. On le sert depuis notre propre domaine : le document ne part donc
 * pas chez un tiers, et le moteur suit la version de `pdfjs-dist` installée au
 * lieu d'être figée dans le dépôt. Le fichier est produit au déploiement, pas
 * versionné.
 */
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const from = require.resolve('pdfjs-dist/build/pdf.worker.min.mjs');
const target = join(process.cwd(), 'public', 'pdf.worker.min.mjs');

mkdirSync(dirname(target), { recursive: true });
copyFileSync(from, target);

const { version } = JSON.parse(
  readFileSync(require.resolve('pdfjs-dist/package.json'), 'utf8')
);
console.log(`Moteur PDF.js ${version} copié vers public/pdf.worker.min.mjs`);
