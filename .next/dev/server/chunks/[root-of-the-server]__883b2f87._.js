module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGO_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}
let cached = global.mongoose || {
    conn: null,
    promise: null
};
if (!global.mongoose) {
    global.mongoose = cached;
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[project]/lib/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$2$2e$4$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/bcryptjs@2.4.3/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    full_name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            "user",
            "super_admin"
        ],
        default: "user"
    },
    enabled: {
        type: Boolean,
        default: true
    },
    shop_id: {
        type: String
    },
    shop_name: {
        type: String
    },
    shop_address: {
        type: String
    },
    phone: {
        type: String
    },
    gst_no: {
        type: String
    },
    features_enabled: {
        type: [
            String
        ],
        default: [
            "inventory",
            "sales",
            "reports"
        ]
    },
    last_login: {
        type: Date
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
// Hash password before saving
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$2$2e$4$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10);
        this.password = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$2$2e$4$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$2$2e$4$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("User", UserSchema);
}),
"[project]/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>handler,
    "POST",
    ()=>handler,
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.0_c820c0e7ff6e3da9d12c9a3f6111e4c4/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.0_c820c0e7ff6e3da9d12c9a3f6111e4c4/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
;
;
;
;
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                    email: credentials.email
                }).select("+password");
                if (!user) {
                    throw new Error("Invalid email or password");
                }
                const isPasswordValid = await user.comparePassword(credentials.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }
                if (!user.enabled) {
                    throw new Error("Your account has been disabled. Please contact administrator.");
                }
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.full_name,
                    role: user.role,
                    shop_id: user.shop_id
                };
            }
        })
    ],
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.userRole = user.role;
                token.userShopId = user.shop_id;
            }
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.userId;
                session.user.role = token.userRole;
                session.user.shop_id = token.userShopId;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production"
};
const handler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(authOptions);
;
}),
"[project]/lib/models/Sale.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const SaleSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    user_id: {
        type: String,
        required: [
            true,
            "User ID is required"
        ],
        index: true
    },
    invoice_number: {
        type: String,
        required: [
            true,
            "Invoice number is required"
        ],
        unique: true,
        index: true
    },
    invoice_date: {
        type: Date,
        required: [
            true,
            "Invoice date is required"
        ],
        default: Date.now
    },
    customer_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: "Customer",
        required: [
            true,
            "Customer ID is required"
        ]
    },
    customer_name: {
        type: String,
        required: [
            true,
            "Customer name is required"
        ],
        trim: true
    },
    customer_phone: {
        type: String,
        required: [
            true,
            "Customer phone is required"
        ],
        trim: true
    },
    customer_type: {
        type: String,
        required: [
            true,
            "Customer type is required"
        ],
        enum: {
            values: [
                "B2C",
                "B2B"
            ],
            message: "{VALUE} is not a valid customer type"
        },
        default: "B2C"
    },
    customer_gst: {
        type: String,
        trim: true,
        uppercase: true
    },
    items: [
        {
            inventory_id: {
                type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
                ref: "Inventory",
                required: true
            },
            item_name: {
                type: String,
                required: true,
                trim: true
            },
            category: {
                type: String,
                required: true,
                trim: true
            },
            purity: String,
            metal_type: {
                type: String,
                enum: [
                    "GOLD",
                    "SILVER",
                    "PLATINUM",
                    "DIAMOND"
                ]
            },
            quantity: {
                type: Number,
                required: true,
                min: [
                    0.01,
                    "Quantity must be greater than 0"
                ]
            },
            weight: Number,
            gold_rate: Number,
            making_charges: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            },
            stone_charges: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            },
            base_price: {
                type: Number,
                required: true,
                min: 0
            },
            discount_percentage: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
                max: 100
            },
            discount_amount: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            },
            taxable_amount: {
                type: Number,
                required: true,
                min: 0
            },
            gst_rate: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            },
            cgst_amount: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            },
            sgst_amount: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            },
            igst_amount: {
                type: Number,
                required: true,
                default: 0,
                min: 0
            },
            total_gst: {
                type: Number,
                required: true,
                min: 0
            },
            item_total: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    total_base_price: {
        type: Number,
        required: true,
        min: 0
    },
    total_making_charges: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    total_stone_charges: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    total_discount_amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    total_taxable_amount: {
        type: Number,
        required: true,
        min: 0
    },
    total_cgst: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    total_sgst: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    total_igst: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    total_gst: {
        type: Number,
        required: true,
        min: 0
    },
    grand_total: {
        type: Number,
        required: true,
        min: 0
    },
    gst_type: {
        type: String,
        required: [
            true,
            "GST type is required"
        ],
        enum: {
            values: [
                "INTRASTATE",
                "INTERSTATE"
            ],
            message: "{VALUE} is not a valid GST type"
        },
        default: "INTRASTATE"
    },
    payment_mode: {
        type: String,
        required: [
            true,
            "Payment mode is required"
        ],
        enum: {
            values: [
                "CASH",
                "UPI",
                "CARD",
                "BANK_TRANSFER",
                "CHEQUE",
                "CREDIT"
            ],
            message: "{VALUE} is not a valid payment mode"
        },
        default: "CASH"
    },
    payment_status: {
        type: String,
        required: [
            true,
            "Payment status is required"
        ],
        enum: {
            values: [
                "PAID",
                "UNPAID",
                "PARTIAL"
            ],
            message: "{VALUE} is not a valid payment status"
        },
        default: "UNPAID"
    },
    amount_paid: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    amount_pending: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    payment_date: Date,
    payment_reference: String,
    payment_terms: {
        type: String,
        enum: {
            values: [
                "IMMEDIATE",
                "15_DAYS",
                "30_DAYS",
                "45_DAYS",
                "60_DAYS"
            ],
            message: "{VALUE} is not a valid payment term"
        }
    },
    due_date: Date,
    sale_status: {
        type: String,
        required: [
            true,
            "Sale status is required"
        ],
        enum: {
            values: [
                "COMPLETED",
                "PENDING",
                "CANCELLED"
            ],
            message: "{VALUE} is not a valid sale status"
        },
        default: "PENDING"
    },
    is_inventory_updated: {
        type: Boolean,
        default: false
    },
    warranty_years: {
        type: Number,
        default: 1,
        min: [
            0,
            "Warranty cannot be negative"
        ],
        max: [
            10,
            "Warranty cannot exceed 10 years"
        ]
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [
            1000,
            "Notes cannot exceed 1000 characters"
        ]
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
/**
 * CRITICAL INDEXES FOR PERFORMANCE
 */ // 1. Unique invoice number
SaleSchema.index({
    invoice_number: 1
}, {
    unique: true
});
// 2. User's recent sales
SaleSchema.index({
    user_id: 1,
    invoice_date: -1
});
// 3. Customer-wise sales
SaleSchema.index({
    user_id: 1,
    customer_id: 1,
    invoice_date: -1
});
// 4. Payment status filtering
SaleSchema.index({
    user_id: 1,
    payment_status: 1
});
// 5. Sale status filtering
SaleSchema.index({
    user_id: 1,
    sale_status: 1
});
// 6. Date range queries
SaleSchema.index({
    user_id: 1,
    created_at: -1
});
// 7. Customer type filtering
SaleSchema.index({
    user_id: 1,
    customer_type: 1
});
/**
 * Pre-save middleware: Calculate payment amounts
 */ SaleSchema.pre("save", function(next) {
    // Calculate pending amount
    this.amount_pending = this.grand_total - this.amount_paid;
    // Update payment status
    if (this.amount_paid === 0) {
        this.payment_status = "UNPAID";
    } else if (this.amount_paid >= this.grand_total) {
        this.payment_status = "PAID";
        this.amount_pending = 0;
    } else {
        this.payment_status = "PARTIAL";
    }
    // Set due date if payment terms provided
    if (this.payment_terms && this.payment_terms !== "IMMEDIATE") {
        const days = parseInt(this.payment_terms.split("_")[0]);
        const dueDate = new Date(this.invoice_date);
        dueDate.setDate(dueDate.getDate() + days);
        this.due_date = dueDate;
    }
    next();
});
/**
 * Static method: Generate unique invoice number
 * Format: INV-YYYYMMDD-XXXX
 */ SaleSchema.statics.generateInvoiceNumber = async function(userId) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "") // YYYYMMDD
    ;
    // Find last invoice for today
    const lastSale = await this.findOne({
        user_id: userId,
        invoice_number: new RegExp(`^INV-${dateStr}-`)
    }).sort({
        invoice_number: -1
    }).select("invoice_number").lean();
    let sequenceNumber = 1;
    if (lastSale && lastSale.invoice_number) {
        const lastSequence = parseInt(lastSale.invoice_number.slice(-4));
        sequenceNumber = lastSequence + 1;
    }
    const sequenceStr = sequenceNumber.toString().padStart(4, "0");
    return `INV-${dateStr}-${sequenceStr}`;
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Sale || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Sale", SaleSchema);
}),
"[project]/lib/models/Inventory.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const InventorySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    user_id: {
        type: String,
        required: [
            true,
            "User ID is required"
        ],
        index: true
    },
    item_name: {
        type: String,
        required: [
            true,
            "Item name is required"
        ],
        trim: true,
        minlength: [
            2,
            "Item name must be at least 2 characters"
        ]
    },
    category: {
        type: String,
        required: [
            true,
            "Category is required"
        ],
        trim: true
    },
    purity: {
        type: String,
        trim: true,
        uppercase: true
    },
    metal_type: {
        type: String,
        enum: {
            values: [
                "GOLD",
                "SILVER",
                "PLATINUM",
                "DIAMOND"
            ],
            message: "{VALUE} is not a valid metal type"
        },
        uppercase: true
    },
    quantity: {
        type: Number,
        required: [
            true,
            "Quantity is required"
        ],
        default: 0,
        min: [
            0,
            "Quantity cannot be negative"
        ]
    },
    weight: {
        type: Number,
        min: [
            0,
            "Weight cannot be negative"
        ]
    },
    rate: {
        type: Number,
        required: [
            true,
            "Rate is required"
        ],
        min: [
            0,
            "Rate cannot be negative"
        ]
    },
    total_value: {
        type: Number,
        required: [
            true,
            "Total value is required"
        ],
        min: [
            0,
            "Total value cannot be negative"
        ]
    },
    min_stock_level: {
        type: Number,
        min: [
            0,
            "Minimum stock level cannot be negative"
        ]
    },
    max_stock_level: {
        type: Number,
        min: [
            0,
            "Maximum stock level cannot be negative"
        ]
    },
    reorder_point: {
        type: Number,
        min: [
            0,
            "Reorder point cannot be negative"
        ]
    },
    location: {
        type: String,
        trim: true
    },
    last_purchase_date: Date,
    last_sale_date: Date
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
/**
 * CRITICAL INDEXES FOR PERFORMANCE AND DEDUPLICATION
 * 
 * 1. UNIQUE compound index: Prevents duplicate inventory entries
 *    Deduplication key: user_id + item_name + category + purity
 *    This ensures one inventory record per unique item configuration
 */ InventorySchema.index({
    user_id: 1,
    item_name: 1,
    category: 1,
    purity: 1
}, {
    unique: true,
    // Partial index: only when purity exists (for items without purity)
    partialFilterExpression: {
        purity: {
            $type: "string"
        }
    }
});
/**
 * 2. Inventory without purity (general items)
 *    For items that don't have purity (e.g., silver coins, diamonds)
 */ InventorySchema.index({
    user_id: 1,
    item_name: 1,
    category: 1
}, {
    unique: true,
    partialFilterExpression: {
        purity: {
            $exists: false
        }
    }
});
/**
 * 3. Category-wise inventory lookup
 *    Use case: View all gold jewellery, all silver items
 *    Query: find({ user_id, category })
 */ InventorySchema.index({
    user_id: 1,
    category: 1
});
/**
 * 4. Low stock alerts
 *    Use case: Find items below minimum stock level
 *    Query: find({ user_id, quantity: { $lt: min_stock_level } })
 */ InventorySchema.index({
    user_id: 1,
    quantity: 1,
    min_stock_level: 1
});
/**
 * 5. Stock lookup
 *    Use case: Find items in stock
 *    Query: find({ user_id, quantity: { $gt: 0 } })
 */ InventorySchema.index({
    user_id: 1,
    quantity: -1
});
/**
 * 6. Metal type filtering
 *    Use case: Get all gold inventory
 */ InventorySchema.index({
    user_id: 1,
    metal_type: 1
});
/**
 * 7. Text search for item names
 *    Use case: Search inventory by item name
 */ InventorySchema.index({
    user_id: 1,
    item_name: "text"
});
/**
 * Static method: Find or create inventory item (for deduplication)
 * Returns existing item if found, creates new one otherwise
 */ InventorySchema.statics.findOrCreate = async function(userId, itemData) {
    const query = {
        user_id: userId,
        item_name: itemData.item_name,
        category: itemData.category
    };
    // Add purity to query if it exists
    if (itemData.purity) {
        query.purity = itemData.purity.toUpperCase();
    }
    // Try to find existing inventory item
    let inventoryItem = await this.findOne(query);
    if (!inventoryItem) {
        // Create new inventory item
        inventoryItem = await this.create({
            ...itemData,
            user_id: userId,
            purity: itemData.purity?.toUpperCase()
        });
    }
    return inventoryItem;
};
/**
 * Static method: Add stock (called during purchase)
 * Updates quantity, weight, and recalculates values
 */ InventorySchema.statics.addStock = async function(session, userId, itemData) {
    const query = {
        user_id: userId,
        item_name: itemData.item_name,
        category: itemData.category
    };
    if (itemData.purity) {
        query.purity = itemData.purity.toUpperCase();
    }
    // Use findOneAndUpdate with upsert for atomic operation
    const inventoryItem = await this.findOneAndUpdate(query, {
        $inc: {
            quantity: itemData.quantity,
            weight: itemData.weight || 0
        },
        $set: {
            rate: itemData.rate,
            location: itemData.location || undefined,
            metal_type: itemData.metal_type || undefined,
            last_purchase_date: new Date()
        }
    }, {
        upsert: true,
        new: true,
        session,
        setDefaultsOnInsert: true
    });
    // Recalculate total value
    inventoryItem.total_value = inventoryItem.quantity * inventoryItem.rate;
    await inventoryItem.save({
        session
    });
    return inventoryItem;
};
/**
 * Static method: Remove stock (called during sale)
 * Decreases quantity and weight
 */ InventorySchema.statics.removeStock = async function(session, userId, itemData) {
    const query = {
        user_id: userId,
        item_name: itemData.item_name,
        category: itemData.category
    };
    if (itemData.purity) {
        query.purity = itemData.purity.toUpperCase();
    }
    const inventoryItem = await this.findOne(query).session(session);
    if (!inventoryItem) {
        throw new Error(`Inventory item not found: ${itemData.item_name}`);
    }
    if (inventoryItem.quantity < itemData.quantity) {
        throw new Error(`Insufficient stock for ${itemData.item_name}. Available: ${inventoryItem.quantity}, Requested: ${itemData.quantity}`);
    }
    // Decrease quantity and weight
    inventoryItem.quantity -= itemData.quantity;
    inventoryItem.weight = (inventoryItem.weight || 0) - (itemData.weight || 0);
    inventoryItem.last_sale_date = new Date();
    // Recalculate total value
    inventoryItem.total_value = inventoryItem.quantity * inventoryItem.rate;
    await inventoryItem.save({
        session
    });
    return inventoryItem;
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Inventory || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Inventory", InventorySchema);
}),
"[project]/lib/models/Customer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const CustomerSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    user_id: {
        type: String,
        required: [
            true,
            "User ID is required"
        ],
        index: true
    },
    customer_type: {
        type: String,
        required: [
            true,
            "Customer type is required"
        ],
        enum: {
            values: [
                "B2C",
                "B2B"
            ],
            message: "{VALUE} is not a valid customer type"
        },
        default: "B2C"
    },
    name: {
        type: String,
        required: [
            true,
            "Customer name is required"
        ],
        trim: true,
        minlength: [
            2,
            "Name must be at least 2 characters"
        ],
        maxlength: [
            100,
            "Name cannot exceed 100 characters"
        ]
    },
    phone: {
        type: String,
        required: [
            true,
            "Phone number is required"
        ],
        trim: true,
        validate: {
            validator: function(v) {
                // Indian phone number validation: 10 digits
                return /^[6-9]\d{9}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid Indian phone number!`
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid email address!`
        }
    },
    address: {
        type: String,
        trim: true,
        maxlength: [
            500,
            "Address cannot exceed 500 characters"
        ]
    },
    city: {
        type: String,
        trim: true,
        maxlength: [
            100,
            "City cannot exceed 100 characters"
        ]
    },
    state: {
        type: String,
        trim: true,
        maxlength: [
            100,
            "State cannot exceed 100 characters"
        ]
    },
    pincode: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^\d{6}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid pincode!`
        }
    },
    business_name: {
        type: String,
        trim: true,
        maxlength: [
            200,
            "Business name cannot exceed 200 characters"
        ]
    },
    contact_person: {
        type: String,
        trim: true,
        maxlength: [
            100,
            "Contact person name cannot exceed 100 characters"
        ]
    },
    gst_number: {
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid GST number!`
        }
    },
    pan_number: {
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid PAN number!`
        }
    },
    total_purchases: {
        type: Number,
        default: 0,
        min: 0
    },
    total_purchase_value: {
        type: Number,
        default: 0,
        min: 0
    },
    last_purchase_date: Date,
    lifetime_discount_given: {
        type: Number,
        default: 0,
        min: 0
    },
    credit_limit: {
        type: Number,
        min: 0
    },
    outstanding_balance: {
        type: Number,
        default: 0,
        min: 0
    },
    payment_terms: {
        type: String,
        enum: {
            values: [
                "IMMEDIATE",
                "15_DAYS",
                "30_DAYS",
                "45_DAYS",
                "60_DAYS"
            ],
            message: "{VALUE} is not a valid payment term"
        }
    },
    is_active: {
        type: Boolean,
        default: true,
        index: true
    },
    loyalty_tier: {
        type: String,
        enum: {
            values: [
                "BRONZE",
                "SILVER",
                "GOLD",
                "PLATINUM"
            ],
            message: "{VALUE} is not a valid loyalty tier"
        }
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [
            1000,
            "Notes cannot exceed 1000 characters"
        ]
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
/**
 * CRITICAL INDEXES FOR PERFORMANCE
 */ // 1. Unique phone per user (deduplication)
CustomerSchema.index({
    user_id: 1,
    phone: 1
}, {
    unique: true
});
// 2. Active customers lookup
CustomerSchema.index({
    user_id: 1,
    is_active: 1
});
// 3. Recent customers
CustomerSchema.index({
    user_id: 1,
    last_purchase_date: -1
});
// 4. Customer type filtering
CustomerSchema.index({
    user_id: 1,
    customer_type: 1
});
// 5. Text search on name
CustomerSchema.index({
    user_id: 1,
    name: "text"
});
// 6. GST lookup (sparse - only for B2B)
CustomerSchema.index({
    user_id: 1,
    gst_number: 1
}, {
    sparse: true
});
// 7. Outstanding balance (for credit management)
CustomerSchema.index({
    user_id: 1,
    outstanding_balance: -1
});
/**
 * Pre-save middleware
 */ CustomerSchema.pre("save", function(next) {
    // Clean phone number
    if (this.phone) {
        this.phone = this.phone.replace(/\s/g, "");
    }
    // Set loyalty tier based on total purchase value
    if (this.total_purchase_value > 0) {
        if (this.total_purchase_value >= 1000000) {
            this.loyalty_tier = "PLATINUM";
        } else if (this.total_purchase_value >= 500000) {
            this.loyalty_tier = "GOLD";
        } else if (this.total_purchase_value >= 200000) {
            this.loyalty_tier = "SILVER";
        } else {
            this.loyalty_tier = "BRONZE";
        }
    }
    next();
});
/**
 * Static method: Find or create customer by phone
 */ CustomerSchema.statics.findOrCreateByPhone = async function(userId, customerData) {
    const phone = customerData.phone?.replace(/\s/g, "");
    if (!phone) {
        throw new Error("Phone number is required");
    }
    // Try to find existing customer
    let customer = await this.findOne({
        user_id: userId,
        phone
    });
    if (customer) {
        // Update existing customer with latest data
        customer.name = customerData.name || customer.name;
        customer.email = customerData.email || customer.email;
        customer.address = customerData.address || customer.address;
        customer.city = customerData.city || customer.city;
        customer.state = customerData.state || customer.state;
        customer.pincode = customerData.pincode || customer.pincode;
        customer.business_name = customerData.business_name || customer.business_name;
        customer.contact_person = customerData.contact_person || customer.contact_person;
        customer.gst_number = customerData.gst_number || customer.gst_number;
        customer.pan_number = customerData.pan_number || customer.pan_number;
        await customer.save();
    } else {
        // Create new customer
        customer = await this.create({
            ...customerData,
            user_id: userId,
            phone
        });
    }
    return customer;
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Customer || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Customer", CustomerSchema);
}),
"[project]/lib/models/MetalLedger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MetalLedgerSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    user_id: {
        type: String,
        required: [
            true,
            "User ID is required"
        ],
        index: true
    },
    transaction_type: {
        type: String,
        required: [
            true,
            "Transaction type is required"
        ],
        enum: {
            values: [
                "PURCHASE",
                "SALE",
                "EXCHANGE",
                "ADJUSTMENT"
            ],
            message: "{VALUE} is not a valid transaction type"
        }
    },
    transaction_ref_id: {
        type: String,
        required: [
            true,
            "Transaction reference ID is required"
        ]
    },
    transaction_ref_type: {
        type: String,
        required: [
            true,
            "Transaction reference type is required"
        ],
        enum: {
            values: [
                "Purchase",
                "Sale",
                "Exchange",
                "Adjustment"
            ],
            message: "{VALUE} is not a valid reference type"
        }
    },
    metal_type: {
        type: String,
        required: [
            true,
            "Metal type is required"
        ],
        enum: {
            values: [
                "GOLD",
                "SILVER",
                "PLATINUM",
                "DIAMOND"
            ],
            message: "{VALUE} is not a valid metal type"
        },
        uppercase: true
    },
    purity: {
        type: String,
        required: [
            true,
            "Purity is required"
        ],
        trim: true,
        validate: {
            validator: function(v) {
                // Allow common purities: 22K, 24K, 916, 999, 925, etc.
                return /^(\d{2,3}[K]?|\d{2,3}\.\d{1,2})$/i.test(v);
            },
            message: (props)=>`${props.value} is not a valid purity format!`
        }
    },
    weight_in: {
        type: Number,
        required: true,
        default: 0,
        min: [
            0,
            "Weight in cannot be negative"
        ]
    },
    weight_out: {
        type: Number,
        required: true,
        default: 0,
        min: [
            0,
            "Weight out cannot be negative"
        ]
    },
    net_weight: {
        type: Number,
        required: true,
        validate: {
            validator: function() {
                return this.net_weight === this.weight_in - this.weight_out;
            },
            message: "Net weight must equal weight_in - weight_out"
        }
    },
    running_balance: {
        type: Number,
        required: true,
        default: 0
    },
    rate_per_gram: {
        type: Number,
        required: [
            true,
            "Rate per gram is required"
        ],
        min: [
            0,
            "Rate cannot be negative"
        ]
    },
    total_value: {
        type: Number,
        required: [
            true,
            "Total value is required"
        ],
        min: [
            0,
            "Total value cannot be negative"
        ]
    },
    transaction_date: {
        type: Date,
        required: [
            true,
            "Transaction date is required"
        ],
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [
            500,
            "Notes cannot exceed 500 characters"
        ]
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
/**
 * CRITICAL INDEXES FOR PERFORMANCE
 * 
 * 1. Current balance lookup by metal and purity
 *    Use case: Get current gold 22K balance
 *    Query: find({ user_id, metal_type: "GOLD", purity: "22K" }).sort({ created_at: -1 }).limit(1)
 */ MetalLedgerSchema.index({
    user_id: 1,
    metal_type: 1,
    purity: 1,
    created_at: -1
});
/**
 * 2. Transaction reference lookup
 *    Use case: Find all ledger entries for a specific purchase
 *    Query: find({ transaction_ref_id })
 */ MetalLedgerSchema.index({
    transaction_ref_id: 1
});
/**
 * 3. Date range queries for reports
 *    Use case: Get all gold transactions in a date range
 *    Query: find({ user_id, metal_type, transaction_date: { $gte, $lte } })
 */ MetalLedgerSchema.index({
    user_id: 1,
    metal_type: 1,
    transaction_date: -1
});
/**
 * 4. Transaction type filtering
 *    Use case: Get all purchases for a specific metal
 */ MetalLedgerSchema.index({
    user_id: 1,
    transaction_type: 1,
    metal_type: 1
});
/**
 * Pre-save middleware: Calculate net_weight
 */ MetalLedgerSchema.pre("save", function(next) {
    this.net_weight = this.weight_in - this.weight_out;
    next();
});
/**
 * Static method: Get current balance for a metal and purity
 * Returns the running balance from the most recent transaction
 */ MetalLedgerSchema.statics.getCurrentBalance = async function(userId, metalType, purity) {
    const lastEntry = await this.findOne({
        user_id: userId,
        metal_type: metalType.toUpperCase(),
        purity: purity.toUpperCase()
    }).sort({
        created_at: -1
    }).select("running_balance").lean();
    return lastEntry ? lastEntry.running_balance : 0;
};
/**
 * Static method: Add metal transaction (atomic operation)
 * This method should be called within a MongoDB transaction
 */ MetalLedgerSchema.statics.addTransaction = async function(session, transactionData) {
    // Get current balance
    const MetalLedger = this;
    const currentBalance = await MetalLedger.getCurrentBalance(transactionData.user_id, transactionData.metal_type, transactionData.purity);
    const weight_in = transactionData.weight_in || 0;
    const weight_out = transactionData.weight_out || 0;
    const net_weight = weight_in - weight_out;
    const running_balance = currentBalance + net_weight;
    // Create ledger entry
    const ledgerEntry = await this.create([
        {
            ...transactionData,
            weight_in,
            weight_out,
            net_weight,
            running_balance,
            transaction_date: transactionData.transaction_date || new Date()
        }
    ], {
        session
    });
    return ledgerEntry[0];
};
/**
 * Static method: Get metal summary (total balance per metal/purity)
 */ MetalLedgerSchema.statics.getMetalSummary = async function(userId) {
    const summary = await this.aggregate([
        {
            $match: {
                user_id: userId
            }
        },
        {
            $sort: {
                created_at: -1
            }
        },
        {
            $group: {
                _id: {
                    metal_type: "$metal_type",
                    purity: "$purity"
                },
                latest_entry: {
                    $first: "$$ROOT"
                },
                total_weight_in: {
                    $sum: "$weight_in"
                },
                total_weight_out: {
                    $sum: "$weight_out"
                },
                total_value: {
                    $sum: "$total_value"
                }
            }
        },
        {
            $project: {
                metal_type: "$_id.metal_type",
                purity: "$_id.purity",
                current_balance: "$latest_entry.running_balance",
                total_weight_in: 1,
                total_weight_out: 1,
                total_value: 1,
                last_transaction_date: "$latest_entry.transaction_date"
            }
        },
        {
            $sort: {
                metal_type: 1,
                purity: 1
            }
        }
    ]);
    return summary;
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.MetalLedger || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("MetalLedger", MetalLedgerSchema);
}),
"[project]/app/api/sales/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.0_c820c0e7ff6e3da9d12c9a3f6111e4c4/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Sale.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Inventory.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Customer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Customer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$MetalLedger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/MetalLedger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
;
;
;
;
;
;
;
;
/**
 * Validation Helper for Sale Data
 */ function validateSaleData(data) {
    const errors = [];
    // Customer validation
    if (!data.customer_name || data.customer_name.trim().length < 2) {
        errors.push("Customer name is required and must be at least 2 characters");
    }
    if (!data.customer_phone) {
        errors.push("Customer phone number is required");
    } else {
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = data.customer_phone.replace(/\s/g, "");
        if (!phoneRegex.test(cleanPhone)) {
            errors.push("Invalid phone number. Must be 10 digits starting with 6-9");
        }
    }
    // Items validation
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        errors.push("At least one item is required");
    } else {
        data.items.forEach((item, index)=>{
            if (!item.inventory_id) {
                errors.push(`Item ${index + 1}: Inventory ID is required`);
            }
            if (!item.quantity || item.quantity <= 0) {
                errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
            }
            if (item.discount_percentage < 0 || item.discount_percentage > 100) {
                errors.push(`Item ${index + 1}: Discount must be between 0 and 100`);
            }
            if (!item.gst_rate && item.gst_rate !== 0) {
                errors.push(`Item ${index + 1}: GST rate is required`);
            }
        });
    }
    // GST type validation
    if (!data.gst_type || ![
        "INTRASTATE",
        "INTERSTATE"
    ].includes(data.gst_type)) {
        errors.push("GST type is required and must be INTRASTATE or INTERSTATE");
    }
    // Payment validation
    if (!data.payment_mode) {
        errors.push("Payment mode is required");
    }
    if (data.amount_paid !== undefined && data.amount_paid < 0) {
        errors.push("Amount paid cannot be negative");
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Calculate Item Pricing
 * Calculates all pricing components for a single item
 */ function calculateItemPricing(item, gstType) {
    // Base price calculation
    let basePrice = 0;
    if (item.weight && item.gold_rate) {
        // For metal items: weight * rate + making + stone charges
        basePrice = item.weight * item.gold_rate + (item.making_charges || 0) + (item.stone_charges || 0);
    } else {
        // For regular items: base price already provided
        basePrice = item.base_price || item.making_charges + item.stone_charges;
    }
    // Discount calculation
    const discountAmount = basePrice * (item.discount_percentage || 0) / 100;
    // Taxable amount (after discount)
    const taxableAmount = basePrice - discountAmount;
    // GST calculation
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    if (gstType === "INTRASTATE") {
        cgstAmount = taxableAmount * item.gst_rate / 200; // Half of GST
        sgstAmount = taxableAmount * item.gst_rate / 200; // Half of GST
    } else {
        igstAmount = taxableAmount * item.gst_rate / 100;
    }
    const totalGst = cgstAmount + sgstAmount + igstAmount;
    // Final item total
    const itemTotal = taxableAmount + totalGst;
    return {
        base_price: Number(basePrice.toFixed(2)),
        discount_amount: Number(discountAmount.toFixed(2)),
        taxable_amount: Number(taxableAmount.toFixed(2)),
        cgst_amount: Number(cgstAmount.toFixed(2)),
        sgst_amount: Number(sgstAmount.toFixed(2)),
        igst_amount: Number(igstAmount.toFixed(2)),
        total_gst: Number(totalGst.toFixed(2)),
        item_total: Number(itemTotal.toFixed(2))
    };
}
async function GET(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized. Please login to continue."
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const customerId = searchParams.get("customer_id");
        const paymentStatus = searchParams.get("payment_status");
        const saleStatus = searchParams.get("sale_status");
        const customerType = searchParams.get("customer_type");
        const fromDate = searchParams.get("from_date");
        const toDate = searchParams.get("to_date");
        // Build query
        const query = {
            user_id: userId
        };
        if (customerId) {
            query.customer_id = customerId;
        }
        if (paymentStatus) {
            query.payment_status = paymentStatus.toUpperCase();
        }
        if (saleStatus) {
            query.sale_status = saleStatus.toUpperCase();
        }
        if (customerType) {
            query.customer_type = customerType.toUpperCase();
        }
        if (fromDate || toDate) {
            query.invoice_date = {};
            if (fromDate) {
                query.invoice_date.$gte = new Date(fromDate);
            }
            if (toDate) {
                query.invoice_date.$lte = new Date(toDate);
            }
        }
        // Execute query with pagination
        const skip = (page - 1) * limit;
        const [sales, totalCount] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).sort({
                invoice_date: -1
            }).skip(skip).limit(limit).populate("customer_id", "name phone customer_type gst_number").lean(),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments(query)
        ]);
        // Transform sales data to match frontend expectations
        const transformedSales = sales.map((sale)=>({
                ...sale,
                invoice_no: sale.invoice_number,
                sale_type: sale.customer_type?.toLowerCase() || 'b2c',
                sale_date: sale.invoice_date,
                subtotal: sale.total_base_price,
                discount: sale.total_discount_amount,
                gst: sale.total_gst,
                total: sale.grand_total,
                payment_method: sale.payment_mode,
                status: sale.sale_status?.toLowerCase() || 'completed',
                business_name: sale.customer_name,
                business_phone: sale.customer_phone,
                business_address: '',
                contact_person: '',
                gst_no: sale.customer_gst,
                items: sale.items.map((item)=>({
                        ...item,
                        product_id: item.inventory_id,
                        rate: item.base_price / item.quantity || 0,
                        amount: item.item_total
                    }))
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: transformedSales,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + sales.length < totalCount
            }
        });
    } catch (error) {
        console.error("Error fetching sales:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch sales"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    const maxRetries = 3;
    // Read the request body once before the retry loop
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Invalid request body"
        }, {
            status: 400
        });
    }
    for(let attempt = 1; attempt <= maxRetries; attempt++){
        let session_obj = null;
        try {
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
            if (!session || !session.user) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: "Unauthorized. Please login to continue."
                }, {
                    status: 401
                });
            }
            const userId = session.user.id;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
            // Drop old invoice_no index if it exists (migration)
            try {
                const saleCollection = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.collection('sales');
                const indexes = await saleCollection.indexes();
                const hasOldIndex = indexes.some((idx)=>idx.name === 'invoice_no_1');
                if (hasOldIndex) {
                    await saleCollection.dropIndex('invoice_no_1');
                    console.log('Dropped old invoice_no_1 index');
                }
            } catch (indexError) {
                // Index might not exist, that's okay
                console.log('No old index to drop or already dropped');
            }
            // Step 1: Validate input data
            const validation = validateSaleData(body);
            if (!validation.isValid) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: "Validation failed",
                    details: validation.errors
                }, {
                    status: 400
                });
            }
            // Step 2: Find or create customer BEFORE transaction (to avoid catalog changes)
            const customer = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Customer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOrCreateByPhone(userId, {
                name: body.customer_name.trim(),
                phone: body.customer_phone.replace(/\s/g, ""),
                customer_type: body.customer_type || "B2C",
                email: body.customer_email,
                address: body.customer_address,
                city: body.customer_city,
                state: body.customer_state,
                pincode: body.customer_pincode,
                business_name: body.business_name,
                contact_person: body.contact_person,
                gst_number: body.customer_gst?.toUpperCase(),
                payment_terms: body.payment_terms,
                credit_limit: body.credit_limit
            });
            // Start transaction AFTER customer is ready
            session_obj = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].startSession();
            session_obj.startTransaction({
                readConcern: {
                    level: "snapshot"
                },
                writeConcern: {
                    w: "majority"
                },
                readPreference: "primary"
            });
            // Step 3: Generate unique invoice number
            const invoiceNumber = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].generateInvoiceNumber(userId);
            // Step 4: Calculate pricing for each item and prepare sale data
            const processedItems = [];
            let totalBasePrice = 0;
            let totalMakingCharges = 0;
            let totalStoneCharges = 0;
            let totalDiscountAmount = 0;
            let totalTaxableAmount = 0;
            let totalCGST = 0;
            let totalSGST = 0;
            let totalIGST = 0;
            let totalGST = 0;
            let grandTotal = 0;
            for (const item of body.items){
                // Fetch inventory item details
                const inventoryItem = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                    _id: item.inventory_id,
                    user_id: userId
                }).session(session_obj);
                if (!inventoryItem) {
                    throw new Error(`Inventory item not found: ${item.inventory_id}`);
                }
                // Calculate item pricing
                const pricing = calculateItemPricing({
                    ...item,
                    gold_rate: item.gold_rate || inventoryItem.rate,
                    weight: item.weight || (inventoryItem.weight ? inventoryItem.weight / inventoryItem.quantity : 0)
                }, body.gst_type);
                const processedItem = {
                    inventory_id: inventoryItem._id,
                    item_name: inventoryItem.item_name,
                    category: inventoryItem.category,
                    purity: inventoryItem.purity,
                    metal_type: inventoryItem.metal_type,
                    quantity: item.quantity,
                    weight: item.weight,
                    gold_rate: item.gold_rate || inventoryItem.rate,
                    making_charges: item.making_charges || 0,
                    stone_charges: item.stone_charges || 0,
                    base_price: pricing.base_price,
                    discount_percentage: item.discount_percentage || 0,
                    discount_amount: pricing.discount_amount,
                    taxable_amount: pricing.taxable_amount,
                    gst_rate: item.gst_rate || 3,
                    cgst_amount: pricing.cgst_amount,
                    sgst_amount: pricing.sgst_amount,
                    igst_amount: pricing.igst_amount,
                    total_gst: pricing.total_gst,
                    item_total: pricing.item_total
                };
                processedItems.push(processedItem);
                // Aggregate totals
                totalBasePrice += pricing.base_price;
                totalMakingCharges += item.making_charges || 0;
                totalStoneCharges += item.stone_charges || 0;
                totalDiscountAmount += pricing.discount_amount;
                totalTaxableAmount += pricing.taxable_amount;
                totalCGST += pricing.cgst_amount;
                totalSGST += pricing.sgst_amount;
                totalIGST += pricing.igst_amount;
                totalGST += pricing.total_gst;
                grandTotal += pricing.item_total;
            }
            // Step 5: Create sale record
            const saleData = {
                user_id: userId,
                invoice_number: invoiceNumber,
                invoice_date: body.invoice_date ? new Date(body.invoice_date) : new Date(),
                customer_id: customer._id,
                customer_name: customer.name,
                customer_phone: customer.phone,
                customer_type: customer.customer_type,
                customer_gst: customer.gst_number,
                items: processedItems,
                total_base_price: Number(totalBasePrice.toFixed(2)),
                total_making_charges: Number(totalMakingCharges.toFixed(2)),
                total_stone_charges: Number(totalStoneCharges.toFixed(2)),
                total_discount_amount: Number(totalDiscountAmount.toFixed(2)),
                total_taxable_amount: Number(totalTaxableAmount.toFixed(2)),
                total_cgst: Number(totalCGST.toFixed(2)),
                total_sgst: Number(totalSGST.toFixed(2)),
                total_igst: Number(totalIGST.toFixed(2)),
                total_gst: Number(totalGST.toFixed(2)),
                grand_total: Number(grandTotal.toFixed(2)),
                gst_type: body.gst_type.toUpperCase(),
                payment_mode: body.payment_mode?.toUpperCase() || "CASH",
                payment_status: body.amount_paid >= grandTotal ? "PAID" : body.amount_paid > 0 ? "PARTIAL" : "UNPAID",
                amount_paid: body.amount_paid || 0,
                amount_pending: Number((grandTotal - (body.amount_paid || 0)).toFixed(2)),
                payment_date: body.amount_paid > 0 ? new Date() : undefined,
                payment_reference: body.payment_reference,
                payment_terms: body.payment_terms,
                warranty_years: body.warranty_years || 1,
                sale_status: "COMPLETED",
                is_inventory_updated: false,
                notes: body.notes
            };
            const sale = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create([
                saleData
            ], {
                session: session_obj
            });
            const createdSale = sale[0];
            // Step 6: Reduce inventory stock
            try {
                for (const item of processedItems){
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].removeStock(session_obj, userId, {
                        item_name: item.item_name,
                        category: item.category,
                        purity: item.purity,
                        quantity: item.quantity,
                        weight: item.weight
                    });
                }
                createdSale.is_inventory_updated = true;
                await createdSale.save({
                    session: session_obj
                });
            } catch (inventoryError) {
                console.error("Inventory update failed:", inventoryError);
                throw new Error(`Failed to update inventory: ${inventoryError instanceof Error ? inventoryError.message : "Unknown error"}`);
            }
            // Step 7: Update metal ledger (for metal items)
            for (const item of processedItems){
                if (item.metal_type && item.weight && item.purity) {
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$MetalLedger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].addTransaction(session_obj, {
                            user_id: userId,
                            transaction_type: "SALE",
                            transaction_ref_id: createdSale._id.toString(),
                            transaction_ref_type: "Sale",
                            metal_type: item.metal_type,
                            purity: item.purity,
                            weight_in: 0,
                            weight_out: item.weight,
                            rate_per_gram: item.gold_rate,
                            total_value: item.item_total,
                            transaction_date: createdSale.invoice_date,
                            notes: `Sale: ${item.item_name}`
                        });
                    } catch (ledgerError) {
                        console.error("Metal ledger update failed:", ledgerError);
                    // Continue - ledger update is not critical for sale completion
                    }
                }
            }
            // Step 8: Update customer aggregated stats
            customer.total_purchases += 1;
            customer.total_purchase_value += createdSale.grand_total;
            customer.lifetime_discount_given += createdSale.total_discount_amount;
            customer.last_purchase_date = createdSale.invoice_date;
            // Update outstanding balance for credit sales
            if (createdSale.payment_status !== "PAID") {
                customer.outstanding_balance += createdSale.amount_pending;
            }
            await customer.save({
                session: session_obj
            });
            // Commit transaction
            await session_obj.commitTransaction();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "Sale created successfully",
                data: {
                    sale: createdSale,
                    invoice_number: invoiceNumber,
                    customer_id: customer._id,
                    grand_total: createdSale.grand_total,
                    amount_pending: createdSale.amount_pending
                }
            });
        } catch (error) {
            // Rollback transaction on any error
            if (session_obj) {
                try {
                    await session_obj.abortTransaction();
                } catch (abortError) {
                // Transaction may already be aborted, ignore
                }
                session_obj.endSession();
                session_obj = null;
            }
            // Check if this is a transient transaction error that can be retried
            const errorMessage = error.message || '';
            const isTransientError = error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError') || error.code === 112 || // WriteConflict
            error.code === 251 || // NoSuchTransaction
            error.code === 11000 || // DuplicateKey
            errorMessage.includes('catalog changes') || errorMessage.includes('Write conflict') || errorMessage.includes('yielding is disabled') || errorMessage.includes('WriteConflict') || errorMessage.includes('TransientTransactionError');
            if (isTransientError && attempt < maxRetries) {
                console.warn(`[SALE_RETRY] Attempt ${attempt}/${maxRetries} failed, retrying...`, {
                    error: errorMessage,
                    code: error.code,
                    name: error.name
                });
                // Wait before retry with exponential backoff
                await new Promise((resolve)=>setTimeout(resolve, 100 * Math.pow(2, attempt)));
                continue; // Retry
            }
            // Non-retryable error or max retries reached
            console.error("Sale creation failed:", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: error instanceof Error ? error.message : "Failed to create sale",
                code: "SALE_CREATION_FAILED"
            }, {
                status: 500
            });
        }
    }
    // Should never reach here, but TypeScript needs it
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        error: "Failed to create sale after multiple retries",
        code: "MAX_RETRIES_EXCEEDED"
    }, {
        status: 500
    });
}
async function DELETE(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized. Please login to continue."
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Sale ID is required"
            }, {
                status: 400
            });
        }
        const sale = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndDelete({
            _id: id,
            user_id: userId
        });
        if (!sale) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Sale not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Sale deleted successfully",
            data: {
                deleted_id: id
            }
        });
    } catch (error) {
        console.error("Sale deletion failed:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete sale"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__883b2f87._.js.map