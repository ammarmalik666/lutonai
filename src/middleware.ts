import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get response
    const response = NextResponse.next()

    // CORS Headers
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')

    // Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    response.headers.set('Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    )

    // Content Security Policy
    response.headers.set('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' blob: data: https:; " +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-ancestors 'none'; " +
        "block-all-mixed-content; " +
        "upgrade-insecure-requests;"
    )

    return response
}

export const config = {
    matcher: '/api/:path*',
} 