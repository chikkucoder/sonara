import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // You can add authentication checks here when you implement MongoDB auth
  // For now, allowing all requests to pass through
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
