import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import AudioRecorder from "./audio-recorder";
import { Mic, Square, Zap, CheckCircle, AlertCircle } from "lucide-react";

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: React.ReactNode;
}

interface ProcessedTask {
  title: string;
  description: string;
}

export default function DictationInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [processedTasks, setProcessedTasks] = useState<ProcessedTask[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processingMutation = useMutation({
    mutationFn: async (audioData: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioData, 'recording.wav');
      
      const response = await apiRequest('POST', '/api/dictate-task', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setProcessedTasks(data.tasks);
      setShowResults(true);
      
      // Update all steps to completed
      setProcessingSteps(prev => prev.map(step => ({
        ...step,
        status: 'completed' as const
      })));
      
      toast({
        title: "Tasks Created Successfully!",
        description: `${data.tasks.length} tasks sent to Trello`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      // Update processing steps to show error
      setProcessingSteps(prev => prev.map(step => ({
        ...step,
        status: step.status === 'processing' ? 'error' : step.status
      })));
      
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process your recording",
        variant: "destructive",
      });
    },
  });

  const handleRecordingComplete = (blob: Blob, duration: number) => {
    setAudioBlob(blob);
    setRecordingTime(duration);
    setIsRecording(false);
  };

  const handleProcessAudio = async () => {
    if (!audioBlob) return;

    setShowResults(false);
    setProcessedTasks([]);
    
    // Initialize processing steps
    const steps: ProcessingStep[] = [
      {
        id: 'transcribe',
        label: 'Transcribing audio with OpenAI Whisper',
        status: 'processing',
        icon: <Mic className="h-4 w-4" />
      },
      {
        id: 'process',
        label: 'Processing with Google Gemini AI',
        status: 'pending',
        icon: <Zap className="h-4 w-4" />
      },
      {
        id: 'create',
        label: 'Creating Trello cards',
        status: 'pending',
        icon: <CheckCircle className="h-4 w-4" />
      }
    ];
    
    setProcessingSteps(steps);
    
    // Simulate step progression
    setTimeout(() => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'transcribe' ? { ...step, status: 'completed' } : 
        step.id === 'process' ? { ...step, status: 'processing' } : step
      ));
    }, 1000);
    
    setTimeout(() => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'process' ? { ...step, status: 'completed' } : 
        step.id === 'create' ? { ...step, status: 'processing' } : step
      ));
    }, 2000);

    processingMutation.mutate(audioBlob);
  };

  const handleNewRecording = () => {
    setAudioBlob(null);
    setProcessedTasks([]);
    setProcessingSteps([]);
    setShowResults(false);
    setRecordingTime(0);
  };

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Panel */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voice Task Dictation</CardTitle>
          <CardDescription>
            Speak naturally and let AI organize your tasks into Trello cards
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStateChange={setIsRecording}
          />
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleProcessAudio}
              disabled={!audioBlob || processingMutation.isPending}
              className="bg-accent hover:bg-accent/90"
            >
              <Zap className="mr-2 h-4 w-4" />
              Process Tasks
            </Button>
            
            {(audioBlob || showResults) && (
              <Button
                variant="outline"
                onClick={handleNewRecording}
                disabled={processingMutation.isPending}
              >
                <Mic className="mr-2 h-4 w-4" />
                New Recording
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {processingSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Processing your tasks...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processingSteps.map((step) => (
                <div key={step.id} className="flex items-center space-x-3">
                  {getStepIcon(step)}
                  <span className={`text-sm ${
                    step.status === 'completed' ? 'text-accent' :
                    step.status === 'processing' ? 'text-primary' :
                    step.status === 'error' ? 'text-destructive' :
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResults && processedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>Tasks Created Successfully!</span>
            </CardTitle>
            <CardDescription>
              {processedTasks.length} tasks have been sent to your Trello board
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedTasks.map((task, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
