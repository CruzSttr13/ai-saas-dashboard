import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname === '/login'
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  // Caso 1: Intenta entrar al dashboard sin estar logueado
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Caso 2: Ya está logueado pero intenta ir al login (lo mandamos al dashboard)
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configura en qué rutas debe actuar el middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}