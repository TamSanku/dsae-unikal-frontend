/*
 * L'accès au backend DSAE (service Render « dsae-backend »), seul détenteur du
 * contenu du portail.
 *
 * Aucune donnée de remplacement n'est conservée : si l'API ne répond pas, la
 * page l'affiche au lieu de montrer un contenu inventé.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://dsae-backend.onrender.com/api';

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
  authors: string;
  year: number;
  category: string;
  discipline: string;
  department: string;
  summary: string;
  keywords: string[];
  references: string;
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
  return {
    id: raw.id ?? `publication-${index}`,
    title: raw.title ?? '',
    authors: raw.authors ?? raw.author ?? '',
    year: Number(raw.year) || 0,
    category: raw.category ?? '',
    discipline: raw.discipline ?? '',
    department: raw.department ?? '',
    summary: raw.summary ?? raw.description ?? raw.abstract ?? '',
    keywords: Array.isArray(keywords) ? keywords : [],
    references: raw.references ?? '',
    pdfUrl: raw.pdfUrl ?? raw.url ?? '',
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
  const result = await fetchFromApi<any[]>('/site/team');
  return (result.data ?? []).map(normalizeTeamMember);
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  const result = await fetchFromApi<any[]>('/site/research');
  return (result.data ?? []).map(normalizeResearchArea);
}

export async function getPublications(): Promise<Publication[]> {
  const result = await fetchFromApi<any[]>('/site/publications');
  return (result.data ?? []).map(normalizePublication);
}

export async function getNewsItems(): Promise<NewsItem[]> {
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
