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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
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
    membership_type: {
        type: String,
        enum: [
            "free",
            "basic",
            "premium",
            "enterprise"
        ],
        default: "free"
    },
    membership_status: {
        type: String,
        enum: [
            "active",
            "expired",
            "suspended"
        ],
        default: "active"
    },
    membership_start_date: {
        type: Date,
        default: Date.now
    },
    membership_end_date: {
        type: Date
    },
    max_users: {
        type: Number,
        default: 1
    },
    max_inventory: {
        type: Number,
        default: 100
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
        const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10);
        this.password = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(candidatePassword, this.password);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/User.ts [app-route] (ecmascript)");
;
;
;
;
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
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
const handler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(authOptions);
;
}),
"[project]/lib/models/Purchase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const PurchaseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    user_id: {
        type: String,
        required: [
            true,
            "User ID is required"
        ],
        index: true
    },
    purchase_reference: {
        type: String,
        required: [
            true,
            "Purchase reference is required"
        ],
        unique: true,
        index: true
    },
    supplier_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: "Supplier",
        required: [
            true,
            "Supplier ID is required"
        ]
    },
    supplier_name: {
        type: String,
        required: [
            true,
            "Supplier name is required"
        ],
        trim: true
    },
    supplier_phone: {
        type: String,
        required: [
            true,
            "Supplier phone is required"
        ],
        trim: true
    },
    supplier_gst: {
        type: String,
        trim: true,
        uppercase: true
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
    quantity: {
        type: Number,
        required: [
            true,
            "Quantity is required"
        ],
        min: [
            0.01,
            "Quantity must be greater than 0"
        ]
    },
    weight: {
        type: Number,
        min: [
            0,
            "Weight cannot be negative"
        ]
    },
    purity: {
        type: String,
        trim: true
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
    rate_per_unit: {
        type: Number,
        required: [
            true,
            "Rate per unit is required"
        ],
        min: [
            0.01,
            "Rate must be greater than 0"
        ]
    },
    subtotal: {
        type: Number,
        required: [
            true,
            "Subtotal is required"
        ],
        min: [
            0,
            "Subtotal cannot be negative"
        ]
    },
    gst_rate: {
        type: Number,
        required: [
            true,
            "GST rate is required"
        ],
        min: [
            0,
            "GST rate cannot be negative"
        ],
        max: [
            100,
            "GST rate cannot exceed 100%"
        ],
        validate: {
            validator: function(v) {
                // Valid GST rates in India: 0, 3, 5, 12, 18, 28
                return [
                    0,
                    3,
                    5,
                    12,
                    18,
                    28
                ].includes(v);
            },
            message: (props)=>`${props.value} is not a valid GST rate! Must be 0, 3, 5, 12, 18, or 28`
        }
    },
    cgst_amount: {
        type: Number,
        required: true,
        default: 0,
        min: [
            0,
            "CGST amount cannot be negative"
        ]
    },
    sgst_amount: {
        type: Number,
        required: true,
        default: 0,
        min: [
            0,
            "SGST amount cannot be negative"
        ]
    },
    igst_amount: {
        type: Number,
        required: true,
        default: 0,
        min: [
            0,
            "IGST amount cannot be negative"
        ]
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
    total_gst: {
        type: Number,
        default: 0,
        min: [
            0,
            "Total GST cannot be negative"
        ]
    },
    total_amount: {
        type: Number,
        default: 0,
        min: [
            0,
            "Total amount cannot be negative"
        ]
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
        min: [
            0,
            "Amount paid cannot be negative"
        ]
    },
    amount_pending: {
        type: Number,
        required: true,
        default: 0,
        min: [
            0,
            "Amount pending cannot be negative"
        ]
    },
    payment_mode: {
        type: String,
        required: [
            true,
            "Payment mode is required"
        ],
        trim: true,
        default: "CASH"
    },
    payment_date: Date,
    payment_reference: {
        type: String,
        trim: true
    },
    purchase_date: {
        type: Date,
        required: [
            true,
            "Purchase date is required"
        ],
        default: Date.now
    },
    invoice_number: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [
            1000,
            "Notes cannot exceed 1000 characters"
        ]
    },
    is_inventory_updated: {
        type: Boolean,
        default: false
    },
    is_ledger_updated: {
        type: Boolean,
        default: false
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
 * 1. Unique purchase reference lookup
 *    Use case: Find purchase by reference number - O(1)
 */ PurchaseSchema.index({
    purchase_reference: 1
}, {
    unique: true
});
/**
 * 2. User's recent purchases
 *    Use case: Dashboard - show recent purchases
 *    Query: find({ user_id }).sort({ purchase_date: -1 })
 */ PurchaseSchema.index({
    user_id: 1,
    purchase_date: -1
});
/**
 * 3. Supplier-wise purchase history
 *    Use case: View all purchases from a specific supplier
 *    Query: find({ user_id, supplier_id }).sort({ purchase_date: -1 })
 */ PurchaseSchema.index({
    user_id: 1,
    supplier_id: 1,
    purchase_date: -1
});
/**
 * 4. Payment status filtering
 *    Use case: Find all unpaid/partial purchases
 *    Query: find({ user_id, payment_status: "UNPAID" })
 */ PurchaseSchema.index({
    user_id: 1,
    payment_status: 1
});
/**
 * 5. Item-wise purchase tracking
 *    Use case: Find all purchases of a specific item
 *    Query: find({ user_id, item_name }).sort({ purchase_date: -1 })
 */ PurchaseSchema.index({
    user_id: 1,
    item_name: 1,
    purchase_date: -1
});
/**
 * 6. Date range queries for reports
 *    Use case: Monthly/yearly purchase reports
 *    Query: find({ user_id, purchase_date: { $gte, $lte } })
 */ PurchaseSchema.index({
    user_id: 1,
    created_at: -1
});
/**
 * 7. Category-wise purchases
 *    Use case: Category-wise purchase analytics
 */ PurchaseSchema.index({
    user_id: 1,
    category: 1,
    purchase_date: -1
});
/**
 * Pre-save middleware: Calculate GST and payment amounts
 */ PurchaseSchema.pre("save", function(next) {
    // Calculate GST based on type
    if (this.gst_type === "INTRASTATE") {
        // Split GST into CGST and SGST
        this.cgst_amount = this.subtotal * this.gst_rate / 200; // Half of GST rate
        this.sgst_amount = this.subtotal * this.gst_rate / 200; // Half of GST rate
        this.igst_amount = 0;
        this.total_gst = this.cgst_amount + this.sgst_amount;
    } else {
        // Interstate - only IGST
        this.igst_amount = this.subtotal * this.gst_rate / 100;
        this.cgst_amount = 0;
        this.sgst_amount = 0;
        this.total_gst = this.igst_amount;
    }
    // Calculate total amount
    this.total_amount = this.subtotal + this.total_gst;
    // Calculate pending amount
    this.amount_pending = this.total_amount - this.amount_paid;
    // Update payment status based on amounts
    if (this.amount_paid === 0) {
        this.payment_status = "UNPAID";
    } else if (this.amount_paid >= this.total_amount) {
        this.payment_status = "PAID";
        this.amount_pending = 0;
    } else {
        this.payment_status = "PARTIAL";
    }
    next();
});
/**
 * Static method: Generate unique purchase reference
 * Format: PUR-YYYYMMDD-XXXX (e.g., PUR-20260117-0001)
 */ PurchaseSchema.statics.generatePurchaseReference = async function(userId) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "") // YYYYMMDD
    ;
    // Find last purchase reference for today
    const lastPurchase = await this.findOne({
        user_id: userId,
        purchase_reference: new RegExp(`^PUR-${dateStr}-`)
    }).sort({
        purchase_reference: -1
    }).select("purchase_reference").lean();
    let sequenceNumber = 1;
    if (lastPurchase && lastPurchase.purchase_reference) {
        const lastSequence = parseInt(lastPurchase.purchase_reference.slice(-4));
        sequenceNumber = lastSequence + 1;
    }
    const sequenceStr = sequenceNumber.toString().padStart(4, "0");
    return `PUR-${dateStr}-${sequenceStr}`;
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Purchase || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Purchase", PurchaseSchema);
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
"[project]/lib/models/Supplier.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const SupplierSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    user_id: {
        type: String,
        required: [
            true,
            "User ID is required"
        ],
        index: true
    },
    name: {
        type: String,
        required: [
            true,
            "Supplier name is required"
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
            message: (props)=>`${props.value} is not a valid Indian phone number! Must be 10 digits starting with 6-9`
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true // Email is optional
                ;
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
                if (!v) return true // Pincode is optional
                ;
                return /^\d{6}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid pincode! Must be 6 digits`
        }
    },
    gst_number: {
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true // GST is optional
                ;
                // GST format: 22AAAAA0000A1Z5
                return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid GST number! Format: 22AAAAA0000A1Z5`
        }
    },
    pan_number: {
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true // PAN is optional
                ;
                // PAN format: AAAAA9999A
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid PAN number! Format: AAAAA9999A`
        }
    },
    bank_name: String,
    account_number: String,
    ifsc_code: {
        type: String,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                if (!v) return true // IFSC is optional
                ;
                return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
            },
            message: (props)=>`${props.value} is not a valid IFSC code!`
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
    is_active: {
        type: Boolean,
        default: true,
        index: true
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
 * 1. Compound unique index: Ensures one supplier per phone per user
 *    Use case: Deduplication during purchase creation
 *    Query: findOne({ user_id, phone }) - O(1) lookup
 */ SupplierSchema.index({
    user_id: 1,
    phone: 1
}, {
    unique: true
});
/**
 * 2. Active suppliers lookup
 *    Use case: Fetching active suppliers for dropdown/autocomplete
 *    Query: find({ user_id, is_active: true })
 */ SupplierSchema.index({
    user_id: 1,
    is_active: 1
});
/**
 * 3. Recent suppliers lookup
 *    Use case: Show recently transacted suppliers
 *    Query: find({ user_id }).sort({ last_purchase_date: -1 })
 */ SupplierSchema.index({
    user_id: 1,
    last_purchase_date: -1
});
/**
 * 4. Text search index for autocomplete
 *    Use case: Search suppliers by name
 *    Query: find({ user_id, $text: { $search: "search term" } })
 */ SupplierSchema.index({
    user_id: 1,
    name: "text"
});
/**
 * 5. GST lookup (sparse index - only for suppliers with GST)
 *    Use case: Find supplier by GST number
 */ SupplierSchema.index({
    user_id: 1,
    gst_number: 1
}, {
    sparse: true
});
/**
 * Pre-save middleware: Normalize data
 */ SupplierSchema.pre("save", function(next) {
    // Remove spaces from phone number
    if (this.phone) {
        this.phone = this.phone.replace(/\s/g, "");
    }
    next();
});
/**
 * Static method: Find or create supplier by phone (upsert pattern)
 * This ensures supplier deduplication
 */ SupplierSchema.statics.findOrCreateByPhone = async function(userId, supplierData) {
    const phone = supplierData.phone?.replace(/\s/g, "");
    if (!phone) {
        throw new Error("Phone number is required for supplier");
    }
    // Try to find existing supplier
    let supplier = await this.findOne({
        user_id: userId,
        phone
    });
    if (supplier) {
        // Update existing supplier with latest data (keep aggregated fields)
        supplier.name = supplierData.name || supplier.name;
        supplier.email = supplierData.email || supplier.email;
        supplier.address = supplierData.address || supplier.address;
        supplier.city = supplierData.city || supplier.city;
        supplier.state = supplierData.state || supplier.state;
        supplier.pincode = supplierData.pincode || supplier.pincode;
        supplier.gst_number = supplierData.gst_number || supplier.gst_number;
        supplier.pan_number = supplierData.pan_number || supplier.pan_number;
        supplier.bank_name = supplierData.bank_name || supplier.bank_name;
        supplier.account_number = supplierData.account_number || supplier.account_number;
        supplier.ifsc_code = supplierData.ifsc_code || supplier.ifsc_code;
        await supplier.save();
    } else {
        // Create new supplier
        supplier = await this.create({
            ...supplierData,
            user_id: userId,
            phone
        });
    }
    return supplier;
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Supplier || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Supplier", SupplierSchema);
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
"[project]/app/api/purchase/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Purchase.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Inventory.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Supplier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Supplier.ts [app-route] (ecmascript)");
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
 * Input Validation Helper
 * Validates purchase request data and returns formatted errors
 */ function validatePurchaseData(data) {
    const errors = [];
    // Required fields validation
    if (!data.supplier_name || data.supplier_name.trim().length < 2) {
        errors.push("Supplier name is required and must be at least 2 characters");
    }
    if (!data.supplier_phone) {
        errors.push("Supplier phone number is required");
    } else {
        // Indian phone number validation
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = data.supplier_phone.replace(/\s/g, "");
        if (!phoneRegex.test(cleanPhone)) {
            errors.push("Invalid phone number. Must be a 10-digit Indian number starting with 6-9");
        }
    }
    // GST validation (if provided)
    if (data.supplier_gst) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(data.supplier_gst.toUpperCase())) {
            errors.push("Invalid GST number format. Expected format: 22AAAAA0000A1Z5");
        }
    }
    // Item validation
    if (!data.item_name || data.item_name.trim().length < 2) {
        errors.push("Item name is required and must be at least 2 characters");
    }
    if (!data.category || data.category.trim().length === 0) {
        errors.push("Category is required");
    }
    // Quantity validation
    if (!data.quantity || data.quantity <= 0) {
        errors.push("Quantity must be greater than 0");
    }
    // Rate validation
    if (!data.rate_per_unit || data.rate_per_unit <= 0) {
        errors.push("Rate per unit must be greater than 0");
    }
    // GST validation
    const validGSTRates = [
        0,
        3,
        5,
        12,
        18,
        28
    ];
    if (data.gst_rate === undefined || data.gst_rate === null) {
        errors.push("GST rate is required");
    } else if (!validGSTRates.includes(data.gst_rate)) {
        errors.push("Invalid GST rate. Must be one of: 0, 3, 5, 12, 18, 28");
    }
    // GST type validation
    if (!data.gst_type || ![
        "INTRASTATE",
        "INTERSTATE"
    ].includes(data.gst_type)) {
        errors.push("GST type is required and must be either INTRASTATE or INTERSTATE");
    }
    // Payment validation
    if (!data.payment_mode || data.payment_mode.trim().length === 0) {
        errors.push("Payment mode is required");
    }
    if (data.amount_paid !== undefined && data.amount_paid < 0) {
        errors.push("Amount paid cannot be negative");
    }
    // Metal-specific validation
    if (data.metal_type) {
        const validMetalTypes = [
            "GOLD",
            "SILVER",
            "PLATINUM",
            "DIAMOND"
        ];
        if (!validMetalTypes.includes(data.metal_type.toUpperCase())) {
            errors.push("Invalid metal type. Must be one of: GOLD, SILVER, PLATINUM, DIAMOND");
        }
        if (!data.purity) {
            errors.push("Purity is required for metal items");
        }
        if (!data.weight || data.weight <= 0) {
            errors.push("Weight must be greater than 0 for metal items");
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
async function GET(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
        const supplierId = searchParams.get("supplier_id");
        const paymentStatus = searchParams.get("payment_status");
        const fromDate = searchParams.get("from_date");
        const toDate = searchParams.get("to_date");
        const category = searchParams.get("category");
        // Build query
        const query = {
            user_id: userId
        };
        if (supplierId) {
            query.supplier_id = supplierId;
        }
        if (paymentStatus) {
            query.payment_status = paymentStatus.toUpperCase();
        }
        if (category) {
            query.category = category;
        }
        if (fromDate || toDate) {
            query.purchase_date = {};
            if (fromDate) {
                query.purchase_date.$gte = new Date(fromDate);
            }
            if (toDate) {
                query.purchase_date.$lte = new Date(toDate);
            }
        }
        // Execute query with pagination
        const skip = (page - 1) * limit;
        const [purchases, totalCount] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).sort({
                purchase_date: -1
            }).skip(skip).limit(limit).populate("supplier_id", "name phone gst_number").lean(),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments(query)
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: purchases,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + purchases.length < totalCount
            }
        });
    } catch (error) {
        console.error("Error fetching purchases:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch purchases"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    let session_obj = null;
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized. Please login to continue."
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        // Step 1: Validate input data
        const validation = validatePurchaseData(body);
        if (!validation.isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Validation failed",
                details: validation.errors
            }, {
                status: 400
            });
        }
        // Start transaction after validation
        session_obj = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].startSession();
        session_obj.startTransaction();
        // Step 2: Find or create supplier (deduplication by phone)
        const supplier = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Supplier$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOrCreateByPhone(userId, {
            name: body.supplier_name.trim(),
            phone: body.supplier_phone.replace(/\s/g, ""),
            gst_number: body.supplier_gst?.toUpperCase(),
            email: body.supplier_email,
            address: body.supplier_address,
            city: body.supplier_city,
            state: body.supplier_state,
            pincode: body.supplier_pincode
        });
        // Step 3: Generate unique purchase reference
        const purchaseReference = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].generatePurchaseReference(userId);
        // Step 4: Calculate subtotal if not provided
        const subtotal = body.subtotal || (body.metal_type && body.weight ? body.weight * body.rate_per_unit : body.quantity * body.rate_per_unit);
        // Step 5: Create purchase record
        const purchaseData = {
            user_id: userId,
            purchase_reference: purchaseReference,
            supplier_id: supplier._id,
            supplier_name: supplier.name,
            supplier_phone: supplier.phone,
            supplier_gst: supplier.gst_number,
            item_name: body.item_name.trim(),
            category: body.category.trim(),
            quantity: body.quantity,
            weight: body.weight,
            purity: body.purity?.toUpperCase(),
            metal_type: body.metal_type?.toUpperCase(),
            rate_per_unit: body.rate_per_unit,
            subtotal: subtotal,
            gst_rate: body.gst_rate,
            gst_type: body.gst_type.toUpperCase(),
            payment_mode: body.payment_mode.toUpperCase(),
            amount_paid: body.amount_paid || 0,
            purchase_date: body.purchase_date ? new Date(body.purchase_date) : new Date(),
            invoice_number: body.invoice_number,
            location: body.location,
            notes: body.notes,
            payment_date: body.amount_paid > 0 ? new Date() : undefined,
            payment_reference: body.payment_reference,
            is_inventory_updated: false,
            is_ledger_updated: false
        };
        const purchase = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create([
            purchaseData
        ], {
            session: session_obj
        });
        const createdPurchase = purchase[0];
        // Step 6: Update inventory atomically
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].addStock(session_obj, userId, {
                item_name: body.item_name.trim(),
                category: body.category.trim(),
                purity: body.purity?.toUpperCase(),
                metal_type: body.metal_type?.toUpperCase(),
                quantity: body.quantity,
                weight: body.weight,
                rate: body.rate_per_unit,
                location: body.location
            });
            createdPurchase.is_inventory_updated = true;
            await createdPurchase.save({
                session: session_obj
            });
        } catch (inventoryError) {
            console.error("Inventory update failed:", inventoryError);
            throw new Error(`Failed to update inventory: ${inventoryError instanceof Error ? inventoryError.message : "Unknown error"}`);
        }
        // Step 7: Update metal ledger (if metal item)
        if (body.metal_type && body.weight && body.purity) {
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$MetalLedger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].addTransaction(session_obj, {
                    user_id: userId,
                    transaction_type: "PURCHASE",
                    transaction_ref_id: createdPurchase._id.toString(),
                    transaction_ref_type: "Purchase",
                    metal_type: body.metal_type.toUpperCase(),
                    purity: body.purity.toUpperCase(),
                    weight_in: body.weight,
                    weight_out: 0,
                    rate_per_gram: body.rate_per_unit,
                    total_value: subtotal,
                    transaction_date: createdPurchase.purchase_date,
                    notes: `Purchase: ${body.item_name}`
                });
                createdPurchase.is_ledger_updated = true;
                await createdPurchase.save({
                    session: session_obj
                });
            } catch (ledgerError) {
                console.error("Metal ledger update failed:", ledgerError);
                throw new Error(`Failed to update metal ledger: ${ledgerError instanceof Error ? ledgerError.message : "Unknown error"}`);
            }
        }
        // Step 8: Update supplier aggregated stats
        supplier.total_purchases += 1;
        supplier.total_purchase_value += createdPurchase.total_amount;
        supplier.last_purchase_date = createdPurchase.purchase_date;
        await supplier.save({
            session: session_obj
        });
        // Commit transaction
        await session_obj.commitTransaction();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Purchase created successfully",
            data: {
                purchase: createdPurchase,
                purchase_reference: purchaseReference,
                supplier_id: supplier._id
            }
        });
    } catch (error) {
        // Rollback transaction on any error
        if (session_obj) {
            await session_obj.abortTransaction();
        }
        console.error("Purchase creation failed:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to create purchase",
            details: error instanceof Error && error.message.includes("duplicate key") ? "A purchase with this reference already exists" : undefined
        }, {
            status: 500
        });
    } finally{
        if (session_obj) {
            session_obj.endSession();
        }
    }
}
async function PUT(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized. Please login to continue."
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        const { id, ...updateData } = body;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Purchase ID is required"
            }, {
                status: 400
            });
        }
        // Only allow updating specific fields
        const allowedUpdates = [
            "amount_paid",
            "payment_mode",
            "payment_reference",
            "payment_date",
            "notes",
            "location",
            "invoice_number"
        ];
        const sanitizedUpdate = {};
        for (const key of allowedUpdates){
            if (updateData[key] !== undefined) {
                sanitizedUpdate[key] = updateData[key];
            }
        }
        // If payment date is provided, convert to Date
        if (sanitizedUpdate.payment_date) {
            sanitizedUpdate.payment_date = new Date(sanitizedUpdate.payment_date);
        }
        const purchase = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            _id: id,
            user_id: userId
        }, sanitizedUpdate, {
            new: true,
            runValidators: true
        });
        if (!purchase) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Purchase not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Purchase updated successfully",
            data: purchase
        });
    } catch (error) {
        console.error("Purchase update failed:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to update purchase"
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Purchase ID is required"
            }, {
                status: 400
            });
        }
        const purchase = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Purchase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndDelete({
            _id: id,
            user_id: userId
        });
        if (!purchase) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Purchase not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Purchase deleted successfully",
            data: {
                deleted_id: id
            }
        });
    } catch (error) {
        console.error("Purchase deletion failed:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete purchase"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__279c910d._.js.map