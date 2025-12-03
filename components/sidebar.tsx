"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Diamond,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { create } from "zustand"

interface SidebarStore {
  isExpanded: boolean
  toggle: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isExpanded: true,
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
}))

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Inventory Report", href: "/dashboard/inventory-report", icon: FileText },
  { name: "Sales", href: "/dashboard/sales", icon: ShoppingCart },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isExpanded, toggle } = useSidebarStore()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex items-center border-b border-sidebar-border py-6 transition-all duration-300",
            isExpanded ? "gap-3 px-6" : "justify-center px-2",
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary flex-shrink-0">
            <Diamond className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <h1 className="font-serif text-xl font-bold text-sidebar-primary whitespace-nowrap">Ratan</h1>
              <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Jewellers</p>
            </div>
          )}
        </div>

        <button
          onClick={toggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-lg hover:bg-sidebar-primary/90 transition-colors"
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1 py-4 transition-all duration-300", isExpanded ? "px-3" : "px-2")}>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                title={!isExpanded ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-300",
                  isExpanded ? "gap-3 px-3" : "justify-center px-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div
          className={cn(
            "border-t border-sidebar-border p-4 transition-all duration-300",
            !isExpanded && "flex justify-center",
          )}
        >
          <div className={cn("flex items-center", isExpanded ? "gap-3" : "flex-col gap-2")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-semibold flex-shrink-0">
              RJ
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Rajesh Kumar</p>
                <p className="text-xs text-sidebar-foreground/60">Admin</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Logout"
              className={cn("rounded-lg hover:bg-sidebar-accent transition-colors", isExpanded ? "p-2" : "p-1.5")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
