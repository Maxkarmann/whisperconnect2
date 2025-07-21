import OpenAI from "openai";
import { Readable } from "stream";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
});

export interface TranscriptionResult {
  text: string;
  duration: number;
}

export async function transcribeAudio(audioFile: Express.Multer.File): Promise<TranscriptionResult> {
  try {
    console.log(`Transcribing audio file: ${audioFile.originalname}, size: ${audioFile.size} bytes`);
    
    // Convert buffer to readable stream
    const audioStream = Readable.from(audioFile.buffer);
    
    // Add filename property to the stream for OpenAI API
    (audioStream as any).path = audioFile.originalname || 'audio.wav';
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
    });

    console.log(`Transcription completed: ${transcription.text.substring(0, 100)}...`);

    return {
      text: transcription.text,
      duration: transcription.duration || 0,
    };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}
