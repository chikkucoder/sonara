import { requireAuth } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Girvi from "@/lib/models/Girvi"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const girvi = await Girvi.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean()

    return NextResponse.json({ data: girvi })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch girvi inventory" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const body = await request.json()

    const girvi = await Girvi.create({
      ...body,
      user_id: userId,
    })

    return NextResponse.json({ data: girvi })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create girvi inventory" },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const body = await request.json()
    const { id, ...updateData } = body

    const girvi = await Girvi.findOneAndUpdate(
      { _id: id, user_id: userId },
      updateData,
      { new: true }
    )

    return NextResponse.json({ data: girvi })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update girvi inventory" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await Girvi.findOneAndDelete({ _id: id, user_id: userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete girvi inventory" },
      { status: 500 },
    )
  }
}
