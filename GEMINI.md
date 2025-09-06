# GEMINI.md

## Project Overview

This is a Next.js project called "Chat SDK," designed as a template for building powerful chatbot applications. It leverages the Vercel AI SDK to provide a unified interface for various AI models.

**Key Technologies:**

* **Framework:** Next.js with App Router, React Server Components (RSCs), and Server Actions.
* **AI:** Vercel AI SDK, supporting models from xAI, OpenAI, Fireworks, and others.
* **UI:** shadcn/ui with Tailwind CSS and Radix UI for accessible and flexible components.
* **Database:** Neon Serverless Postgres with Drizzle ORM for data persistence.
* **File Storage:** Vercel Blob.
* **Authentication:** Auth.js.
* **Testing:** Playwright for end-to-end testing.
* **Linting & Formatting:** Biome.

**Architecture:**

* The application is structured as a standard Next.js project.
* The `app` directory contains the main application logic, with separate layouts for chat and authentication.
* The `lib` directory holds shared libraries, including AI model definitions, database schema, and utility functions.
* The `components` directory contains reusable UI components.
* The `tests` directory contains Playwright end-to-end tests.

## Building and Running

This project uses `pnpm` as its package manager.

**Installation:**

```bash
pnpm install
```

**Running the Development Server:**

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

**Building for Production:**

```bash
pnpm build
```

**Running Tests:**

```bash
pnpm test
```

**Database Migrations:**

The project uses Drizzle ORM for database migrations.

* **Generate Migrations:** `pnpm db:generate`
* **Apply Migrations:** `pnpm db:migrate`

## Development Conventions

* **Coding Style:** The project uses Biome for linting and formatting. Run `pnpm lint` to check for issues and `pnpm format` to format the code.
* **Testing:** End-to-end tests are written with Playwright and are located in the `tests` directory.
* **Environment Variables:** Environment variables are managed using a `.env.local` file. An example is provided in `.env.example`.
* **Paths:** The project uses a path alias `@/*` to refer to the root directory.
