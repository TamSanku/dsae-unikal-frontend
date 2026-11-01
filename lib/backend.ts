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
  /** Le domaine et le niveau, pour les alumni (facultatif ailleurs). */
  domain: string;
  level: string;
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

export type ReviewSummary = {
  count: number;
  average: number;
};

/** Un avis tel que le public le laisse et le lit. */
export type PublicationReview = {
  id: string;
  rating: number;
  author: string;
  comment: string;
  createdAt: string;
};

export type Publication = {
  id: string;
  /** L'identifiant technique du contenu, celui des routes d'avis. */
  entryId: string;
  title: string;
  subtitle: string;
  /** Les signataires, séparés : la fiche en montre un, le détail les montre tous. */
  authors: string;
  authorsList: string[];
  year: number;
  /** La date de publication réelle, telle que le backend l'a posée. */
  publishedAt: string;
  /** La même date, écrite en toutes lettres. Vide si le backend n'en donne pas. */
  publishedLabel: string;
  category: string;
  discipline: string;
  department: string;
  /** Le domaine scientifique et le niveau d'études, quand ils sont renseignés. */
  domain: string;
  level: string;
  summary: string;
  keywords: string[];
  references: string;
  /** Le document joint (PDF, mémoire…), tel qu'il a été importé dans un bloc. */
  documentUrl: string;
  documentName: string;
  /** L'image de couverture, montrée au format A4. */
  coverUrl: string;
  pdfUrl: string;
  /** Le corps rédigé dans l'espace de gestion : ses blocs, dans l'ordre. */
  blocks: ContentBlock[];
  /** La note des avis : c'est ce que la carte affiche sous forme d'étoiles. */
  reviewSummary: ReviewSummary;
};

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Une date lisible, ou rien : on n'écrit pas une date qui n'existe pas. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : DATE_FORMAT.format(date);
}

export type NewsItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  /** Le corps rédigé, quand l'actualité vient de l'espace de gestion. */
  blocks: ContentBlock[];
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
    domain: raw.domain ?? '',
    level: raw.level ?? '',
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
  const authorList = Array.isArray(raw.authors) ? raw.authors.filter(Boolean) : [];
  const authors = authorList.length ? authorList.join(', ') : raw.authors ?? raw.author ?? '';
  const publishedAt = raw.publishedAt ?? raw.published_at ?? raw.date ?? '';
  return {
    id: raw.id ?? `publication-${index}`,
    entryId: raw.id ?? '',
    title: raw.title ?? '',
    subtitle: raw.subtitle ?? '',
    authors,
    authorsList: authorList.length ? authorList : splitAuthors(authors),
    year: Number(raw.year) || 0,
    publishedAt,
    publishedLabel: formatDate(publishedAt),
    category: raw.category ?? '',
    discipline: raw.discipline ?? '',
    department: raw.department ?? '',
    domain: raw.domain ?? '',
    level: raw.level ?? '',
    summary: raw.summary ?? raw.description ?? raw.abstract ?? '',
    keywords: Array.isArray(keywords) ? keywords : [],
    references: raw.references ?? '',
    documentUrl: mediaUrl(raw.pdfUrl ?? raw.documentUrl ?? ''),
    documentName: raw.documentName ?? '',
    coverUrl: mediaUrl(raw.coverUrl ?? ''),
    pdfUrl: mediaUrl(raw.pdfUrl ?? raw.url ?? ''),
    blocks: Array.isArray(raw.blocks) ? raw.blocks : [],
    reviewSummary: raw.reviewSummary ?? { count: 0, average: 0 },
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
    blocks: Array.isArray(raw.blocks) ? raw.blocks : [],
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

/*
 * Les Alumni : les diplômés du domaine.
 *
 * Même forme que l'équipe (un nom, un parcours, un portrait), plus un domaine
 * et un niveau. La source est la rubrique `dsae-alumni` du backoffice ; sans
 * contenu publié, la liste est vide et la page le dit.
 */
export async function getAlumni(): Promise<TeamMember[]> {
  const published = await fetchPublished('dsae-alumni');
  return (published ?? []).map(normalizePublishedMember);
}

/*
 * Les réglages du portail, publiés depuis l'espace de gestion.
 *
 * Aujourd'hui : le logo du site. Il s'affiche en tête et en pied de page à la
 * place du repère écrit « DSAE ». Sans logo publié, `url` est vide et le
 * portail garde son repère — il n'invente jamais une image.
 */
export type SiteLogo = {
  url: string;
  alt: string;
};

export async function getSiteLogo(): Promise<SiteLogo> {
  const empty: SiteLogo = { url: '', alt: '' };
  const result = await fetchFromApi<{ logo?: SiteLogo }>('/public/site');
  const logo = result.data?.logo;
  if (!logo) return empty;
  return { url: mediaUrl(logo.url), alt: logo.alt ?? '' };
}

/*
 * Les entrées de sous-menu du pied de page, tirées du contenu réel : les axes de
 * recherche, les catégories d'équipe et les domaines de publication. Le pied de
 * page s'en sert pour déplier ces trois rubriques ; quand une liste est vide, la
 * rubrique reste un lien direct vers sa page.
 *
 * Les trois appels partent ensemble : le pied de page ne doit pas retarder
 * l'affichage plus que le plus lent des trois.
 */
export type SiteNav = {
  research: { label: string; href: string }[];
  team: { label: string; href: string }[];
  publications: { label: string; href: string }[];
};

export async function getSiteNav(): Promise<SiteNav> {
  const [areas, taxonomy, publications] = await Promise.all([
    getResearchAreas(),
    getTaxonomy(),
    getPublications(),
  ]);

  const research = areas.map((area) => ({ label: area.title, href: `/recherche/${area.slug}` }));

  const team = taxonomy.teamCategories.map((category) => ({
    label: category,
    href: `/equipe?category=${encodeURIComponent(category)}`,
  }));

  const domains = Array.from(new Set(publications.map((item) => item.domain).filter(Boolean)));
  const list = domains.length > 0 ? domains : taxonomy.domains;
  const pub = list.map((domain) => ({
    label: domain,
    href: `/publications?domain=${encodeURIComponent(domain)}`,
  }));

  return { research, team, publications: pub };
}

/*
 * Les partenaires : les institutions liées au domaine. La page « S'engager »
 * les liste ; sans contenu publié, elle le dit franchement.
 */
export async function getPartners(): Promise<TeamMember[]> {
  const published = await fetchPublished('dsae-partners');
  return (published ?? []).map(normalizePublishedMember);
}

/*
 * Les listes de référence (types, domaines, niveaux).
 *
 * Elles viennent du serveur : les onglets du portail ne peuvent pas dériver
 * d'une liste recopiée dans le code. Si l'API ne répond pas, on rend des listes
 * vides — pas de faux onglets.
 */
export type Taxonomy = {
  newsCategories: string[];
  publicationCategories: string[];
  teamCategories: string[];
  domains: string[];
  levels: string[];
};

export async function getTaxonomy(): Promise<Taxonomy> {
  const result = await fetchFromApi<Taxonomy>('/public/content/taxonomy');
  return (
    result.data ?? {
      newsCategories: [],
      publicationCategories: [],
      teamCategories: [],
      domains: [],
      levels: [],
    }
  );
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

/*
 * Les avis d'une publication.
 *
 * La lecture est publique ; l'écriture aussi — un lecteur donne son avis sans
 * créer de compte. Le nom et le commentaire partent tels quels : c'est le
 * backend qui borne les longueurs et la note. Rien n'est inventé ici : sans
 * réponse de l'API, la liste est vide et le dit.
 */
export async function getPublicationReviews(
  entryId: string,
  /* Un numéro de passage force une relecture fraîche : après un envoi, le
   * navigateur ne doit pas resservir la liste d'avant. */
  revision?: number
): Promise<{ reviews: PublicationReview[]; summary: ReviewSummary }> {
  const empty = { reviews: [] as PublicationReview[], summary: { count: 0, average: 0 } };
  if (!entryId) return empty;
  const query = typeof revision === 'number' ? `?r=${revision}` : '';
  const result = await fetchFromApi<{ reviews: PublicationReview[]; summary: ReviewSummary }>(
    `/public/content/dsae-publications/${entryId}/reviews${query}`
  );
  return result.data ?? empty;
}

export async function postPublicationReview(
  entryId: string,
  input: { rating: number; author: string; comment: string }
): Promise<{ success: boolean; message: string }> {
  const result = await fetchFromApi<{ review: PublicationReview }>(
    `/public/content/dsae-publications/${entryId}/reviews`,
    { method: 'POST', body: JSON.stringify(input) }
  );
  if (result.data) return { success: true, message: 'Merci, votre avis a été enregistré.' };
  return { success: false, message: result.error || 'Impossible d’enregistrer votre avis.' };
}

/*
 * « Gérer mon avis ».
 *
 * Le lecteur n'a pas de compte : le navigateur retient l'identifiant de l'avis
 * qu'il a écrit, et le renvoie pour le corriger ou le retirer. Le serveur
 * vérifie que cet avis appartient bien à ce document. Rien n'est inventé : si
 * la modification échoue, on le dit au lecteur.
 */
export async function updatePublicationReview(
  entryId: string,
  reviewId: string,
  input: { rating: number; author: string; comment: string }
): Promise<{ success: boolean; message: string }> {
  const result = await fetchFromApi<{ review: PublicationReview }>(
    `/public/content/dsae-publications/${entryId}/reviews/${reviewId}`,
    { method: 'PATCH', body: JSON.stringify(input) }
  );
  if (result.data) return { success: true, message: 'Votre avis a été mis à jour.' };
  return { success: false, message: result.error || 'Impossible de mettre à jour votre avis.' };
}

export async function deletePublicationReview(
  entryId: string,
  reviewId: string
): Promise<{ success: boolean; message: string }> {
  const result = await fetchFromApi<{ deleted: boolean }>(
    `/public/content/dsae-publications/${entryId}/reviews/${reviewId}`,
    { method: 'DELETE' }
  );
  if (result.data) return { success: true, message: 'Votre avis a été retiré.' };
  return { success: false, message: result.error || 'Impossible de retirer votre avis.' };
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const items = await getNewsItems();
  return items.find((item) => item.slug === slug) || null;
}

export async function getMemberById(id: string): Promise<TeamMember | null> {
  const items = await getTeamMembers();
  return items.find((item) => item.id === id) || null;
}

export async function getAlumniById(id: string): Promise<TeamMember | null> {
  const items = await getAlumni();
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
  authors?: string[];
  author: string;
  location: string;
  domain?: string;
  level?: string;
  sortOrder: number;
  publishedAt: string | null;
  reviewSummary?: ReviewSummary;
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
    blocks: entry.blocks ?? [],
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
    domain: entry.domain ?? '',
    level: entry.level ?? '',
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
  const authorList = Array.isArray(entry.authors) ? entry.authors.filter(Boolean) : [];
  const authors = authorList.length ? authorList.join(', ') : entry.author;
  return {
    id: entry.slug ?? entry.id,
    entryId: entry.id,
    title: entry.title,
    subtitle: entry.subtitle,
    authors,
    authorsList: authorList.length ? authorList : splitAuthors(entry.author),
    year: Number.isFinite(year) ? year : 0,
    publishedAt: entry.publishedAt ?? '',
    publishedLabel: formatDate(entry.publishedAt),
    category: entry.category,
    discipline: '',
    department: entry.location,
    domain: entry.domain ?? '',
    level: entry.level ?? '',
    summary: entry.summary || contentParagraphs(entry).join('\n\n'),
    keywords: [],
    references: '',
    documentUrl: document.url,
    documentName: document.name,
    coverUrl: contentImage(entry),
    pdfUrl: document.url,
    blocks: entry.blocks ?? [],
    reviewSummary: entry.reviewSummary ?? { count: 0, average: 0 },
  };
}
