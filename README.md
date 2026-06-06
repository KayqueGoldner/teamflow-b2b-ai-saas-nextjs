<p align="center">
  <h1 align="center">💬 Teamflow</h1>
  <p align="center">A production-ready B2B AI-powered Slack-like SaaS platform built on Next.js 15, React 19, and TypeScript, featuring secure AI-assisted message composition and thread summarization.</p>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7.1.0-2D3748?style=flat-square&logo=prisma" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
</p>

---

## 📖 Overview

**Teamflow** is a B2B AI-powered collaboration and messaging platform designed for team communication. It provides rich text messaging, channels, threaded replies, emoji reactions, and image sharing, all isolated securely at the organization level. 

The application features advanced AI enhancements including an **AI message editor** to refine/rewrite message drafts and an **AI thread summarizer** to quickly catch up on team discussions. Security is front and center, leveraging **Arcjet**'s Shield, rate-limiting, and AI-specific PII/sensitive info detection rules to prevent data leaks. Authentication is powered by **Kinde Auth**, data management is handled using **Prisma ORM** over **PostgreSQL** (Neon), and file uploads are facilitated through **UploadThing**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📂 **Workspaces & Channels** | Create and manage custom workspaces and channels to segment team collaboration |
| 💬 **Rich Threaded Messaging** | Send messages, reply to threads, and edit your posts with a complete rich-text Tiptap editor |
| 😀 **Message Reactions** | Toggle emoji reactions on any message using a custom, optimized emoji picker component |
| 🖼️ **Image Attachments** | Secure drag-and-drop file/image uploads directly within chats, powered by UploadThing |
| 🤖 **AI Compose Assistant** | Improve message clarity, structure, and grammar on-the-fly using OpenRouter LLMs |
| 📝 **AI Thread Summarizer** | Condense complex chat threads into bulleted takeaways and a concise executive summary |
| 🛡️ **PII Guardrails** | Arcjet-powered AI middleware filters credit cards, phone numbers, and sensitive details from AI prompts |
| 🔐 **B2B Multi-Tenancy** | Kinde-powered user authentication with automatic redirection and isolation by organization code |
| ⚡ **Type-Safe RPC API** | End-to-end type safety using oRPC and TanStack Query integration |
| 🌙 **Theme Modes** | Built-in light and dark modes powered by `next-themes` and Tailwind CSS 4 |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                 Next.js 15 App                  │
│  ┌────────────┐  ┌─────────┐  ┌─────────────┐  │
│  │ Workspace  │  │ Channel │  │ Thread View │  │
│  │ Sidebar    │  │ chat    │  │ & Reactions │  │
│  └────────────┘  └─────────┘  └─────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │               oRPC API Layer             │   │
│  │  workspace | channel | message | ai      │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
      ┌───────────┼────────────────────┐
      │           │                    │
      ▼           ▼                    ▼
┌─────────┐  ┌──────────┐       ┌──────────────┐
│PostgreSQL│  │  Arcjet  │       │  OpenRouter  │
│ (Prisma) │  │ Security │       │    AI SDK    │
│Channels, │  │ Shield,  │       │ (GPT-OSS-20B)│
│Messages  │  │ RateLimit│       │  Compositions│
└─────────┘  └──────────┘       └──────────────┘
      │                                │
      └─── Kinde Auth ─────────────────┼─ UploadThing
```

### Key Architectural Decisions

- **oRPC (Object RPC)** — Serves as the primary communication protocol between the client and server instead of traditional REST or tRPC, ensuring fully typed procedures defined in app/router/index.ts.
- **Tenant Isolation** — Enforced by Kinde Auth's organizational context (`org_code`). Custom Next.js middleware and API middleware automatically validate and scope database queries to the active organization.
- **AI Security Guardrails** — Every AI-related API call is intercepted by `aiSecurityMiddleware` using **Arcjet** to ensure that users do not accidentally transmit credit cards, phone numbers, or trigger rate limits.
- **Next.js 15 App Router & React 19** — Harnesses the latest features including Server Components, client-side routing synchronization, and modern React APIs.

---

## 🗂️ Project Structure

```
teamflow-b2b-ai-saas-nextjs/
├── app/                        # Next.js App Router root
│   ├── (dashboard)/            # Authenticated workspace views
│   │   └── workspace/
│   │       ├── [workspaceId]/  # Target workspace and channel paths
│   │       └── layout.tsx
│   ├── (marketing)/            # Public landing and marketing pages
│   ├── api/                    # REST routes (e.g. UploadThing handlers)
│   ├── middlewares/            # Custom API verification steps
│   │   ├── arcjet/             # Security middlewares (Shield, rate limits)
│   │   ├── auth.ts             # Authentication validation
│   │   └── workspace.ts        # Tenant verification
│   ├── router/                 # oRPC Router definition
│   │   ├── ai.ts               # AI prompt generation procedures
│   │   ├── channel.ts          # Channel retrieval & CRUD
│   │   ├── member.ts           # Org member list & invite options
│   │   ├── message.ts          # Messaging and reaction handlers
│   │   └── workspace.ts        # Workspace collection CRUD
│   └── rpc/                    # oRPC HTTP adapter route handler
├── components/                 # Shared React Components
│   ├── ui/                     # Component primitives (shadcn/ui & custom)
│   ├── ai-elements/            # Interactive AI compose/summary components
│   └── rich-text-editor/       # Tiptap text formatting workspace
├── hooks/                      # Global React hooks
├── lib/                        # Core utilities and singletons
│   ├── generated/prisma/       # Generated Prisma Client output
│   ├── arcjet.ts               # Arcjet Next.js client initialization
│   ├── db.ts                   # Prisma client singleton instance
│   ├── orpc.ts                 # Frontend oRPC query client utilities
│   ├── orpc.server.ts          # Backend oRPC server caller
│   └── uploadthing.ts          # Uploadthing interface config
├── prisma/
│   ├── schema.prisma           # Prisma database schema models
│   └── migrations/             # SQL migration history
├── providers/                  # Application wrappers and contexts
├── middleware.ts               # Kinde & Arcjet route middleware
├── next.config.ts              # Next.js server configuration
└── components.json             # shadcn/ui framework layout details
```

---

## 🗄️ Database Schema

Managed with **Prisma ORM** over PostgreSQL.

### `Channel`

| Column | Type | Description |
|---|---|---|
| `id` | `String` (UUID) | Primary Key |
| `name` | `String` | Channel display name |
| `createdAt` | `DateTime` | Creation timestamp |
| `updatedAt` | `DateTime` | Last update timestamp |
| `workspaceId` | `String` | Associated Kinde organization code |
| `createdById` | `String` | Author Kinde user ID |

*Unique Index:* `[workspaceId, name]` ensures channel names are unique within a single workspace.

### `Message`

| Column | Type | Description |
|---|---|---|
| `id` | `String` (UUID) | Primary Key |
| `content` | `String` | Tiptap JSON content structure |
| `imageUrl` | `String?` | Optional attached image URL (UploadThing) |
| `createdAt` | `DateTime` | Creation timestamp |
| `updatedAt` | `DateTime` | Last update timestamp |
| `authorId` | `String` | Sender Kinde user ID |
| `authorEmail` | `String` | Sender email address |
| `authorName` | `String` | Sender display name |
| `authorAvatar` | `String` | URL to sender's avatar |
| `channelId` | `String?` | FK referencing the parent `Channel` |
| `threadId` | `String?` | FK referencing the parent `Message` (for replies) |

### `MessageReaction`

| Column | Type | Description |
|---|---|---|
| `id` | `String` (UUID) | Primary Key |
| `emoji` | `String` | Emoji character/string value |
| `createdAt` | `DateTime` | Creation timestamp |
| `updatedAt` | `DateTime` | Last update timestamp |
| `userId` | `String` | Reacting user ID |
| `userEmail` | `String` | Reacting user email |
| `userName` | `String` | Reacting user name |
| `userAvatar` | `String` | Reacting user avatar URL |
| `messageId` | `String` | FK referencing target `Message` |

*Unique Index:* `[messageId, userId, emoji]` guarantees a user reacts with the same emoji only once per message.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root by copying standard values:

```env
# ─── Database ───────────────────────────────────────────
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require"

# ─── Kinde (Authentication & Management) ────────────────
KINDE_CLIENT_ID="<your-kinde-client-id>"
KINDE_CLIENT_SECRET="<your-kinde-client-secret>"
KINDE_ISSUER_URL="https://<your-kinde-subdomain>.kinde.com"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/workspace"
KINDE_DOMAIN="https://<your-kinde-subdomain>.kinde.com"
KINDE_MANAGEMENT_CLIENT_ID="<your-kinde-mgt-client-id>"
KINDE_MANAGEMENT_CLIENT_SECRET="<your-kinde-mgt-client-secret>"

# ─── Arcjet (Security & Shield) ─────────────────────────
ARCJET_KEY="ajkey_..."

# ─── UploadThing (File Attachments) ────────────────────
UPLOADTHING_TOKEN="eyJ..."

# ─── OpenRouter (AI SDK Provider) ──────────────────────
OPENROUTER_API_KEY="sk-or-v1-..."
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** (preferred) or **npm**
- **PostgreSQL** instance (Neon, Supabase, or Local)
- **Kinde** developer account
- **Arcjet** account
- **UploadThing** account
- **OpenRouter** API key

### 1. Clone & Install

```bash
git clone https://github.com/KayqueGoldner/teamflow-b2b-ai-saas-nextjs.git
cd teamflow-b2b-ai-saas-nextjs
pnpm install
```

### 2. Configure Environment

Create your local `.env` and fill in the values:
```bash
cp .env.example .env # or construct .env with the schema above
```

### 3. Initialize the Database

Apply Prisma migrations to configure your database tables:
```bash
npx prisma migrate dev
```

### 4. Start Development Server

Run the development server with Turbopack acceleration:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🤖 AI Integrations

The platform incorporates the **Vercel AI SDK** with **OpenRouter** as the provider, executing queries against the `openai/gpt-oss-20b:free` model.

### 1. Compose AI Assistant (`ai.compose.generate`)
Rewrites input text to clarify syntax, fix typography, and refine structure while keeping links, markdown blocks, code structures, and user tags untouched.

### 2. Thread Summarizer (`ai.thread.summary.generate`)
Crawls the thread starting from the parent message through all chronologically sorted replies. It evaluates the thread and outputs a concise paragraph summary accompanied by exactly 2-3 key takeaways.

---

## 🛡️ Security & Guardrails

The application utilizes **Arcjet** within middleware.ts and within specialized RPC endpoint filters:
- **Bot Detection:** Categorizes incoming client requests and denies scraper/bad bots while keeping search engines, webhooks, and previews accessible.
- **Shield:** Scans payloads to block standard exploit vectors (SQL injection, XSS, etc.).
- **AI Guardrail (`aiSecurityMiddleware`):** Restricts the AI APIs with:
  - **Rate Limiting:** A sliding window allowing a maximum of 3 AI requests per 1 minute.
  - **PII / Sensitive Info Filtering:** Intercepts input data to deny request processing if a credit card number or a telephone number is detected.

---

## 📡 API Reference (oRPC Endpoints)

Endpoints are built on oRPC and handled through the `/rpc` route.

### `workspace`
- **`workspace.list` (`GET`)** — Returns the list of workspaces available to the authenticated user.
- **`workspace.create` (`POST`)** — Creates a new workspace.
- **`workspace.member.list` (`GET`)** — Fetches members inside the current workspace.
- **`workspace.member.invite` (`POST`)** — Invites a new member to the workspace via Kinde management actions.

### `channel`
- **`channel.create` (`POST`)** — Creates a channel in the active workspace.
- **`channel.list` (`GET`)** — Lists all channels inside the workspace.
- **`channel.get` (`GET`)** — Obtains specific details of a single channel.

### `message`
- **`message.create` (`POST`)** — Creates a new message (optionally attached to a thread parent).
- **`message.list` (`GET`)** — Retrieves a paginated list of messages for a channel.
- **`message.update` (`PUT`)** — Edits an existing message if the user is the original author.
- **`message.thread.list` (`GET`)** — Retrieves a parent message and all chronological thread replies.
- **`message.reaction.toggle` (`POST`)** — Toggles (inserts/removes) a reaction emoji on a message.

### `ai`
- **`ai.compose.generate` (`POST`)** — Triggers the OpenRouter assistant to rewrite drafting text.
- **`ai.thread.summary.generate` (`POST`)** — Returns a streaming event summary of a given message thread.

---

## 🧰 Tech Stack

### Core Frontend
- **Framework:** Next.js 15.5.4 (using App Router)
- **UI Engine:** React 19.1.0 & React DOM 19.1.0
- **Styling:** Tailwind CSS 4 & PostCSS
- **Rich Text Editor:** Tiptap Editor (`@tiptap/react`, extensions, static-renderer)
- **State Management / Data Fetching:** TanStack React Query v5 & oRPC Client
- **Animations:** Motion (Framer Motion) & `tw-animate-css`
- **Utility Libraries:** `lucide-react` (icons), `cmdk` (dialog search), `recharts` (charts), `sonner` (toast alerts)

### Backend & Infrastructure
- **API Protocol:** oRPC Server (`@orpc/server`, `@orpc/tanstack-query`)
- **Database Access:** Prisma 7.1.0 & PostgreSQL Client (Neon DB adapter)
- **Authentication:** Kinde Auth (`@kinde-oss/kinde-auth-nextjs`, `@kinde/management-api-js`)
- **Security:** Arcjet SDK (`@arcjet/next`)
- **File Storage:** UploadThing React SDK
- **AI Pipeline:** Vercel AI SDK (`ai`), `@ai-sdk/react`, and `@openrouter/ai-sdk-provider`
- **Schema Validation:** Zod v4

---

## 🤝 Contributing

1. Fork the project repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your modifications (`git commit -m 'feat: implement amazing feature'`).
4. Push your changes (`git push origin feature/amazing-feature`).
5. Submit a Pull Request for review.
