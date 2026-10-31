import {
  type TeamMember,
  type ResearchArea,
  type Publication,
  type NewsItem,
  teamMembers as demoTeamMembers,
  researchAreas as demoResearchAreas,
  publications as demoPublications,
  newsItems as demoNewsItems,
} from './data';

// Shared backend (Render service "dsae-backend"). Override with NEXT_PUBLIC_API_URL
// on Vercel so both frontends always target the deployed API.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://dsae-backend.onrender.com/api';

export const useDemoData = process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true';

export type ApiResult<T> = {
  data: T | null;
  error: string | null;
  source: 'demo' | 'api' | 'error';
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
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
        source: 'error',
      };
    }

    const data = (await response.json()) as T;
    return { data, error: null, source: 'api' };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l’appel API.',
      source: 'error',
    };
  }
}

// The backend exposes its own field names (author/description/photo/summary).
// Normalize each payload to the shape used by the public site components.
function normalizeTeamMember(raw: any, index: number): TeamMember {
  return {
    id: raw.id ?? `member-${index}`,
    name: raw.name ?? 'Nom à confirmer',
    role: raw.role ?? '',
    department: raw.department ?? '',
    specialty: raw.specialty ?? '',
    bio: raw.bio ?? '',
    category: raw.category ?? 'Personnel académique',
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
    pdfUrl: raw.pdfUrl ?? raw.url ?? '#',
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
  if (useDemoData) {
    return demoTeamMembers;
  }

  const result = await fetchFromApi<any[]>('/site/team');
  if (!result.data?.length) {
    return demoTeamMembers;
  }
  return result.data.map(normalizeTeamMember);
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  if (useDemoData) {
    return demoResearchAreas;
  }

  const result = await fetchFromApi<any[]>('/site/research');
  if (!result.data?.length) {
    return demoResearchAreas;
  }
  return result.data.map(normalizeResearchArea);
}

export async function getPublications(): Promise<Publication[]> {
  if (useDemoData) {
    return demoPublications;
  }

  const result = await fetchFromApi<any[]>('/site/publications');
  if (!result.data?.length) {
    return demoPublications;
  }
  return result.data.map(normalizePublication);
}

export async function getNewsItems(): Promise<NewsItem[]> {
  if (useDemoData) {
    return demoNewsItems;
  }

  const result = await fetchFromApi<any[]>('/site/news');
  if (!result.data?.length) {
    return demoNewsItems;
  }
  return result.data.map(normalizeNewsItem);
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
  if (useDemoData) {
    return {
      success: true,
      message: 'Votre message a bien été enregistré. Un retour vous sera donné dès que possible.',
    };
  }

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

export function getBackendStatusMessage() {
  return `Backend configuré : ${API_BASE_URL}`;
}
