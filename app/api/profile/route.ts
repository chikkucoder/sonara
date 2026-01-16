import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function GET() {
  try {
    const user = await requireAuth()
    await dbConnect()

    const userData = await User.findById((user as any).id).select("-password")

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ data: userData })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth()
    await dbConnect()

    const body = await request.json()

    const userData = await User.findByIdAndUpdate((user as any).id, body, { new: true }).select("-password")

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ data: userData })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 },
    )
  }
}
