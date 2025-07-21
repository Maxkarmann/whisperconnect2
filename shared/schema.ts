import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task history table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  originalTranscription: text("original_transcription").notNull(),
  processedTasks: jsonb("processed_tasks").notNull(), // JSON array of {title, description}
  audioUrl: text("audio_url"), // Optional: store audio file URL
  audioDuration: integer("audio_duration"), // Duration in seconds
  apiCost: integer("api_cost"), // Cost in cents
  createdAt: timestamp("created_at").defaultNow(),
  emailSent: boolean("email_sent").default(false),
});

// API usage tracking
export const apiUsage = pgTable("api_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  whisperMinutes: integer("whisper_minutes").default(0),
  whisperCost: integer("whisper_cost").default(0), // Cost in cents
  geminiTokens: integer("gemini_tokens").default(0),
  geminiCost: integer("gemini_cost").default(0), // Cost in cents
  totalCost: integer("total_cost").default(0), // Cost in cents
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertTask = typeof tasks.$inferInsert;
export type Task = typeof tasks.$inferSelect;

export type InsertApiUsage = typeof apiUsage.$inferInsert;
export type ApiUsage = typeof apiUsage.$inferSelect;

// Zod schemas
export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertApiUsageSchema = createInsertSchema(apiUsage).omit({
  id: true,
  date: true,
});

export type InsertTaskData = z.infer<typeof insertTaskSchema>;
export type InsertApiUsageData = z.infer<typeof insertApiUsageSchema>;
