import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';



export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

 if(pathname === '/') {
  const { userId } = await auth();
  if (!userId) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }else{
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
 }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};