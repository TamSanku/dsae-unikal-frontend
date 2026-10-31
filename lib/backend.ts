export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useDemoData =
  process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true' || process.env.NODE_ENV === 'development';

export type ApiResult<T> = {
  data: T | null;
  error: string | null;
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

export function getBackendStatusMessage() {
  return `Backend configuré : ${API_BASE_URL}`;
}
