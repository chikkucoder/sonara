"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/super-admin/login" })
  }

  return (
    <Button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
    >
      Logout
    </Button>
  )
}
