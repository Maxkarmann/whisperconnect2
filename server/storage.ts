import {
  users,
  tasks,
  apiUsage,
  type User,
  type UpsertUser,
  type Task,
  type InsertTaskData,
  type ApiUsage,
  type InsertApiUsageData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, and, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Task operations
  createTask(task: InsertTaskData): Promise<Task>;
  getUserTasks(userId: string, limit?: number): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  updateTaskEmailSent(id: number): Promise<void>;
  
  // API usage operations
  recordApiUsage(usage: InsertApiUsageData): Promise<ApiUsage>;
  getUserApiUsage(userId: string, fromDate?: Date): Promise<ApiUsage[]>;
  getUserDailyStats(userId: string): Promise<{
    tasksCreated: number;
    recordingTime: number;
    totalCost: number;
  }>;
  getUserMonthlyStats(userId: string): Promise<{
    totalCost: number;
    whisperMinutes: number;
    geminiTokens: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Task operations
  async createTask(task: InsertTaskData): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async getUserTasks(userId: string, limit: number = 20): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt))
      .limit(limit);
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async updateTaskEmailSent(id: number): Promise<void> {
    await db
      .update(tasks)
      .set({ emailSent: true })
      .where(eq(tasks.id, id));
  }

  // API usage operations
  async recordApiUsage(usage: InsertApiUsageData): Promise<ApiUsage> {
    const [newUsage] = await db.insert(apiUsage).values(usage).returning();
    return newUsage;
  }

  async getUserApiUsage(userId: string, fromDate?: Date): Promise<ApiUsage[]> {
    const conditions = [eq(apiUsage.userId, userId)];
    if (fromDate) {
      conditions.push(gte(apiUsage.date, fromDate));
    }
    
    return await db
      .select()
      .from(apiUsage)
      .where(and(...conditions))
      .orderBy(desc(apiUsage.date));
  }

  async getUserDailyStats(userId: string): Promise<{
    tasksCreated: number;
    recordingTime: number;
    totalCost: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [taskStats] = await db
      .select({
        tasksCreated: sum(tasks.id),
        recordingTime: sum(tasks.audioDuration),
        totalCost: sum(tasks.apiCost),
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.createdAt, today)
        )
      );

    return {
      tasksCreated: Number(taskStats.tasksCreated) || 0,
      recordingTime: Number(taskStats.recordingTime) || 0,
      totalCost: Number(taskStats.totalCost) || 0,
    };
  }

  async getUserMonthlyStats(userId: string): Promise<{
    totalCost: number;
    whisperMinutes: number;
    geminiTokens: number;
  }> {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const [monthStats] = await db
      .select({
        totalCost: sum(apiUsage.totalCost),
        whisperMinutes: sum(apiUsage.whisperMinutes),
        geminiTokens: sum(apiUsage.geminiTokens),
      })
      .from(apiUsage)
      .where(
        and(
          eq(apiUsage.userId, userId),
          gte(apiUsage.date, thisMonth)
        )
      );

    return {
      totalCost: Number(monthStats.totalCost) || 0,
      whisperMinutes: Number(monthStats.whisperMinutes) || 0,
      geminiTokens: Number(monthStats.geminiTokens) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
