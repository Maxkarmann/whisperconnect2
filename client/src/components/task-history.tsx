import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { CheckCircle, Clock, DollarSign, Mic, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Task {
  id: number;
  originalTranscription: string;
  processedTasks: Array<{ title: string; description: string }>;
  audioDuration: number;
  apiCost: number;
  createdAt: string;
  emailSent: boolean;
}

interface DailyStats {
  tasksCreated: number;
  recordingTime: number;
  totalCost: number;
}

interface MonthlyStats {
  totalCost: number;
  whisperMinutes: number;
  geminiTokens: number;
}

export default function TaskHistory() {
  const { toast } = useToast();

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    retry: false,
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
      }
    },
  });

  const { data: dailyStats } = useQuery<DailyStats>({
    queryKey: ['/api/stats/daily'],
    retry: false,
  });

  const { data: monthlyStats } = useQuery<MonthlyStats>({
    queryKey: ['/api/stats/monthly'],
    retry: false,
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatCost = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (tasksLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasks Created</span>
              <span className="font-semibold text-gray-900">
                {dailyStats?.tasksCreated || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recording Time</span>
              <span className="font-semibold text-gray-900">
                {dailyStats?.recordingTime ? formatTime(dailyStats.recordingTime) : '0m 0s'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Cost</span>
              <span className="font-semibold text-accent">
                {dailyStats?.totalCost ? formatCost(dailyStats.totalCost) : '$0.00'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks && tasks.length > 0 ? (
              tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-gray-900">
                          {task.processedTasks.length} task{task.processedTasks.length !== 1 ? 's' : ''} created
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                      </div>
                      <div className="space-y-1">
                        {task.processedTasks.slice(0, 2).map((processedTask, index) => (
                          <div key={index} className="text-xs text-gray-700">
                            • {processedTask.title}
                          </div>
                        ))}
                        {task.processedTasks.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{task.processedTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCost(task.apiCost)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Mic className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No tasks yet. Start by recording your first task!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-600">OpenAI Whisper</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$0.006/min</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600">Google Gemini AI</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Token-based</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Usage</span>
                <span className="font-semibold text-gray-900">
                  {monthlyStats?.totalCost ? formatCost(monthlyStats.totalCost) : '$0.00'}
                </span>
              </div>
              {monthlyStats && (
                <div className="mt-2 text-xs text-gray-500">
                  {monthlyStats.whisperMinutes} mins • {monthlyStats.geminiTokens} tokens
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
