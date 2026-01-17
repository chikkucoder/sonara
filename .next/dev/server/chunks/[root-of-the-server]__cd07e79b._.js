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
"[project]/app/api/inventory/normal/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/Inventory.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/auth/[...nextauth]/route.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET() {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const inventory = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            user_id: userId
        }).sort({
            created_at: -1
        }).lean();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: inventory
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Failed to fetch inventory"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        const inventory = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            ...body,
            user_id: userId
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: inventory
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Failed to create inventory"
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session || !session.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const userId = session.user.id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        const { id, ...updateData } = body;
        const inventory = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            _id: id,
            user_id: userId
        }, updateData, {
            new: true
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: inventory
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Failed to update inventory"
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
                error: "Unauthorized"
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
                error: "ID required"
            }, {
                status: 400
            });
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$Inventory$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndDelete({
            _id: id,
            user_id: userId
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Failed to delete inventory"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cd07e79b._.js.map