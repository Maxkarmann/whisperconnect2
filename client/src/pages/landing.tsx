import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Zap, Target, Shield, Clock, DollarSign } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Mic className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-semibold text-white">Dictate to Trello</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Voice-Powered Task Management
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Transform your spoken thoughts into organized Trello cards instantly. 
            Powered by OpenAI Whisper and Google Gemini AI for intelligent task processing.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
          >
            <Mic className="mr-2 h-5 w-5" />
            Start Dictating
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-white">Voice Recording</CardTitle>
              <CardDescription className="text-slate-300">
                High-quality audio recording with real-time feedback
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-white">AI Processing</CardTitle>
              <CardDescription className="text-slate-300">
                OpenAI Whisper transcription + Google Gemini AI task intelligence
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Trello Integration</CardTitle>
              <CardDescription className="text-slate-300">
                Automatic card creation in your Trello boards
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$0.006</div>
            <div className="text-sm text-slate-300">per minute of audio</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">25MB</div>
            <div className="text-sm text-slate-300">max file size</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">99+</div>
            <div className="text-sm text-slate-300">languages supported</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">Instant</div>
            <div className="text-sm text-slate-300">processing</div>
          </div>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
              <h4 className="font-semibold mb-2 text-white">Record</h4>
              <p className="text-slate-300 text-sm">Speak your tasks naturally</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
              <h4 className="font-semibold mb-2 text-white">Transcribe</h4>
              <p className="text-slate-300 text-sm">OpenAI Whisper converts speech to text</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
              <h4 className="font-semibold mb-2 text-white">Process</h4>
              <p className="text-slate-300 text-sm">Google Gemini AI organizes into actionable tasks</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">4</div>
              <h4 className="font-semibold mb-2 text-white">Deliver</h4>
              <p className="text-slate-300 text-sm">Tasks appear in your Trello board</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-12">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Task Management?</h3>
          <p className="text-slate-300 mb-8">Join thousands of users who've streamlined their workflow with voice-powered task creation.</p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
          >
            Get Started Now
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mic className="h-5 w-5 text-primary" />
              <span className="text-slate-300 text-sm">Powered by OpenAI Whisper & Google Gemini AI</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
