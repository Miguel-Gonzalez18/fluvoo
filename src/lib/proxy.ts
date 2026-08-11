import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * While Fluvoo is in "coming soon" mode, every UI route redirects to `/`.
 * APIs, robots and sitemap stay reachable.
 */
const COMING_SOON_MODE = true

const COMING_SOON_ALLOWED_PREFIXES = ['/api/']
const COMING_SOON_ALLOWED_PATHS = new Set([
  '/',
  '/robots.txt',
  '/sitemap.xml',
  '/icon.svg',
  '/site.webmanifest',
])

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname

  if (COMING_SOON_MODE) {
    const isAllowed =
      COMING_SOON_ALLOWED_PATHS.has(pathname) ||
      COMING_SOON_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

    if (!isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.search = ''
      return NextResponse.redirect(url)
    }

    // Stay on `/` without session-based redirects to dashboard/login.
    return supabaseResponse
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const PUBLIC_PATHS = [
    '/',
    '/login',
    '/register',
    '/auth',
    '/cookies',
    '/privacidad',
    '/terminos',
    '/onboarding',
  ]

  const isPublic = PUBLIC_PATHS.some(path =>
    request.nextUrl.pathname === path ||
    request.nextUrl.pathname.startsWith(path + '/')
  )

  // Usuario no autenticado intentando acceder a ruta protegida
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Usuario autenticado intentando acceder a landing, login o register
  const AUTH_REDIRECT_PATHS = ['/', '/login', '/register']
  const shouldRedirectToDashboard = user && AUTH_REDIRECT_PATHS.some(path =>
    request.nextUrl.pathname === path
  )

  if (shouldRedirectToDashboard) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
