import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function GET() {
  try {
    await dbConnect()

    const email = process.env.SUPER_ADMIN_EMAIL || "admin@gmail.com"
    
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return NextResponse.json({
        exists: false,
        message: "Super admin not found in database",
        email: email,
        action: "Visit /api/setup-superadmin to create super admin"
      })
    }

    return NextResponse.json({
      exists: true,
      message: "Super admin exists",
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        enabled: user.enabled,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
