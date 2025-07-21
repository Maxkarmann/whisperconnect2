import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
}

export default function AudioRecorder({ 
  onRecordingComplete, 
  onRecordingStateChange 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const { toast } = useToast();

  // Check microphone permissions on mount
  const checkPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
    } catch (err) {
      setPermissionGranted(false);
      console.warn('Microphone permission denied:', err);
    }
  }, []);

  // Request permissions if not already granted
  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      return true;
    } catch (err) {
      setPermissionGranted(false);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to record your tasks.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (permissionGranted === null) {
      await checkPermissions();
    }
    
    if (permissionGranted === false) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        const duration = Math.round(recordingTime);
        onRecordingComplete(audioBlob, duration);
        
        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      startTimeRef.current = Date.now();
      setIsRecording(true);
      onRecordingStateChange(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setRecordingTime(elapsed);
      }, 100);

    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        title: "Recording Failed",
        description: "Unable to start recording. Please check your microphone.",
        variant: "destructive",
      });
    }
  }, [permissionGranted, checkPermissions, requestPermissions, onRecordingComplete, onRecordingStateChange, recordingTime, toast]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStateChange(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, onRecordingStateChange]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Recording Button */}
      <div className="relative">
        <Button
          onClick={toggleRecording}
          size="lg"
          className={`w-32 h-32 rounded-full text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 ${
            isRecording 
              ? 'bg-destructive hover:bg-destructive/90 focus:ring-destructive/20' 
              : 'bg-primary hover:bg-primary/90 focus:ring-primary/20'
          }`}
        >
          {isRecording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        
        {/* Recording Ring Animation */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-destructive animate-pulse"></div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <div className="text-gray-600 text-sm mb-2">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </div>
        
        {/* Timer */}
        {isRecording && (
          <div className="text-2xl font-mono text-gray-900">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {/* Audio Visualization */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-1">
          {[8, 16, 24, 32, 24, 16, 8].map((height, index) => (
            <div
              key={index}
              className="w-1 bg-primary rounded-full animate-pulse"
              style={{ 
                height: `${height}px`,
                animationDelay: `${index * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
