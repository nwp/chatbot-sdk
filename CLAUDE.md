# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start the development server with Turbo
- `pnpm build` - Build the application (runs DB migrations first)
- `pnpm start` - Start the production server
- `pnpm lint` - Run Next.js ESLint and Biome linting
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Format code with Biome
- `pnpm test` - Run Playwright end-to-end tests

## Database Commands

- `pnpm db:generate` - Generate database migrations with Drizzle Kit
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio for database inspection
- `pnpm db:push` - Push schema changes directly to database
- `pnpm db:pull` - Pull schema from database
- `pnpm db:check` - Check migration consistency
- `pnpm db:up` - Apply migrations

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router and React Server Components
- **AI**: Vercel AI SDK with xAI Grok models (via AI Gateway)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Auth.js (NextAuth.js v5)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Testing**: Playwright for E2E tests
- **Code Quality**: Biome for linting and formatting

### Directory Structure

- `app/` - Next.js App Router pages and API routes
  - `(auth)/` - Authentication-related pages and logic
  - `(chat)/` - Chat interface and functionality
- `components/` - Reusable React components
  - `ui/` - shadcn/ui components
  - `elements/` - Custom UI elements
- `lib/` - Shared utilities and configurations
  - `ai/` - AI provider setup and tools
  - `db/` - Database schema and queries
- `hooks/` - Custom React hooks
- `artifacts/` - AI-generated artifacts system
- `tests/` - Playwright test suites

### Database Schema

The database uses Drizzle ORM with PostgreSQL:

- `User` - User accounts with email/password
- `Chat` - Chat sessions with title and visibility
- `Message_v2` - Chat messages with parts and attachments (latest schema)
- `Vote_v2` - Message voting system
- `Document` - AI-generated documents (text, code, image, sheet)
- `Suggestion` - Document editing suggestions
- `Stream` - Chat streaming sessions

**Migration Note**: The schema includes deprecated `Message` and `Vote` tables. New development should use `Message_v2` and `Vote_v2`.

### AI Integration

- Uses Vercel AI Gateway for model access
- Default models: Grok Vision and Grok Reasoning (xAI)
- Custom AI tools for document creation, weather, and suggestions
- Structured generation for artifacts and documents

### Key Features

- Real-time chat with AI models
- Document generation and editing (artifacts system)
- File uploads via Vercel Blob
- Public/private chat visibility
- Message voting and feedback
- Collaborative document suggestions

### Environment Setup

Required environment variables (see `.env.example`):

- `AUTH_SECRET` - Authentication secret key
- `AI_GATEWAY_API_KEY` - AI Gateway API key (for non-Vercel deployments)
- `POSTGRES_URL` - PostgreSQL database connection
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `REDIS_URL` - Redis connection for caching

### Testing

- Playwright E2E tests in `tests/` directory
- Two test projects: `e2e` and `routes`
- Tests run against local development server
- Test command: `pnpm test`

### Code Standards

- Uses Biome for linting and formatting (see `biome.jsonc`)
- TypeScript with strict configuration
- 2-space indentation, single quotes, trailing commas
- Import path aliasing with `@/*` for root-level imports
- Disabled auto-import organizing in favor of manual control
