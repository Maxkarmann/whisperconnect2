import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ENV_VAR || "default_key",
});

export interface ProcessedTask {
  title: string;
  description: string;
}

export async function processTasksWithGemini(transcription: string): Promise<ProcessedTask[]> {
  try {
    console.log(`Processing transcription with Gemini: ${transcription.substring(0, 100)}...`);
    
    const systemPrompt = `You are an expert project manager. Your task is to analyze dictated spoken tasks and transform them into clear, actionable, and measurable Trello-ready cards. Break down larger concepts into multiple distinct tasks if necessary. For each generated Trello card, provide a concise 'Card Title' and a more detailed 'Card Description'. Format your output as a JSON array of objects, where each object has 'title' and 'description' keys. Example: [{'title': 'Task A', 'description': 'Details for Task A'}, {'title': 'Task B', 'description': 'Details for Task B'}].`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["tasks"]
        }
      },
      contents: `Please analyze this dictated text and convert it into actionable Trello cards:\n\n${transcription}`,
    });

    const rawJson = response.text;
    console.log(`Raw JSON from Gemini: ${rawJson}`);

    if (!rawJson) {
      throw new Error('Empty response from Gemini');
    }

    // Parse the JSON response
    let parsedResponse: { tasks: ProcessedTask[] };
    try {
      parsedResponse = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', rawJson);
      throw new Error('Failed to parse Gemini response as valid JSON');
    }

    // Validate the response structure
    if (!parsedResponse || !Array.isArray(parsedResponse.tasks)) {
      throw new Error('Gemini response does not contain valid tasks array');
    }

    // Validate each task has required fields
    const validTasks = parsedResponse.tasks.filter(task => 
      task && 
      typeof task === 'object' && 
      typeof task.title === 'string' && 
      typeof task.description === 'string' &&
      task.title.trim().length > 0 &&
      task.description.trim().length > 0
    );

    if (validTasks.length === 0) {
      throw new Error('No valid tasks found in Gemini response');
    }

    console.log(`Gemini processed ${validTasks.length} tasks`);
    return validTasks;

  } catch (error) {
    console.error("Error processing tasks with Gemini:", error);
    throw new Error(`Failed to process tasks with Gemini: ${(error as Error).message}`);
  }
}
