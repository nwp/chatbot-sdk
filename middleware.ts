import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { extractSubdomain } from './lib/tenant';

const isProtectedRoute = createRouteMatcher([
  '/',
  '/chat/(.*)',
  '/api/(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  // Extract subdomain and pass to app via headers
  const subdomain = extractSubdomain(request);
  const requestHeaders = new Headers(request.headers);
  
  if (subdomain) {
    requestHeaders.set('x-tenant-slug', subdomain);
  }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
