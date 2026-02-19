import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // CORS for Widget API endpoints
  if (pathname.startsWith('/api/v1/')) {
    const origin = request.headers.get('origin') || '*';
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Company-ID');
    response.headers.set('Access-Control-Max-Age', '86400');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }

  // Rate Limiting
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const limit = pathname.startsWith('/api/auth/') ? 30 : 200;
  const entry = rateLimit.get(ip);

  if (entry && now < entry.resetTime) {
    if (entry.count >= limit) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    entry.count++;
  } else {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
  }

  // Auth Protection (exclude /schedule/* for candidate self-booking)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/applications') || pathname.startsWith('/settings') || pathname.startsWith('/onboarding') || pathname.startsWith('/jobs') || pathname.startsWith('/embed') || pathname.startsWith('/configuration')) {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
