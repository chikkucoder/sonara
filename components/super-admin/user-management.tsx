"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, UserCheck, UserX, Store, Mail, Phone, Calendar, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  enabled: boolean
  shop_name: string | null
  shop_address: string | null
  shop_phone: string | null
  shop_gst: string | null
  created_at: string
}

export function UserManagement({ users }: { users: Profile[] }) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    shop_name: "",
    shop_address: "",
    shop_phone: "",
    shop_gst: "",
  })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/super-admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user")
      }

      setIsDialogOpen(false)
      setFormData({
        email: "",
        password: "",
        full_name: "",
        shop_name: "",
        shop_address: "",
        shop_phone: "",
        shop_gst: "",
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleEnabled = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/super-admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, enabled: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user")
    }
  }

  const totalUsers = users.filter((u) => u.role !== "super_admin").length
  const activeUsers = users.filter((u) => u.enabled && u.role !== "super_admin").length
  const disabledUsers = users.filter((u) => !u.enabled && u.role !== "super_admin").length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-normal text-slate-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-100">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-normal text-slate-400">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{activeUsers}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-normal text-slate-400">Disabled Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{disabledUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-100">User Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-100">Create New User</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Register a new jewelry shop with login credentials
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-slate-200">
                    Owner Name *
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shop_name" className="text-slate-200">
                    Shop Name *
                  </Label>
                  <Input
                    id="shop_name"
                    type="text"
                    value={formData.shop_name}
                    onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shop_address" className="text-slate-200">
                    Shop Address *
                  </Label>
                  <Input
                    id="shop_address"
                    type="text"
                    value={formData.shop_address}
                    onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shop_phone" className="text-slate-200">
                      Shop Phone *
                    </Label>
                    <Input
                      id="shop_phone"
                      type="tel"
                      value={formData.shop_phone}
                      onChange={(e) => setFormData({ ...formData, shop_phone: e.target.value })}
                      required
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shop_gst" className="text-slate-200">
                      GST Number
                    </Label>
                    <Input
                      id="shop_gst"
                      type="text"
                      value={formData.shop_gst}
                      onChange={(e) => setFormData({ ...formData, shop_gst: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users
              .filter((u) => u.role !== "super_admin")
              .map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-lg border border-slate-800 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg text-slate-100">{user.full_name || "No Name"}</h3>
                        {user.role === "super_admin" ? (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            <Shield className="w-3 h-3 mr-1" />
                            Super Admin
                          </Badge>
                        ) : user.enabled ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            <UserX className="w-3 h-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-4 h-4 text-slate-500" />
                          {user.email}
                        </div>
                        {user.shop_name && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Store className="w-4 h-4 text-slate-500" />
                            {user.shop_name}
                          </div>
                        )}
                        {user.shop_phone && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Phone className="w-4 h-4 text-slate-500" />
                            {user.shop_phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {user.shop_address && <p className="text-sm text-slate-400">{user.shop_address}</p>}
                      {user.shop_gst && <p className="text-sm text-slate-400">GST: {user.shop_gst}</p>}
                    </div>
                    {user.role !== "super_admin" && (
                      <Button
                        variant={user.enabled ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleEnabled(user.id, user.enabled)}
                        className={user.enabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                      >
                        {user.enabled ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Enable
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
