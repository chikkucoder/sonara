import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name } = await request.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      full_name,
      role: "user",
      enabled: true,
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          full_name: user.full_name,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 })
  }
}
