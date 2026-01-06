import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Base security headers (without HSTS which is added conditionally)
const baseSecurityHeaders: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://vercel.live https://*.vercel.app https://*.vercel.live blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live https://*.vercel.app",
    "font-src 'self' https://fonts.gstatic.com data: https:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.openai.com https://api.stripe.com https://www.google-analytics.com https://api.adzuna.com https://vercel.live https://*.vercel.app https://*.vercel.live wss: ws: https: data: blob:",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com blob:",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "media-src 'self' blob: data:",
  ].join('; '),
}

const HSTS_HEADER = 'Strict-Transport-Security'
const HSTS_VALUE = 'max-age=31536000; includeSubDomains'

// Rate limiting configuration - more generous to prevent blocking legitimate users
const RATE_LIMIT_CONFIG = {
  default: { requests: 500, window: 60 * 1000 }, // 500 requests per minute
  auth: { requests: 30, window: 60 * 1000 }, // 30 auth attempts per minute
  ai: { requests: 50, window: 60 * 1000 }, // 50 AI requests per minute
  upload: { requests: 50, window: 60 * 1000 }, // 50 uploads per minute
}

// IP address extraction
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return 'unknown'
}

// Rate limiting function
function checkRateLimit(identifier: string, type: keyof typeof RATE_LIMIT_CONFIG = 'default'): boolean {
  const config = RATE_LIMIT_CONFIG[type]
  const now = Date.now()
  const key = `${identifier}:${type}`
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.window })
    return true
  }
  
  if (current.count >= config.requests) {
    return false
  }
  
  current.count++
  return true
}

// Request validation
function validateRequest(request: NextRequest): { valid: boolean; reason?: string } {
  const url = request.nextUrl.pathname
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /javascript:/i, // JavaScript injection
    /on\w+\s*=/i, // Event handler injection
    /union\s+select/i, // SQL injection
    /eval\s*\(/i, // Code injection
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(request.url)) {
      return { valid: false, reason: 'Suspicious request pattern detected' }
    }
  }
  
  // Check content length for POST requests
  const contentLength = request.headers.get('content-length')
  if (request.method === 'POST' && contentLength) {
    const size = parseInt(contentLength, 10)
    if (size > 10 * 1024 * 1024) { // 10MB limit
      return { valid: false, reason: 'Request too large' }
    }
  }
  
  return { valid: true }
}

// Mobile detection - comprehensive check
function isMobileDevice(userAgent: string): boolean {
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(userAgent)
}

// Bot detection - exclude mobile browsers
function isBot(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  
  // Don't flag mobile browsers as bots
  if (isMobileDevice(userAgent)) {
    return false
  }
  
  // More specific bot patterns to avoid false positives
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /\bcurl\b/i,
    /\bwget\b/i,
    /python-requests/i,
    /python-urllib/i,
    /libwww-perl/i,
    /Go-http-client/i,
    /HeadlessChrome/i,
    /PhantomJS/i,
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgent))
}

// Request logging
function logRequest(request: NextRequest, response: NextResponse) {
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const method = request.method
  const url = request.nextUrl.pathname
  const status = response.status
  
  console.log(`${new Date().toISOString()} - ${clientIP} - ${method} ${url} - ${status} - ${userAgent}`)
}

export function middleware(request: NextRequest) {
  const start = Date.now()
  
  // Get client IP and user agent early
  const clientIP = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = isMobileDevice(userAgent)
  
  // For mobile devices, skip most security checks to avoid blocking content
  // Mobile browsers are generally trusted and shouldn't need aggressive filtering
  if (isMobile) {
    const response = NextResponse.next()
    
    // Only add minimal security headers for mobile
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    
    const isHTTPS = request.nextUrl.protocol === 'https:' || 
                    request.headers.get('x-forwarded-proto') === 'https'
    if (isHTTPS) {
      response.headers.set(HSTS_HEADER, HSTS_VALUE)
    }
    
    // Add CORS headers for API routes on mobile
    if (request.nextUrl.pathname.startsWith('/api/')) {
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
    
    return response
  }
  
  // Desktop flow continues below...
  
  // Validate request
  const validation = validateRequest(request)
  if (!validation.valid) {
    console.warn(`Invalid request from ${clientIP}: ${validation.reason}`)
    return new NextResponse('Bad Request', { status: 400 })
  }
  
  // Bot detection and handling (desktop only)
  if (isBot(request)) {
    // Allow bots for public pages, but rate limit them
    const isPublicPage = request.nextUrl.pathname === '/' || 
                        request.nextUrl.pathname.startsWith('/api/') ||
                        request.nextUrl.pathname.startsWith('/_next/')
    
    if (!isPublicPage) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }
  
  // Rate limiting based on endpoint type
  let rateLimitType: keyof typeof RATE_LIMIT_CONFIG = 'default'
  
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    rateLimitType = 'auth'
  } else if (request.nextUrl.pathname.startsWith('/api/ai-') || 
             request.nextUrl.pathname.startsWith('/api/cover-letter/') ||
             request.nextUrl.pathname.startsWith('/api/job-parser')) {
    rateLimitType = 'ai'
  } else if (request.nextUrl.pathname.startsWith('/api/upload')) {
    rateLimitType = 'upload'
  }
  
  if (!checkRateLimit(clientIP, rateLimitType)) {
    console.warn(`Rate limit exceeded for ${clientIP} on ${rateLimitType}`)
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
      }
    })
  }
  
  // Create response (desktop only - mobile already handled above)
  const response = NextResponse.next()
  
  // Check if we're on HTTPS (Vercel always uses HTTPS)
  const isHTTPS = request.nextUrl.protocol === 'https:' || 
                  request.headers.get('x-forwarded-proto') === 'https'
  
  // Desktop: full security headers including CSP
  const headersToAdd: Record<string, string> = { ...baseSecurityHeaders }
  
  // Only add HSTS if we're on HTTPS
  if (isHTTPS) {
    headersToAdd[HSTS_HEADER] = HSTS_VALUE
  }
  
  // Add security headers
  Object.entries(headersToAdd).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }
  
  // Log request
  logRequest(request, response)
  
  // Add performance headers
  const duration = Date.now() - start
  response.headers.set('X-Response-Time', `${duration}ms`)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 