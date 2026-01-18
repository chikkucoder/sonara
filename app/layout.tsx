import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { MainLayout } from "@/components/main-layout"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ratan Jewellers - Management System",
  description: "Premium Jewelry Shop Management System",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_playfair.variable}`}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
