export async function GET() {
  return Response.json({
    ok: true,
    app: 'dsae-unikal-frontend',
    backend: process.env.NEXT_PUBLIC_API_URL || 'non-configuré',
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    demoMode: process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true',
    timestamp: new Date().toISOString(),
  });
}
