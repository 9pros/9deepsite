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
- **AI Integration**: Multiple AI models via Ollama (local/cloud) and Llama API providers
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
The application supports multiple AI providers with dynamic model detection:
- **Ollama**: Local and cloud-based models (including DeepSeek V3.1, GPT-OSS, local models)
- **Meta Llama API**: Official Meta Llama models via https://api.llama.com/v1/
  - Latest Llama 4 models (Maverick 17B, Scout 8B)
  - Llama 3.1 series (405B, 70B, 8B)
  - Llama 3.2 series (90B, 11B, 3B, 1B)
- Automatically detects and lists available models via `/api/models`
- Configuration in `lib/providers.ts`
- Main AI interaction endpoint at `app/api/ask-ai/route.ts`
- Dynamic model selection with `useOllamaModels` hook
- Special handling for "thinker" models (DeepSeek V3, R1, Llama 4 Maverick)

#### Authentication
Simplified authentication without external dependencies. Mock user data is provided for local development. No Hugging Face or external OAuth required.

#### Project Management
Projects are stored in MongoDB with comprehensive deployment tracking:
- Supports both Hugging Face Spaces and Cloudflare Pages deployments
- Cloudflare deployments use wildcard *.9gent.com subdomains
- Project data model is defined in `models/Project.ts`

### Path Aliases
- `@/*` maps to the root directory (configured in tsconfig.json)

### Environment Variables
The application uses environment variables for:
- `OLLAMA_API_URL` - Ollama API endpoint (default: http://localhost:11434)
- `OLLAMA_API_KEY` - Optional API key for Ollama Turbo cloud service
- `LLAMA_API_URL` - Llama API endpoint for Llama models
- `LLAMA_API_KEY` - API key for Llama API service
- `MONGODB_URI` - MongoDB connection for project storage (optional)
- `MAX_REQUESTS_PER_IP` - Rate limiting configuration (default: 100)
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID for Pages deployment
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages permissions

See `.env.example` for detailed configuration.