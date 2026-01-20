"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Sidebar, useSidebarStore } from "@/components/sidebar"
import { cn } from "@/lib/utils"

const publicRoutes = ["/", "/login", "/about", "/contact", "/signup"]
const superAdminRoutes = ["/super-admin"]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isExpanded } = useSidebarStore()

  const isPublicRoute = publicRoutes.includes(pathname)
  const isSuperAdminRoute = pathname.startsWith("/super-admin")

  if (isPublicRoute || isSuperAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn("min-h-screen transition-all duration-300 ease-in-out", isExpanded ? "ml-64" : "ml-20")}>
        {children}
      </main>
    </div>
  )
}
