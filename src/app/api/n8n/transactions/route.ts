import { NextRequest, NextResponse } from 'next/server';

// n8n Webhook endpoint for receiving transaction data
// This endpoint can be called by n8n to import transactions from various sources

interface TransactionPayload {
    source: 'plaid' | 'apple' | 'google' | 'paypal' | 'manual';
    account_id?: string;
    transactions: {
        id: string;
        merchant_name: string;
        amount: number;
        date: string;
        category?: string;
    }[];
    webhook_secret?: string;
}

export async function POST(request: NextRequest) {
    try {
        const payload: TransactionPayload = await request.json();

        // Verify webhook secret if configured
        const expectedSecret = process.env.N8N_WEBHOOK_SECRET;
        if (expectedSecret && payload.webhook_secret !== expectedSecret) {
            return NextResponse.json(
                { error: 'Invalid webhook secret' },
                { status: 401 }
            );
        }

        // Validate payload
        if (!payload.source || !payload.transactions || !Array.isArray(payload.transactions)) {
            return NextResponse.json(
                { error: 'Invalid payload. Required: source, transactions[]' },
                { status: 400 }
            );
        }

        // Process transactions
        // In production, this would save to Supabase and trigger subscription detection
        const processed = payload.transactions.map(tx => ({
            ...tx,
            source: payload.source,
            account_id: payload.account_id,
            processed_at: new Date().toISOString(),
        }));

        console.log(`[n8n Webhook] Received ${processed.length} transactions from ${payload.source}`);

        // Return success response with processed count
        return NextResponse.json({
            success: true,
            message: `Processed ${processed.length} transactions`,
            source: payload.source,
            count: processed.length,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('[n8n Webhook] Error processing request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint for webhook health check
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        endpoint: '/api/n8n/transactions',
        description: 'n8n webhook endpoint for importing transactions',
        methods: ['POST'],
        payload_format: {
            source: 'plaid | apple | google | paypal | manual',
            account_id: 'optional account identifier',
            transactions: [
                {
                    id: 'unique transaction id',
                    merchant_name: 'merchant name',
                    amount: 'number',
                    date: 'YYYY-MM-DD',
                    category: 'optional category',
                }
            ],
            webhook_secret: 'optional security token',
        },
    });
}
