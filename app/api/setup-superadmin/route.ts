import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

// Create super admin on first run
export async function GET() {
  try {
    await dbConnect()

    const email = process.env.SUPER_ADMIN_EMAIL || "admin@gmail.com"
    const password = process.env.SUPER_ADMIN_PASSWORD || "Admin@123"

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email })

    if (existingAdmin) {
      return NextResponse.json(
        {
          message: "Super admin already exists",
          email: email,
          note: "You can now login with your credentials",
        },
        { status: 200 }
      )
    }

    // Create super admin
    const superAdmin = await User.create({
      email,
      password,
      full_name: "Super Admin",
      role: "super_admin",
      enabled: true,
    })

    return NextResponse.json(
      {
        message: "Super admin created successfully! 🎉",
        email: superAdmin.email,
        password: password,
        note: "Save these credentials! You can now login at /super-admin/login",
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Create super admin error:", error)
    return NextResponse.json({ error: error.message || "Failed to create super admin" }, { status: 500 })
  }
}
