# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom animations (tw-animate-css)
- **UI Components**: Radix UI primitives with custom components in `components/ui/`
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: DeepSeek models via multiple providers (Fireworks AI, Nebius, SambaNova, NovitaAI, Hyperbolic, Together AI, Groq)
- **State Management**: React Query (TanStack Query) for server state
- **Code Editor**: Monaco Editor and CodeSandbox Sandpack

### Project Structure

#### Core Directories
- `app/` - Next.js App Router pages and API routes
  - `api/` - Backend API endpoints (ask-ai, auth, me, re-design)
  - `projects/` - Project management pages
  - `auth/` - Authentication flow pages
  - `(public)/` - Public-facing pages
- `components/` - React components organized by feature
  - `ui/` - Shared UI components using Radix UI
  - `editor/` - Code editor components
  - `contexts/` - React context providers
- `lib/` - Core utilities and configuration
  - `providers.ts` - AI model and provider configurations
  - `prompts.ts` - AI prompt templates
  - `mongodb.ts` - Database connection
  - `auth.ts` - Authentication utilities
- `models/` - Mongoose schemas (Project model)

### Key Features

#### AI Integration
The application uses Ollama for local AI model execution with dynamic model detection:
- Supports any Ollama-compatible model
- Automatically detects and lists available models via `/api/models`
- Configuration in `lib/providers.ts`
- Main AI interaction endpoint at `app/api/ask-ai/route.ts`
- Dynamic model selection with `useOllamaModels` hook

#### Authentication
Simplified authentication without external dependencies. Mock user data is provided for local development. No Hugging Face or external OAuth required.

#### Project Management
Projects are stored in MongoDB with space_id, user_id, and prompts. Project data model is defined in `models/Project.ts`.

### Path Aliases
- `@/*` maps to the root directory (configured in tsconfig.json)

### Environment Variables
The application uses environment variables for:
- `OLLAMA_API_URL` - Ollama API endpoint (default: http://localhost:11434)
- `MONGODB_URI` - MongoDB connection for project storage (optional)
- `MAX_REQUESTS_PER_IP` - Rate limiting configuration

See `.env.example` and `OLLAMA_SETUP.md` for detailed configuration.