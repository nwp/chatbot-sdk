# GitHub Copilot Instructions

## Project Overview

This is a Next.js 15 AI chatbot SDK using the Vercel AI Gateway with xAI Grok models. The architecture centers around real-time chat with AI artifact generation (documents, code, images, sheets) and collaborative editing features.

## Key Architecture Patterns

### AI Provider Strategy

- **Production**: Routes through Vercel AI Gateway to xAI models (`grok-2-vision-1212`, `grok-3-mini-beta`)
- **Testing**: Uses mock providers from `lib/ai/models.test.ts`
- **Pattern**: All models accessed via `myProvider` from `lib/ai/providers.ts`
- **Reasoning Model**: Grok model wrapped with `extractReasoningMiddleware` for chain-of-thought

### Database Schema Evolution

- **Current**: Use `Message_v2` and `Vote_v2` tables for new features
- **Deprecated**: `Message` and `Vote` tables exist for migration compatibility
- **Pattern**: Drizzle ORM with PostgreSQL, migrations in `lib/db/migrations/`

### Component Architecture

- **App Router**: Route groups `(auth)/` and `(chat)/` with parallel layouts
- **Chat State**: `useChat` hook manages conversation, `DataStreamHandler` processes real-time updates
- **Artifacts**: Separate system for AI-generated content with real-time collaboration
- **UI**: shadcn/ui components with custom extensions in `components/ui/` and `components/elements/`

## Development Workflow

### Essential Commands

```bash
pnpm dev                # Start with Turbo (faster builds)
pnpm build:db          # Build with DB migrations first
pnpm db:studio         # Visual DB inspection
pnpm test              # Playwright E2E tests
pnpm lint:fix          # Biome auto-fix
```

### Testing Strategy

- **E2E Tests**: Playwright in `tests/` directory with `e2e` and `routes` projects
- **Test Environment**: Set `PLAYWRIGHT=True` env var to use mock AI providers
- **Pattern**: Tests run against local dev server, fixtures in `tests/fixtures.ts`

### Code Quality

- **Linter**: Biome (not ESLint) - see `biome.jsonc` for custom rules
- **Formatting**: 2-space indent, single quotes, trailing commas
- **Imports**: Manual organization preferred (auto-organize disabled)
- **TypeScript**: Strict mode with path aliases `@/*`

## Critical Integration Points

### AI Chat Flow

1. User input → `app/(chat)/api/chat/route.ts`
2. Authentication check → `auth()` from NextAuth.js v5
3. Model selection → `myProvider.languageModel(modelId)`
4. Tools available: `createDocument`, `updateDocument`, `requestSuggestions`, `getWeather`
5. Response streaming → `createUIMessageStream` with smooth streaming

### Artifact System

- **Creation**: AI tools call `createDocument` with type (`text`, `code`, `image`, `sheet`)
- **Storage**: Documents saved to DB with suggestions for collaborative editing
- **UI**: Real-time preview in right panel via `components/artifact.tsx`
- **State**: Managed by `useArtifactSelector` hook

### Authentication & Security

- **Auth**: NextAuth.js v5 with session-based auth (`app/(auth)/auth.ts`)
- **Guest Mode**: Redirect to `/api/auth/guest` for unauthenticated users
- **Entitlements**: User type-based limits in `lib/ai/entitlements.ts`

## File Organization Patterns

### Route Handlers

- Server actions in `actions.ts` files alongside route groups
- API routes follow `/api/[feature]/route.ts` pattern
- Use `'use server'` directive for server-side functions

### Component Structure

- **Main components**: `components/` (chat, messages, artifacts)
- **UI primitives**: `components/ui/` (shadcn/ui)
- **Chat elements**: `components/elements/` (specialized chat UI)
- **Hooks**: Custom React hooks in `hooks/`

### Database Queries

- **Pattern**: Centralized in `lib/db/queries.ts`
- **Migrations**: Use `drizzle-kit generate` then run `lib/db/migrate.ts`
- **Schema**: Defined in `lib/db/schema.ts` with TypeScript inference

## Environment & Deployment

### Required Environment Variables

- `AUTH_SECRET` - NextAuth.js session encryption
- `AI_GATEWAY_API_KEY` - For non-Vercel deployments
- `POSTGRES_URL` - Database connection
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob for file uploads
- `REDIS_URL` - Caching (optional)

### Production Considerations

- **Vercel Deployment**: AI Gateway auth via OIDC (no API key needed)
- **Database**: Neon Serverless Postgres recommended
- **File Storage**: Vercel Blob for chat attachments
- **Monitoring**: Built-in error handling via `ChatSDKError` class

When working on this codebase, always check the current migration status for database changes and ensure AI provider configurations match the deployment environment.
