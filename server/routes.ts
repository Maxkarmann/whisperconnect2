import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { transcribeAudio } from "./services/openai";
import { processTasksWithGemini } from "./services/gemini";
import { sendTasksToTrello } from "./services/email";
import { insertTaskSchema, insertApiUsageSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit (OpenAI Whisper limit)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task processing endpoint
  app.post('/api/dictate-task', isAuthenticated, upload.single('audio'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const audioFile = req.file;

      if (!audioFile) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      console.log(`Processing audio file for user ${userId}: ${audioFile.size} bytes`);

      // Step 1: Transcribe audio with OpenAI Whisper
      const transcriptionResult = await transcribeAudio(audioFile);
      
      if (!transcriptionResult.text || transcriptionResult.text.trim().length === 0) {
        return res.status(400).json({ message: "No speech detected in audio" });
      }

      // Step 2: Process transcription with Gemini AI
      const processedTasks = await processTasksWithGemini(transcriptionResult.text);

      if (!processedTasks || processedTasks.length === 0) {
        return res.status(400).json({ message: "No actionable tasks found in transcription" });
      }

      // Step 3: Calculate costs (in cents)
      const audioMinutes = Math.ceil(transcriptionResult.duration / 60);
      const whisperCost = Math.ceil(audioMinutes * 0.6); // $0.006 per minute = 0.6 cents
      const geminiCost = Math.ceil(processedTasks.length * 1.5); // Estimate 1.5 cents per task (Gemini is more cost-effective)
      const totalCost = whisperCost + geminiCost;

      // Step 4: Save task to database
      const task = await storage.createTask({
        userId,
        originalTranscription: transcriptionResult.text,
        processedTasks: processedTasks,
        audioDuration: transcriptionResult.duration,
        apiCost: totalCost,
        emailSent: false,
      });

      // Step 5: Record API usage
      await storage.recordApiUsage({
        userId,
        whisperMinutes: audioMinutes,
        whisperCost,
        geminiTokens: processedTasks.length * 100, // Estimate tokens for Gemini
        geminiCost: geminiCost,
        totalCost,
      });

      // Step 6: Send tasks to Trello via email (async)
      sendTasksToTrello(processedTasks, task.id)
        .then(() => {
          storage.updateTaskEmailSent(task.id);
          console.log(`Tasks sent to Trello for task ${task.id}`);
        })
        .catch((error) => {
          console.error(`Failed to send tasks to Trello for task ${task.id}:`, error);
        });

      res.json({
        success: true,
        taskId: task.id,
        transcription: transcriptionResult.text,
        tasks: processedTasks,
        cost: totalCost,
        message: "Tasks processed and sent to Trello!",
      });

    } catch (error) {
      console.error("Error processing dictation:", error);
      res.status(500).json({ 
        message: "Failed to process dictation",
        error: (error as Error).message 
      });
    }
  });

  // Get user tasks
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const tasks = await storage.getUserTasks(userId, limit);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Get user statistics
  app.get('/api/stats/daily', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserDailyStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      res.status(500).json({ message: "Failed to fetch daily stats" });
    }
  });

  app.get('/api/stats/monthly', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserMonthlyStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
  });

  // Send weekly reminder endpoint (for Cloud Scheduler)
  app.post('/api/send-reminder', async (req, res) => {
    try {
      // This would be called by Google Cloud Scheduler
      // For now, we'll just return success
      console.log("Weekly reminder endpoint called");
      res.json({ success: true, message: "Reminder functionality not yet implemented" });
    } catch (error) {
      console.error("Error sending reminder:", error);
      res.status(500).json({ message: "Failed to send reminder" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
