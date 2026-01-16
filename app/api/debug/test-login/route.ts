import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    await dbConnect()

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found in database",
        email: email,
      }, { status: 404 })
    }

    // Test password comparison
    const isValid = await user.comparePassword(password)

    return NextResponse.json({
      success: isValid,
      message: isValid ? "Password matches!" : "Password does not match",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        enabled: user.enabled,
      },
      passwordTested: password,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
