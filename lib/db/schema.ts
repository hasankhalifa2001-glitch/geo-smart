import { pgTable, text, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    passwordHash: text("password_hash"),
    tier: text("tier").default("free").notNull(), // 'free' | 'pro' | 'enterprise'
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    mode: text("mode").notNull(), // 'map' | 'geometric' | 'professional'
    coordinates: jsonb("coordinates").$type<[number, number][]>(),
    areaM2: doublePrecision("area_m2"),
    perimeterM: doublePrecision("perimeter_m"),
    unitPreference: text("unit_preference").default("m2").notNull(), // 'm2' | 'donum' | 'hectare' | 'qasaba'
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
    amount: doublePrecision("amount").notNull(),
    currency: text("currency").notNull(),
    status: text("status").notNull(), // 'pending' | 'completed' | 'failed'
    gatewayOrderId: text("gateway_order_id"),
    reportUrl: text("report_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
