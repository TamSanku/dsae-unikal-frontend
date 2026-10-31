/*
 * L'accès au backend DSAE (service Render « dsae-backend »), seul détenteur du
 * contenu du portail.
 *
 * Aucune donnée de remplacement n'est conservée : si l'API ne répond pas, la
 * page l'affiche au lieu de montrer un contenu inventé.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://dsae-backend.onrender.com/api';

/*
 * Les médias vivent sous `/api/public/media/<id>` : le backend les désigne par
 * cette adresse relative. Comme `API_BASE_URL` porte déjà `/api`, on rattache
 * l'adresse à l'origine du backend, jamais telle quelle — sinon on demande
 * `/api/api/public/media/...` et le média renvoie 404.
 */
export const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function mediaUrl(url: string | null | undefined): string {
  const value = (url ?? '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${BACKEND_ORIGIN}${value.startsWith('/') ? '' : '/'}${value}`;
}

/** La même adresse, mais servie en pièce jointe : c'est ce qui déclenche le
 * téléchargement au lieu de l'ouverture dans l'onglet. */
export function downloadUrl(url: string | null | undefined): string {
  const value = mediaUrl(url);
  if (!value) return '';
  return `${value}${value.includes('?') ? '&' : '?'}download=1`;
}

/** Les signataires d'un document : « A, B et C » devient trois noms. */
export function splitAuthors(authors: string): string[] {
  return (authors ?? '')
    .split(/\s*(?:,|;|\bet\b|\/|&)\s*/i)
    .map((name) => name.trim())
    .filter(Boolean);
}

export type ApiResult<T> = {
  data: T | null;
  error: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  specialty: string;
  bio: string;
  category: string;
  image: string;
  publications: string[];
};

export type ResearchArea = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  goals: string[];
  projects: string[];
  publications: string[];
};

export type Publication = {
  id: string;
  title: string;
  subtitle: string;
  authors: string;
  /** Les signataires, séparés : la fiche en montre un, le détail les montre tous. */
  authorsList: string[];
  year: number;
  category: string;
  discipline: string;
  department: string;
  summary: string;
  keywords: string[];
  references: string;
  /** Le document joint (PDF, mémoire…), tel qu'il a été importé dans un bloc. */
  documentUrl: string;
  documentName: string;
  /** L'image de couverture, montrée au format A4. */
  coverUrl: string;
  pdfUrl: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
};

export async function fetchFromApi<T>(
  endpoint: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
      ...init,
    });

    if (!response.ok) {
      return {
        data: null,
        error: `Erreur API (${response.status}) pour ${endpoint}`,
      };
    }

    const data = (await response.json()) as T;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l’appel API.',
    };
  }
}

// The backend exposes its own field names (author/description/photo/summary).
// Normalize each payload to the shape used by the public site components.
function normalizeTeamMember(raw: any, index: number): TeamMember {
  return {
    id: raw.id ?? `member-${index}`,
    name: raw.name ?? '',
    role: raw.role ?? '',
    department: raw.department ?? '',
    specialty: raw.specialty ?? '',
    bio: raw.bio ?? '',
    category: raw.category ?? '',
    image: raw.image ?? raw.photo ?? '',
    publications: Array.isArray(raw.publications) ? raw.publications : [],
  };
}

function normalizeResearchArea(raw: any, index: number): ResearchArea {
  return {
    slug: raw.slug ?? `research-${index}`,
    title: raw.title ?? '',
    category: raw.category ?? '',
    summary: raw.summary ?? '',
    description: raw.description ?? '',
    goals: Array.isArray(raw.goals) ? raw.goals : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    publications: Array.isArray(raw.publications) ? raw.publications : [],
  };
}

function normalizePublication(raw: any, index: number): Publication {
  const keywords = raw.keywords ?? raw.tags;
  const authors = raw.authors ?? raw.author ?? '';
  return {
    id: raw.id ?? `publication-${index}`,
    title: raw.title ?? '',
    subtitle: raw.subtitle ?? '',
    authors,
    authorsList: splitAuthors(authors),
    year: Number(raw.year) || 0,
    category: raw.category ?? '',
    discipline: raw.discipline ?? '',
    department: raw.department ?? '',
    summary: raw.summary ?? raw.description ?? raw.abstract ?? '',
    keywords: Array.isArray(keywords) ? keywords : [],
    references: raw.references ?? '',
    documentUrl: mediaUrl(raw.pdfUrl ?? raw.documentUrl ?? ''),
    documentName: raw.documentName ?? '',
    coverUrl: mediaUrl(raw.coverUrl ?? ''),
    pdfUrl: mediaUrl(raw.pdfUrl ?? raw.url ?? ''),
  };
}

function normalizeNewsItem(raw: any, index: number): NewsItem {
  return {
    slug: raw.slug ?? `news-${index}`,
    title: raw.title ?? '',
    category: raw.category ?? '',
    date: raw.date ?? '',
    excerpt: raw.excerpt ?? raw.summary ?? '',
    content: raw.content ?? '',
    image: raw.image ?? raw.photo ?? '',
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const published = await fetchPublished('dsae-team');
  if (published && published.length > 0) return published.map(normalizePublishedMember);
  const result = await fetchFromApi<any[]>('/site/team');
  return (result.data ?? []).map(normalizeTeamMember);
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  const published = await fetchPublished('dsae-research');
  if (published && published.length > 0) return published.map(normalizePublishedResearch);
  const result = await fetchFromApi<any[]>('/site/research');
  return (result.data ?? []).map(normalizeResearchArea);
}

export async function getPublications(): Promise<Publication[]> {
  const published = await fetchPublished('dsae-publications');
  if (published && published.length > 0) return published.map(normalizePublishedPublication);
  const result = await fetchFromApi<any[]>('/site/publications');
  return (result.data ?? []).map(normalizePublication);
}

export async function getNewsItems(): Promise<NewsItem[]> {
  const published = await fetchPublished('dsae-news');
  if (published && published.length > 0) return published.map(normalizePublishedNews);
  const result = await fetchFromApi<any[]>('/site/news');
  return (result.data ?? []).map(normalizeNewsItem);
}

export async function getResearchAreaBySlug(slug: string): Promise<ResearchArea | null> {
  const items = await getResearchAreas();
  return items.find((item) => item.slug === slug) || null;
}

export async function getPublicationById(id: string): Promise<Publication | null> {
  const items = await getPublications();
  return items.find((item) => item.id === id) || null;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const items = await getNewsItems();
  return items.find((item) => item.slug === slug) || null;
}

export async function getMemberById(id: string): Promise<TeamMember | null> {
  const items = await getTeamMembers();
  return items.find((item) => item.id === id) || null;
}

export async function postContactMessage(
  payload: ContactPayload
): Promise<{ success: boolean; message: string }> {
  const result = await fetchFromApi<{ success: boolean; message: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result.data) {
    return result.data;
  }

  return {
    success: false,
    message: result.error || 'Impossible d’envoyer le message pour le moment.',
  };
}

/*
 * Les contenus publiés depuis l'espace de gestion DSAE.
 *
 * C'est la source première du portail : ce que le rédacteur publie dans
 * « Contenus » sort ici (`/public/content/...`), et rien d'autre. Un brouillon
 * n'y apparaît jamais — le backend ne sert que les contenus publiés. Si cette
 * source est vide (rubrique pas encore utilisée), on retombe sur les routes
 * historiques `/site/*`, pour qu'un contenu plus ancien reste visible.
 */

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'divider' }
  | { type: 'image'; mediaUrl: string; alt: string; caption: string }
  | { type: 'video'; mediaUrl: string; caption: string }
  | { type: 'file'; mediaUrl: string; fileName: string }
  | { type: 'embed'; url: string; caption: string }
  | { type: 'rich'; doc: { content?: any[] } };

type ContentEntry = {
  id: string;
  slug: string | null;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  body: string;
  blocks: ContentBlock[] | null;
  coverUrl: string | null;
  socialLinks: Record<string, string>;
  author: string;
  location: string;
  sortOrder: number;
  publishedAt: string | null;
};

/** Le texte d'un document enrichi, à plat. */
function richText(doc: { content?: any[] } | undefined): string {
  const walk = (node: any): string => {
    if (!node) return '';
    if (node.type === 'text') return node.text ?? '';
    if (node.type === 'hardBreak') return ' ';
    return (node.content ?? []).map(walk).join('');
  };
  return (doc?.content ?? []).map(walk).join(' ').trim();
}

/** La liste des paragraphes lisibles d'un contenu : les blocs, aplatis. */
function contentParagraphs(entry: ContentEntry): string[] {
  const parts: string[] = [];
  for (const block of entry.blocks ?? []) {
    if (block.type === 'paragraph') parts.push(block.text);
    else if (block.type === 'heading') parts.push(block.text);
    else if (block.type === 'quote') parts.push(block.text);
    else if (block.type === 'list') parts.push(block.items.join(' · '));
    else if (block.type === 'rich') parts.push(richText(block.doc));
  }
  if (parts.length === 0 && entry.body) parts.push(entry.body);
  return parts.filter(Boolean);
}

/** La première image d'un contenu, pour les vignettes. Rendue absolue : une
 * adresse relative du backend (`/api/public/media/...`) ne résout pas depuis le
 * domaine du portail. */
function contentImage(entry: ContentEntry): string {
  if (entry.coverUrl) return mediaUrl(entry.coverUrl);
  const image = (entry.blocks ?? []).find((block) => block.type === 'image') as { mediaUrl?: string } | undefined;
  return mediaUrl(image?.mediaUrl ?? '');
}

/** Le premier document joint d'un contenu, tel qu'importé dans un bloc. */
function contentDocument(entry: ContentEntry): { url: string; name: string } {
  const file = (entry.blocks ?? []).find((block) => block.type === 'file') as
    | { mediaUrl?: string; fileName?: string }
    | undefined;
  return { url: mediaUrl(file?.mediaUrl ?? ''), name: file?.fileName ?? '' };
}

function contentDate(entry: ContentEntry): string {
  if (!entry.publishedAt) return '';
  const date = new Date(entry.publishedAt);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function fetchPublished(collection: string): Promise<ContentEntry[] | null> {
  const result = await fetchFromApi<{ entries?: ContentEntry[] }>(`/public/content/${collection}`);
  return result.data?.entries ?? null;
}

function normalizePublishedNews(entry: ContentEntry): NewsItem {
  return {
    slug: entry.slug ?? entry.id,
    title: entry.title,
    category: entry.category,
    date: contentDate(entry),
    excerpt: entry.summary || entry.subtitle,
    content: contentParagraphs(entry).join('\n\n'),
    image: contentImage(entry),
  };
}

function normalizePublishedMember(entry: ContentEntry): TeamMember {
  return {
    id: entry.slug ?? entry.id,
    name: entry.title,
    role: entry.subtitle,
    department: entry.location,
    specialty: entry.category,
    bio: entry.summary || contentParagraphs(entry).join('\n\n'),
    category: entry.category,
    image: contentImage(entry),
    publications: [],
  };
}

function normalizePublishedResearch(entry: ContentEntry): ResearchArea {
  return {
    slug: entry.slug ?? entry.id,
    title: entry.title,
    category: entry.category,
    summary: entry.summary,
    description: contentParagraphs(entry).join('\n\n'),
    goals: [],
    projects: [],
    publications: [],
  };
}

function normalizePublishedPublication(entry: ContentEntry): Publication {
  const year = entry.publishedAt ? new Date(entry.publishedAt).getFullYear() : 0;
  const document = contentDocument(entry);
  return {
    id: entry.slug ?? entry.id,
    title: entry.title,
    subtitle: entry.subtitle,
    authors: entry.author,
    authorsList: splitAuthors(entry.author),
    year: Number.isFinite(year) ? year : 0,
    category: entry.category,
    discipline: '',
    department: entry.location,
    summary: entry.summary || contentParagraphs(entry).join('\n\n'),
    keywords: [],
    references: '',
    documentUrl: document.url,
    documentName: document.name,
    coverUrl: contentImage(entry),
    pdfUrl: document.url,
  };
}
