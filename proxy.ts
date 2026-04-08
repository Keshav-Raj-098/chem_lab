import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isApiAdminRoute = request.nextUrl.pathname.startsWith('/api/admin')
  const isAdminPageRoute = request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/auth')

  if (isApiAdminRoute) {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  // Optional: Add page-level redirection logic here if you want to protect pages server-side
  // Note: This requires the token to be in cookies, not localStorage.
  // Since you are using localStorage, the protection must happen client-side in useAuth.

  return NextResponse.next()
}


export const config = {
  matcher: ['/api/admin/:path*'],
}
