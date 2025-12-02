"use client"

import type React from "react"

import { Sidebar, useSidebarStore } from "@/components/sidebar"
import { cn } from "@/lib/utils"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn("min-h-screen transition-all duration-300 ease-in-out", isExpanded ? "ml-64" : "ml-20")}>
        {children}
      </main>
    </div>
  )
}
