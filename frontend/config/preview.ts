/** Public configuration is deliberately limited until backend/auth contracts are approved. */
export function assertMockEnvironment(environment: Record<string, string | undefined>): void {
  if (Object.keys(environment).some((key) => key.startsWith('VITE_') && key !== 'VITE_APP_MODE')) {
    throw new Error('Unapproved public configuration. Only VITE_APP_MODE=mock is supported; do not expose credentials or speculative API URLs.');
  }
  if (environment.VITE_APP_MODE !== undefined && environment.VITE_APP_MODE !== 'mock') {
    throw new Error('Live integrations are unavailable. Use VITE_APP_MODE=mock until approved backend/auth/media contracts are implemented.');
  }
}

// Local production-preview policy only. The selected HTTPS host must apply its own reviewed headers.
export const previewHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; frame-src 'none'; form-action 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cache-Control': 'no-store',
} as const;
