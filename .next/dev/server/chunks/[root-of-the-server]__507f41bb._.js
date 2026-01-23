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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

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
"[project]/app/api/sales/bill/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.0_c820c0e7ff6e3da9d12c9a3f6111e4c4/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Sale.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0_c820c0e7ff6e3da9d12c9a3f6111e4c4$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        const { searchParams } = new URL(request.url);
        const saleId = searchParams.get("id");
        if (!saleId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Sale ID required"
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const sale = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Sale$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            _id: saleId,
            user_id: userId
        }).lean();
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(userId).select('shop_name shop_address phone email gst_no').lean();
        if (!sale) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Sale not found"
            }, {
                status: 404
            });
        }
        // Fetch customer details for address
        const Customer = (await __turbopack_context__.A("[project]/lib/models/Customer.ts [app-route] (ecmascript, async loader)")).default;
        const customer = await Customer.findById(sale.customer_id).select('address city state pincode business_name contact_person').lean();
        // Map sale data to bill format
        const billData = {
            invoice_no: sale.invoice_number,
            sale_date: sale.invoice_date || sale.created_at,
            sale_type: sale.customer_type?.toLowerCase() || 'b2c',
            customer_name: sale.customer_name,
            customer_phone: sale.customer_phone,
            customer_address: customer?.address || '',
            business_name: customer?.business_name || sale.customer_name,
            contact_person: customer?.contact_person || '',
            gst_no: sale.customer_gst || '',
            business_phone: sale.customer_phone,
            business_address: customer?.address || '',
            payment_terms: sale.payment_terms,
            due_date: sale.due_date,
            items: sale.items.map((item)=>({
                    item_name: item.item_name,
                    purity: item.purity,
                    gross_weight: item.gross_weight,
                    weight: item.weight,
                    quantity: item.quantity,
                    rate: item.base_price / item.quantity || 0,
                    making_charges: item.making_charges,
                    amount: item.item_total
                })),
            subtotal: sale.total_base_price,
            discount: sale.total_discount_amount,
            gst: sale.total_gst,
            total: sale.grand_total,
            amount_paid: sale.amount_paid || 0,
            amount_pending: sale.amount_pending || 0,
            payment_method: sale.payment_mode,
            payment_status: sale.payment_status || 'UNPAID',
            warranty_years: sale.warranty_years || 0
        };
        // Generate bill HTML
        const billHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${sale.invoice_no}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .shop-name { 
      font-size: 28px; 
      font-weight: bold; 
      color: #C9A962;
      margin-bottom: 5px;
    }
    .shop-address { 
      font-size: 14px; 
      color: #666;
      margin-bottom: 3px;
    }
    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 5px;
    }
    .customer-section, .invoice-info {
      flex: 1;
    }
    .section-title {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .detail-row {
      margin-bottom: 5px;
      font-size: 13px;
    }
    .detail-label {
      font-weight: bold;
      color: #555;
      min-width: 100px;
      display: inline-block;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 30px;
    }
    th { 
      background: #333; 
      color: white; 
      padding: 12px; 
      text-align: left;
      font-size: 13px;
    }
    td { 
      padding: 10px; 
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }
    .text-right { text-align: right; }
    .totals {
      margin-left: auto;
      width: 300px;
      border-top: 2px solid #333;
      padding-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.grand-total {
      border-top: 2px solid #333;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #C9A962;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
    .thank-you {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="shop-name">${user?.shop_name || "Ratan Jewellers"}</div>
    <div class="shop-address">${user?.shop_address || "Shop No. 123, Sarafa Bazar, Indore, MP"}</div>
    <div class="shop-address">Phone: ${user?.phone || "+91 98765 43210"} | Email: ${user?.email || "info@ratanjewellers.com"}</div>
    <div class="shop-address">GSTIN: ${user?.gst_no || "27XXXXX1234X1ZX"}</div>
  </div>

  <div class="invoice-details">
    <div class="customer-section">
      <div class="section-title">${billData.sale_type === 'b2b' ? 'BUSINESS DETAILS' : 'CUSTOMER DETAILS'}</div>
      ${billData.sale_type === 'b2b' ? `
        <div class="detail-row"><span class="detail-label">Business Name:</span> ${billData.business_name}</div>
        <div class="detail-row"><span class="detail-label">Contact Person:</span> ${billData.contact_person || '-'}</div>
        <div class="detail-row"><span class="detail-label">GST No:</span> ${billData.gst_no}</div>
        <div class="detail-row"><span class="detail-label">Phone:</span> ${billData.business_phone}</div>
        <div class="detail-row"><span class="detail-label">Address:</span> ${billData.business_address || '-'}</div>
      ` : `
        <div class="detail-row"><span class="detail-label">Name:</span> ${billData.customer_name}</div>
        <div class="detail-row"><span class="detail-label">Phone:</span> ${billData.customer_phone}</div>
        <div class="detail-row"><span class="detail-label">Address:</span> ${billData.customer_address || '-'}</div>
      `}
    </div>
    <div class="invoice-info">
      <div class="section-title">INVOICE DETAILS</div>
      <div class="detail-row"><span class="detail-label">Invoice No:</span> ${billData.invoice_no}</div>
      <div class="detail-row"><span class="detail-label">Date:</span> ${new Date(billData.sale_date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })}</div>
      <div class="detail-row"><span class="detail-label">Type:</span> ${billData.sale_type === 'b2b' ? 'B2B (Wholesale)' : 'B2C (Retail)'}</div>
      ${billData.sale_type === 'b2b' && billData.payment_terms ? `
        <div class="detail-row"><span class="detail-label">Payment Terms:</span> ${billData.payment_terms}</div>
        ${billData.due_date ? `<div class="detail-row"><span class="detail-label">Due Date:</span> ${new Date(billData.due_date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })}</div>` : ''}
      ` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Item</th>
        <th class="text-right">Purity</th>
        <th class="text-right">Gross Wt (g)</th>
        <th class="text-right">Net Wt (g)</th>
        <th class="text-right">Rate</th>
        <th class="text-right">Making</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${billData.items.map((item, index)=>`
        <tr>
          <td>${index + 1}</td>
          <td>${item.item_name}</td>
          <td class="text-right">${item.purity || '-'}</td>
          <td class="text-right">${item.gross_weight ? item.gross_weight.toFixed(2) : '-'}</td>
          <td class="text-right">${item.weight ? item.weight.toFixed(2) : '-'}</td>
          <td class="text-right">₹${(item.rate || 0).toLocaleString('en-IN')}</td>
          <td class="text-right">₹${(item.making_charges || 0).toLocaleString('en-IN')}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">₹${(item.amount || 0).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>₹${(billData.subtotal || 0).toLocaleString('en-IN')}</span>
    </div>
    ${billData.discount > 0 ? `
      <div class="total-row" style="color: red;">
        <span>Discount:</span>
        <span>- ₹${(billData.discount || 0).toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    <div class="total-row">
      <span>GST (3%):</span>
      <span>₹${(billData.gst || 0).toLocaleString('en-IN')}</span>
    </div>
    <div class="total-row grand-total">
      <span>TOTAL:</span>
      <span>₹${(billData.total || 0).toLocaleString('en-IN')}</span>
    </div>
    ${billData.amount_paid > 0 ? `
      <div class="total-row" style="color: green;">
        <span>Amount Paid:</span>
        <span>₹${(billData.amount_paid || 0).toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    ${billData.amount_pending > 0 ? `
      <div class="total-row" style="color: orange;">
        <span>Amount Pending:</span>
        <span>₹${(billData.amount_pending || 0).toLocaleString('en-IN')}</span>
      </div>
    ` : ''}
    <div class="total-row">
      <span>Payment Method:</span>
      <span>${billData.payment_method ? billData.payment_method.toUpperCase() : billData.payment_terms === 'immediate' ? 'IMMEDIATE' : 'CREDIT'}</span>
    </div>
    <div class="total-row">
      <span>Payment Status:</span>
      <span style="color: ${billData.payment_status === 'PAID' ? 'green' : billData.payment_status === 'PARTIAL' ? 'orange' : 'red'};">${billData.payment_status ? billData.payment_status.toUpperCase() : 'UNPAID'}</span>
    </div>
    ${billData.warranty_years > 0 ? `
      <div class="total-row" style="border-top: 1px dashed #ddd; margin-top: 10px; padding-top: 10px;">
        <span>Warranty:</span>
        <span>${billData.warranty_years} ${billData.warranty_years === 1 ? 'Year' : 'Years'}</span>
      </div>
    ` : ''}
  </div>

  <div class="footer">
    <div class="thank-you">Thank You for Your Business!</div>
    <div>This is a computer generated invoice and does not require signature.</div>
    <div style="margin-top: 10px;">For any queries, please contact us at the above mentioned details.</div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](billHTML, {
            headers: {
                "Content-Type": "text/html; charset=utf-8"
            }
        });
    } catch (error) {
        console.error("Error generating bill:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Failed to generate bill"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__507f41bb._.js.map