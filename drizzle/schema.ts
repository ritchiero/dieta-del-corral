import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabla de progreso del reto (22 días)
 * Cada usuario tiene UN solo registro de progreso activo
 */
export const progress = mysqlTable("progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  startDate: timestamp("startDate").notNull(), // Fecha de inicio del reto (UTC)
  completedDays: int("completedDays").default(0).notNull(), // Días completados (0-22)
  totalDays: int("totalDays").default(22).notNull(), // Total de días del reto
  isActive: int("isActive").default(1).notNull(), // 1 = activo, 0 = completado/abandonado
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = typeof progress.$inferInsert;

/**
 * Tabla de tareas diarias completadas
 * Cada fila representa una tarea específica completada en un día específico
 */
export const dailyTasks = mysqlTable("daily_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  progressId: int("progressId").notNull().references(() => progress.id, { onDelete: "cascade" }),
  date: varchar("date", { length: 32 }).notNull(), // Fecha en formato "YYYY-MM-DD" (UTC)
  taskId: varchar("taskId", { length: 64 }).notNull(), // ID de la tarea (ej: "workout-1", "meal-1")
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type DailyTask = typeof dailyTasks.$inferSelect;
export type InsertDailyTask = typeof dailyTasks.$inferInsert;