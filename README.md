# AI Voice-Powered Inventory Management System

An intelligent SaaS platform that combines AI voice interactions with inventory management, built with Next.js and SST (Serverless Stack).

## 🌟 Features

### Voice & Text Interaction

- Natural language processing for both voice and text inputs
- Intelligent context understanding and action determination
- Seamless switching between voice and text interfaces

### Inventory Management

- Real-time stock tracking and updates
- Automated low-stock alerts
- Provider management with contact information
- Product tracking with detailed information

### Smart Notifications

- Automated provider calls using Twilio integration
- Stock level monitoring and alerts
- Intelligent reordering system based on sales velocity
- Admin notifications for critical stock updates

### Team Management

- Role-based access control
  - Admin: Full stock management and provider coordination
  - Team Members: Sales and invoice generation
- Automated workflow management

## 🛠 Tech Stack

- **Frontend**: Next.js 15
- **Langchain** : LLM framework for building AI applications
- **Infrastructure**: SST (Serverless Stack)
- **AI Integration**: OpenAI API
- **Voice/SMS**: Twilio
- **Database**: Supabase
- **Authentication**: Supabase Auth

## 📋 Prerequisites

- Node.js 18.x or higher
- AWS Account
- Twilio Account
- OpenAI API Key

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
cd [project-name]
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure the following environment variables:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=
DATABASE_URL=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

TWILIO_PHONE_NUMBER=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=


UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

AWS_SST_ENDPOINT=
```

5. Run the development server:

```bash
npm run dev
```

## 🏗 Project Structure

├── app/ # Next.js app directory
│ ├── (private)/ # Protected routes requiring authentication
│ │ ├── dashboard/ # Analytics and overview
│ │ ├── products/ # Product management
│ │ ├── providers/ # Provider management
│ │ ├── invoice/ # Invoice generation
│ │ └── team/ # Team settings and profile
│ └── layout.tsx # Root layout with providers
│
├── components/ # Reusable components
│ ├── (private)/ # Components for authenticated routes
│ │ └── dashboard/ # Dashboard-specific components
│ ├── shared/ # Shared components (Navbar, ThemeToggle, etc.)
│ └── ui/ # UI components (Button, Card, Input, etc.)
│
├── services/ # Business logic and API calls
│ ├── database/ # Database operations
│ ├── llm-calls/ # AI/LLM integration
│ └── server-only/ # Server-side utilities
│
├── lib/ # Utility functions
│ └── utils.ts # Common utilities
│
├── hooks/ # Custom React hooks
│ └── use-toast.ts # Toast notification hook
│
├── providers/ # React context providers
│ └── query-provider.tsx # React Query provider

### Key Directories Explained:

#### `app/`

- Modern Next.js App Router structure
- `(private)/`: Routes protected by authentication
- Organized by feature (products, providers, invoice)

#### `components/`

- `(private)/`: Components specific to authenticated sections
- `shared/`: Common components used across the application
- `ui/`: Base UI components built with Radix UI and Tailwind

#### `services/`

- Separation of concerns for business logic
- `database/`: Database operations and queries
- `llm-calls/`: AI integration with OpenAI
- `server-only/`: Server-side utilities and middleware

#### `lib/`

- Utility functions and helpers
- Common tools used throughout the application

#### `hooks/`

- Custom React hooks for shared functionality
- State management and UI interactions

#### `providers/`

- React context providers
- Global state management setup

### Stock Management

1. Admin can add new products via voice/text
2. System captures provider information on first interaction
3. Stock levels are monitored automatically

### Automated Notifications

1. System monitors stock levels continuously
2. Triggers alerts based on predefined thresholds
3. Automatically contacts providers for restocking
4. Notifies admin of provider responses
