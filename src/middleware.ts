import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/form/(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  const { userId } = await auth();

  // If user is logged in, redirect certain routes to dashboard
  if (userId) {
    const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
    const isRoot = pathname === '/';

    if (isAuthPage || isRoot) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      url.searchParams.delete('redirect_url');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Allow public routes without checks for unauthenticated users
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect all non-public routes for unauthenticated users
  const url = request.nextUrl.clone();
  url.pathname = '/sign-in';
  url.searchParams.set('redirect_url', pathname);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
