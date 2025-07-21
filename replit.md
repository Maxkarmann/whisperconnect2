# Dictate to Trello Web Application

## Overview

This is a full-stack web application called "Dictate to Trello" that enables users to record voice notes, have them transcribed and intelligently processed by AI, and automatically converted into Trello cards sent via email. The application uses modern web technologies with a React frontend and Express.js backend, featuring real-time audio processing and AI-powered task extraction.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Dark theme with grey and blueish tones (updated 2025-01-16).

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OpenID Connect (OIDC) authentication
- **Session Management**: Express sessions with PostgreSQL session store
- **File Processing**: Multer for handling audio file uploads

## Key Components

### Authentication System
- Uses Replit's OIDC authentication for secure user login
- Session-based authentication with PostgreSQL session storage
- User profile management with automatic user creation/updates

### Audio Processing Pipeline
1. **Audio Capture**: Browser MediaDevices API for microphone access
2. **Audio Upload**: Multer middleware handles file uploads (25MB limit)
3. **Transcription**: OpenAI Whisper API converts audio to text
4. **AI Processing**: Claude AI analyzes transcription and extracts actionable tasks
5. **Task Delivery**: Email integration sends formatted tasks to Trello

### Database Schema
- **Users**: Profile information from OIDC provider
- **Tasks**: Stores transcription, processed tasks, and metadata
- **API Usage**: Tracks costs and usage statistics
- **Sessions**: Manages user authentication sessions

### AI Integration
- **OpenAI Whisper**: Speech-to-text transcription service
- **Anthropic Claude**: Task analysis and extraction (using claude-sonnet-4-20250514)
- **Smart Processing**: Converts natural speech into structured, actionable Trello cards

## Data Flow

1. **User Authentication**: User logs in via Replit OIDC
2. **Audio Recording**: Frontend captures microphone input
3. **Audio Upload**: File sent to backend via multipart form data
4. **Transcription**: OpenAI Whisper processes audio to text
5. **Task Processing**: Claude AI analyzes transcription and extracts tasks
6. **Task Storage**: Processed tasks saved to PostgreSQL database
7. **Email Delivery**: Tasks sent to Trello via email integration
8. **Usage Tracking**: API costs and usage statistics recorded

## External Dependencies

### Core Services
- **OpenAI API**: Whisper model for speech transcription
- **Anthropic API**: Claude AI for intelligent task processing
- **Neon Database**: PostgreSQL hosting for data persistence
- **Replit Authentication**: OIDC-based user authentication

### Development Tools
- **Vite**: Frontend build tool and development server
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Backend bundling for production builds

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Icon library for UI elements

## Deployment Strategy

### Development Environment
- **Frontend**: Vite development server with hot module replacement
- **Backend**: TSX for TypeScript execution with auto-restart
- **Database**: Drizzle push for schema synchronization

### Production Build
- **Frontend**: Static assets built with Vite and served from `/dist/public`
- **Backend**: Bundled with ESBuild for Node.js execution
- **Database**: Migrations handled via Drizzle Kit

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Authentication**: Replit OIDC configuration
- **AI Services**: API keys for OpenAI and Anthropic
- **Sessions**: Secret key for session encryption

The application is designed to be deployed on Replit with easy configuration through environment variables and automatic database provisioning.