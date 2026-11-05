import { createHash } from 'node:crypto';

/*
 * Les couvertures partagées.
 *
 * Le backend range une image sous une adresse par média : deux documents
 * importés d'un même lot reçoivent donc deux adresses… pour la même image. À
 * l'écran, dix cartes montrent dix fois le même visuel décoratif — le plus
 * souvent une image sombre sans rapport avec le document.
 *
 * Comparer les adresses ne suffit pas : elles diffèrent. On lit donc les
 * premiers octets de chaque image et on en prend l'empreinte. Deux couvertures
 * qui commencent par les mêmes octets sont la même image ; elle n'est alors pas
 * propre au document, et la carte lui préférera un fond de catégorie.
 *
 * Ce travail se fait côté serveur, une fois par rendu de la page Publications.
 * L'empreinte d'une adresse ne change jamais (les médias sont immuables), on la
 * garde donc en mémoire le temps du processus.
 */

/** Assez d'octets pour distinguer deux images, assez peu pour rester léger. */
const SAMPLE_BYTES = 8192;

/** Une image lente ne doit pas retarder la page : passé ce délai, on renonce. */
const FETCH_TIMEOUT_MS = 3500;

const SIGNATURES = new Map<string, string>();

async function signature(url: string): Promise<string> {
  const known = SIGNATURES.get(url);
  if (known !== undefined) return known;

  let hash = '';
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (size < SAMPLE_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        size += value.length;
      }
      await reader.cancel().catch(() => {});
      /* La dernière lecture peut dépasser la taille demandée : on coupe la
       * tranche à la longueur fixe, sinon deux images identiques lues par
       * paquets différents n'auraient pas la même empreinte. */
      const sample = new Uint8Array(Math.min(size, SAMPLE_BYTES));
      let offset = 0;
      for (const chunk of chunks) {
        if (offset >= sample.length) break;
        const slice = chunk.subarray(0, sample.length - offset);
        sample.set(slice, offset);
        offset += slice.length;
      }
      hash = createHash('sha256').update(sample).digest('hex');
    }
  } catch {
    hash = '';
  }

  SIGNATURES.set(url, hash);
  return hash;
}

/** Les adresses dont l'image est partagée par plus d'un document — plus celles
 * qui n'ont pas pu être lues. La carte les remplace par un fond de catégorie. */
export async function sharedCoverUrls(urls: (string | null | undefined)[]): Promise<string[]> {
  const unique = Array.from(
    new Set(urls.map((url) => (url ?? '').trim()).filter(Boolean)),
  );

  const hashes = new Map<string, string>();
  await Promise.all(
    unique.map(async (url) => {
      hashes.set(url, await signature(url));
    }),
  );

  const counts = new Map<string, number>();
  for (const url of unique) {
    const hash = hashes.get(url) ?? '';
    if (!hash) continue;
    counts.set(hash, (counts.get(hash) ?? 0) + 1);
  }

  return unique.filter((url) => {
    const hash = hashes.get(url) ?? '';
    return !hash || (counts.get(hash) ?? 0) > 1;
  });
}
