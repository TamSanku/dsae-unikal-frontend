import { API_BASE_URL } from '@/lib/backend';

export async function GET() {
  return Response.json({
    ok: true,
    app: 'dsae-unikal-frontend',
    backend: API_BASE_URL,
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
}
