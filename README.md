# SubTrack - Subscription Tracker 💳✨

A beautiful, AI-powered subscription tracker that consolidates recurring billing across all your credit cards and app stores.

![SubTrack Dashboard](docs/dashboard-preview.png)

## Features

### 📊 Dashboard
- **Total monthly spend** across all sources
- **Active subscription count** with yearly projection
- **Alert system** for price increases and unexpected charges
- **Category breakdown** with visual charts

### 💳 Multi-Source Support
- **Credit Cards**: American Express, Visa, Mastercard, Capital One (via Plaid)
- **App Stores**: Apple App Store, Google Play Store
- **Payment Services**: PayPal
- **Coming Soon**: Stripe, Venmo, Bank Accounts

### 🤖 AI-Powered Features (via Google Gemini)
- Automatic merchant name cleaning
- Smart categorization
- Subscription pattern detection
- Price anomaly detection
- Alternative service suggestions

### 🔗 n8n Integration
Ready-to-use webhook endpoints for automation:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/n8n/transactions` | POST | Import transactions from any source |
| `/api/n8n/sync` | POST | Trigger subscription sync and analysis |
| `/api/n8n/alerts` | POST | Get pending alerts and send notifications |

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Bank API**: Plaid
- **AI**: Google Gemini (free tier)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/royrubin05/transactionoptimizer.git
cd transactionoptimizer

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```env
# Plaid (https://plaid.com)
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox

# Supabase (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Google Gemini (https://makersuite.google.com)
GEMINI_API_KEY=your_key

# n8n Webhook Security (optional)
N8N_WEBHOOK_SECRET=your_secret
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main dashboard with overview stats |
| `/subscriptions` | Search, filter, and manage all subscriptions |
| `/accounts` | View and connect subscription sources |
| `/settings` | Configure notifications, n8n, and API keys |

## n8n Workflow Examples

### Daily Alert Check
```
Trigger: Schedule (daily at 9am)
→ HTTP Request: POST /api/n8n/alerts { action: "get_pending" }
→ IF: count > 0
→ Slack/Email: Send notification
```

### Monthly Sync
```
Trigger: Schedule (1st of month)
→ HTTP Request: POST /api/n8n/sync { action: "full_analysis" }
→ HTTP Request: POST /api/n8n/alerts { action: "send_summary" }
→ Email: Send monthly report
```

## Sample Data

The app comes with sample data for testing:
- 6 connected sources (4 credit cards + 2 app stores)
- 15 active subscriptions across categories
- 2 price change alerts

This allows you to explore the full UI before connecting real accounts.

## License

MIT

---

Built with 💜 by SubTrack
