import { NextRequest, NextResponse } from 'next/server';

// n8n Webhook endpoint for sending alerts/notifications
// n8n can use this to send alerts via email, Slack, SMS, etc.

interface AlertPayload {
    action: 'get_pending' | 'acknowledge' | 'send_summary';
    alert_ids?: string[];
    webhook_secret?: string;
}

// Sample alerts for demonstration
const sampleAlerts = [
    {
        id: '1',
        type: 'price_increase',
        subscription: 'Netflix',
        message: 'Netflix increased from $19.99 to $22.99 (+15%)',
        previous_amount: 19.99,
        new_amount: 22.99,
        created_at: '2026-01-10T00:00:00Z',
        acknowledged: false,
    },
    {
        id: '2',
        type: 'price_increase',
        subscription: 'Adobe Creative Cloud',
        message: 'Adobe Creative Cloud increased from $54.99 to $59.99 (+9.1%)',
        previous_amount: 54.99,
        new_amount: 59.99,
        created_at: '2026-01-07T00:00:00Z',
        acknowledged: false,
    },
];

export async function POST(request: NextRequest) {
    try {
        const payload: AlertPayload = await request.json();

        // Verify webhook secret if configured
        const expectedSecret = process.env.N8N_WEBHOOK_SECRET;
        if (expectedSecret && payload.webhook_secret !== expectedSecret) {
            return NextResponse.json(
                { error: 'Invalid webhook secret' },
                { status: 401 }
            );
        }

        switch (payload.action) {
            case 'get_pending':
                // Return all unacknowledged alerts
                const pendingAlerts = sampleAlerts.filter(a => !a.acknowledged);
                return NextResponse.json({
                    success: true,
                    action: 'get_pending',
                    alerts: pendingAlerts,
                    count: pendingAlerts.length,
                });

            case 'acknowledge':
                // Mark specified alerts as acknowledged
                if (!payload.alert_ids || payload.alert_ids.length === 0) {
                    return NextResponse.json(
                        { error: 'alert_ids required for acknowledge action' },
                        { status: 400 }
                    );
                }
                return NextResponse.json({
                    success: true,
                    action: 'acknowledge',
                    acknowledged_ids: payload.alert_ids,
                    message: `Acknowledged ${payload.alert_ids.length} alerts`,
                });

            case 'send_summary':
                // Generate a summary for notification
                const summary = {
                    total_monthly_spend: 281.85,
                    active_subscriptions: 15,
                    pending_alerts: sampleAlerts.filter(a => !a.acknowledged).length,
                    upcoming_charges: [
                        { name: 'OpenAI', amount: 45.00, date: '2026-02-01' },
                        { name: 'Apple One Family', amount: 22.95, date: '2026-02-02' },
                        { name: 'Disney+', amount: 13.99, date: '2026-02-03' },
                    ],
                    price_changes_this_month: 2,
                };
                return NextResponse.json({
                    success: true,
                    action: 'send_summary',
                    summary,
                    formatted_message: `📊 SubTrack Monthly Summary\n\n💰 Total Monthly Spend: $${summary.total_monthly_spend}\n📦 Active Subscriptions: ${summary.active_subscriptions}\n⚠️ Pending Alerts: ${summary.pending_alerts}\n📈 Price Changes: ${summary.price_changes_this_month}\n\nUpcoming charges in next 7 days:\n${summary.upcoming_charges.map(c => `• ${c.name}: $${c.amount} on ${c.date}`).join('\n')}`,
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Valid: get_pending, acknowledge, send_summary' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('[n8n Alerts] Error:', error);
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
        endpoint: '/api/n8n/alerts',
        description: 'n8n webhook endpoint for managing and sending alerts',
        methods: ['POST'],
        actions: {
            get_pending: 'Get all unacknowledged alerts',
            acknowledge: 'Mark alerts as acknowledged (requires alert_ids[])',
            send_summary: 'Get formatted summary for notifications (email, Slack, etc.)',
        },
        n8n_workflow_ideas: [
            'Daily: Check for pending alerts, send Slack notification',
            'Weekly: Send summary email with upcoming charges',
            'On alert: Send push notification via Pushover/Telegram',
        ],
    });
}
