import { NextResponse } from "next/server"

export async function POST() {
  // NextAuth handles logout via client-side signOut
  return NextResponse.json({ message: "Use NextAuth signOut on client" }, { status: 200 })
}
