import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/form/(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Allow public routes without checks
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect all non-public routes
  const { userId } = await auth();

  // If user not signed in, redirect to sign-in with return path
  if (!userId) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(url);
  }

  // If user is signed in, just proceed (avoid redirecting /dashboard to itself)
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
