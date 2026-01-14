import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  // 30 seconds
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=30; includeSubDomains; preload',
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for prefetches and requests
     * starting with:
     *
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * Mostly taken from Next.js docs:
     * - https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy#:~:text=We%20recommend%20ignoring,the%20CSP%20header.
     *
     * Changes from Next.js docs code:
     * - Removed API Route Handlers, to allow setting security
     *   headers
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
