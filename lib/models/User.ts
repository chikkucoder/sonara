import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends mongoose.Document {
  email: string
  password: string
  full_name: string
  role: "user" | "super_admin"
  enabled: boolean
  shop_id?: string
  shop_name?: string
  shop_address?: string
  phone?: string
  gst_no?: string
  features_enabled?: string[]
  last_login?: Date
  created_at: Date
  updated_at: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    full_name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "super_admin"],
      default: "user",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    shop_id: {
      type: String,
    },
    shop_name: {
      type: String,
    },
    shop_address: {
      type: String,
    },
    phone: {
      type: String,
    },
    gst_no: {
      type: String,
    },
    features_enabled: {
      type: [String],
      default: ["inventory", "sales", "reports"],
    },
    last_login: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
