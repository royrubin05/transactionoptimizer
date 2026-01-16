import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface TransactionForAI {
    merchant_name: string;
    amount: number;
    date: string;
    category?: string[];
}

export interface SubscriptionAnalysis {
    name: string;
    normalizedName: string;
    category: string;
    billingCycle: 'monthly' | 'yearly' | 'weekly';
    typicalAmount: number;
    confidence: number;
}

export interface PriceAnomaly {
    type: 'price_increase' | 'price_decrease' | 'unexpected';
    message: string;
    percentChange?: number;
}

export interface PricingSuggestion {
    currentService: string;
    currentPrice: number;
    alternatives: {
        name: string;
        price: number;
        features: string[];
        savings: number;
    }[];
}

// Categorize a merchant and clean up its name
export async function categorizeTransaction(merchantName: string, amount: number): Promise<{ cleanName: string; category: string }> {
    const prompt = `Given this merchant name from a credit card transaction: "${merchantName}" with amount $${amount}
  
Please provide:
1. A clean, human-readable name for this merchant (e.g., "NETFLIX.COM" should become "Netflix", "AMZN MKTP US" should become "Amazon")
2. A category from this list: Streaming, Software, Fitness, Food Delivery, Cloud Storage, Gaming, News/Media, Music, Productivity, Shopping, Transportation, Utilities, Insurance, Healthcare, Education, Entertainment, Other

Respond in JSON format only:
{
  "cleanName": "...",
  "category": "..."
}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.error('AI categorization error:', error);
    }

    return { cleanName: merchantName, category: 'Other' };
}

// Analyze transactions to detect recurring subscriptions
export async function detectSubscriptions(transactions: TransactionForAI[]): Promise<SubscriptionAnalysis[]> {
    const groupedByMerchant = groupTransactionsByMerchant(transactions);
    const subscriptions: SubscriptionAnalysis[] = [];

    for (const [merchant, txns] of Object.entries(groupedByMerchant)) {
        if (txns.length < 2) continue;

        const analysis = analyzeRecurrence(merchant, txns);
        if (analysis) {
            subscriptions.push(analysis);
        }
    }

    return subscriptions;
}

// Group transactions by similar merchant names
function groupTransactionsByMerchant(transactions: TransactionForAI[]): Record<string, TransactionForAI[]> {
    const groups: Record<string, TransactionForAI[]> = {};

    for (const tx of transactions) {
        const key = tx.merchant_name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'unknown';
        if (!groups[key]) groups[key] = [];
        groups[key].push(tx);
    }

    return groups;
}

// Analyze if transactions represent a subscription
function analyzeRecurrence(merchant: string, transactions: TransactionForAI[]): SubscriptionAnalysis | null {
    const sorted = transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const intervals: number[] = [];

    for (let i = 1; i < sorted.length; i++) {
        const days = (new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / (1000 * 60 * 60 * 24);
        intervals.push(days);
    }

    if (intervals.length === 0) return null;

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const avgAmount = transactions.reduce((a, b) => a + b.amount, 0) / transactions.length;

    let billingCycle: 'monthly' | 'yearly' | 'weekly';
    let confidence = 0;

    if (avgInterval >= 25 && avgInterval <= 35) {
        billingCycle = 'monthly';
        confidence = 0.9;
    } else if (avgInterval >= 6 && avgInterval <= 8) {
        billingCycle = 'weekly';
        confidence = 0.85;
    } else if (avgInterval >= 350 && avgInterval <= 380) {
        billingCycle = 'yearly';
        confidence = 0.95;
    } else {
        return null; // Not a clear subscription pattern
    }

    // Check amount consistency
    const amountVariance = transactions.reduce((acc, tx) => acc + Math.abs(tx.amount - avgAmount), 0) / transactions.length;
    if (amountVariance / avgAmount > 0.1) {
        confidence *= 0.8; // Lower confidence if amounts vary significantly
    }

    return {
        name: transactions[0].merchant_name,
        normalizedName: merchant,
        category: 'Other',
        billingCycle,
        typicalAmount: Math.round(avgAmount * 100) / 100,
        confidence,
    };
}

// Detect price anomalies
export async function detectAnomaly(
    subscriptionName: string,
    typicalAmount: number,
    newAmount: number
): Promise<PriceAnomaly | null> {
    const percentChange = ((newAmount - typicalAmount) / typicalAmount) * 100;

    if (Math.abs(percentChange) < 5) return null; // Ignore small changes

    if (percentChange > 0) {
        return {
            type: 'price_increase',
            message: `${subscriptionName} increased from $${typicalAmount.toFixed(2)} to $${newAmount.toFixed(2)} (+${percentChange.toFixed(1)}%)`,
            percentChange,
        };
    } else {
        return {
            type: 'price_decrease',
            message: `${subscriptionName} decreased from $${typicalAmount.toFixed(2)} to $${newAmount.toFixed(2)} (${percentChange.toFixed(1)}%)`,
            percentChange,
        };
    }
}

// Get AI-powered pricing suggestions
export async function suggestAlternatives(serviceName: string, currentPrice: number, category: string): Promise<PricingSuggestion> {
    const prompt = `I'm paying $${currentPrice}/month for ${serviceName} (category: ${category}).

Suggest up to 3 alternative services that might be cheaper or offer better value. For each alternative, provide:
- Name of the service
- Approximate monthly price
- Key features
- Estimated monthly savings compared to my current service

Respond in JSON format only:
{
  "alternatives": [
    {
      "name": "...",
      "price": 0.00,
      "features": ["...", "..."],
      "savings": 0.00
    }
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                currentService: serviceName,
                currentPrice,
                alternatives: parsed.alternatives || [],
            };
        }
    } catch (error) {
        console.error('AI suggestion error:', error);
    }

    return {
        currentService: serviceName,
        currentPrice,
        alternatives: [],
    };
}
