import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Only protect dashboard routes
  if (!req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Check for Supabase session cookies
  const supabaseSession = req.cookies.get('sb-access-token') || 
                         req.cookies.get('supabase-auth-token') ||
                         req.cookies.get('sb-localhost-auth-token');
  
  if (!supabaseSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = { 
  matcher: ['/dashboard/:path*'] 
};
