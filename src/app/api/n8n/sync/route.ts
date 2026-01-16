import { NextRequest, NextResponse } from 'next/server';

// n8n Webhook endpoint for triggering subscription sync and analysis
// Can be called on a schedule (every 30 days) via n8n

interface SyncPayload {
    action: 'sync_all' | 'detect_subscriptions' | 'check_anomalies' | 'full_analysis';
    account_ids?: string[]; // Optional: sync specific accounts only
    webhook_secret?: string;
}

interface SyncResult {
    action: string;
    timestamp: string;
    results: {
        accounts_synced?: number;
        transactions_fetched?: number;
        subscriptions_detected?: number;
        anomalies_found?: number;
        new_alerts?: number;
    };
}

export async function POST(request: NextRequest) {
    try {
        const payload: SyncPayload = await request.json();

        // Verify webhook secret if configured
        const expectedSecret = process.env.N8N_WEBHOOK_SECRET;
        if (expectedSecret && payload.webhook_secret !== expectedSecret) {
            return NextResponse.json(
                { error: 'Invalid webhook secret' },
                { status: 401 }
            );
        }

        // Validate action
        const validActions = ['sync_all', 'detect_subscriptions', 'check_anomalies', 'full_analysis'];
        if (!payload.action || !validActions.includes(payload.action)) {
            return NextResponse.json(
                { error: `Invalid action. Valid actions: ${validActions.join(', ')}` },
                { status: 400 }
            );
        }

        console.log(`[n8n Sync] Starting ${payload.action}...`);

        // Simulate sync results (in production, this would perform actual operations)
        const result: SyncResult = {
            action: payload.action,
            timestamp: new Date().toISOString(),
            results: {},
        };

        switch (payload.action) {
            case 'sync_all':
                // Would sync transactions from all connected accounts via Plaid
                result.results = {
                    accounts_synced: 6,
                    transactions_fetched: 150,
                };
                break;

            case 'detect_subscriptions':
                // Would run AI subscription detection on recent transactions
                result.results = {
                    subscriptions_detected: 15,
                };
                break;

            case 'check_anomalies':
                // Would compare new charges against historical patterns
                result.results = {
                    anomalies_found: 2,
                    new_alerts: 2,
                };
                break;

            case 'full_analysis':
                // Would run complete pipeline: sync -> detect -> check anomalies
                result.results = {
                    accounts_synced: 6,
                    transactions_fetched: 150,
                    subscriptions_detected: 15,
                    anomalies_found: 2,
                    new_alerts: 2,
                };
                break;
        }

        console.log(`[n8n Sync] Completed ${payload.action}:`, result.results);

        return NextResponse.json({
            success: true,
            ...result,
        });

    } catch (error) {
        console.error('[n8n Sync] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint for webhook documentation
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        endpoint: '/api/n8n/sync',
        description: 'n8n webhook endpoint for triggering subscription sync and analysis',
        methods: ['POST'],
        actions: {
            sync_all: 'Sync transactions from all connected accounts',
            detect_subscriptions: 'Run AI subscription detection',
            check_anomalies: 'Check for price changes and anomalies',
            full_analysis: 'Run complete pipeline (sync + detect + anomalies)',
        },
        payload_format: {
            action: 'sync_all | detect_subscriptions | check_anomalies | full_analysis',
            account_ids: 'optional array of account IDs to sync',
            webhook_secret: 'optional security token',
        },
        schedule_recommendation: 'Run full_analysis every 30 days via n8n cron trigger',
    });
}
