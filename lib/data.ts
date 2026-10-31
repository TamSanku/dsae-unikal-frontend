import {
  type TeamMember,
  type ResearchArea,
  type Publication,
  type NewsItem,
  teamMembers,
  researchAreas,
  publications,
  newsItems,
} from './data';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useDemoData =
  process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true' || process.env.NODE_ENV === 'development';

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
  if (useDemoData) {
    return { data: null, error: null, source: 'demo' };
  }

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

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (useDemoData) {
    return teamMembers;
  }

  const result = await fetchFromApi<TeamMember[]>('/team');
  return result.data || teamMembers;
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  if (useDemoData) {
    return researchAreas;
  }

  const result = await fetchFromApi<ResearchArea[]>('/research');
  return result.data || researchAreas;
}

export async function getPublications(): Promise<Publication[]> {
  if (useDemoData) {
    return publications;
  }

  const result = await fetchFromApi<Publication[]>('/publications');
  return result.data || publications;
}

export async function getNewsItems(): Promise<NewsItem[]> {
  if (useDemoData) {
    return newsItems;
  }

  const result = await fetchFromApi<NewsItem[]>('/news');
  return result.data || newsItems;
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

export async function postContactMessage(payload: ContactPayload): Promise<{ success: boolean; message: string }> {
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
