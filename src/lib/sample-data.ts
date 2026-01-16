// Sample data for testing the UI before connecting real data
// This allows full functionality testing without API credentials

import { Account, Transaction, Subscription, Alert } from './supabase';

export const sampleAccounts: Account[] = [
    {
        id: '1',
        plaid_account_id: 'acc_amex_1',
        plaid_access_token: 'access-sandbox-xxx',
        name: 'American Express Gold',
        institution: 'American Express',
        type: 'credit',
        mask: '1001',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '2',
        plaid_account_id: 'acc_visa_1',
        plaid_access_token: 'access-sandbox-xxx',
        name: 'Chase Sapphire Preferred',
        institution: 'Chase',
        type: 'credit',
        mask: '4242',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '3',
        plaid_account_id: 'acc_cap1_1',
        plaid_access_token: 'access-sandbox-xxx',
        name: 'Capital One Venture',
        institution: 'Capital One',
        type: 'credit',
        mask: '8888',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '4',
        plaid_account_id: 'acc_paypal_1',
        plaid_access_token: 'access-sandbox-xxx',
        name: 'PayPal Credit',
        institution: 'PayPal',
        type: 'credit',
        mask: '5555',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '5',
        plaid_account_id: 'acc_apple_1',
        plaid_access_token: 'apple-receipt-xxx',
        name: 'Apple App Store',
        institution: 'Apple',
        type: 'app_store',
        mask: '',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '6',
        plaid_account_id: 'acc_google_1',
        plaid_access_token: 'google-play-xxx',
        name: 'Google Play Store',
        institution: 'Google',
        type: 'app_store',
        mask: '',
        created_at: '2025-01-01T00:00:00Z',
    },
];

export const sampleSubscriptions: Subscription[] = [
    {
        id: '1',
        account_id: '1',
        merchant_name: 'NETFLIX.COM',
        normalized_name: 'Netflix',
        category: 'Streaming',
        typical_amount: 22.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-10',
        next_expected: '2026-02-10',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '2',
        account_id: '1',
        merchant_name: 'SPOTIFY PREMIUM',
        normalized_name: 'Spotify',
        category: 'Music',
        typical_amount: 10.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-05',
        next_expected: '2026-02-05',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '3',
        account_id: '2',
        merchant_name: 'OPENAI API',
        normalized_name: 'OpenAI',
        category: 'Software',
        typical_amount: 45.00,
        billing_cycle: 'monthly',
        last_charged: '2026-01-01',
        next_expected: '2026-02-01',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '4',
        account_id: '2',
        merchant_name: 'GITHUB INC',
        normalized_name: 'GitHub Pro',
        category: 'Software',
        typical_amount: 4.00,
        billing_cycle: 'monthly',
        last_charged: '2026-01-08',
        next_expected: '2026-02-08',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '5',
        account_id: '3',
        merchant_name: 'AMAZON PRIME',
        normalized_name: 'Amazon Prime',
        category: 'Shopping',
        typical_amount: 14.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-12',
        next_expected: '2026-02-12',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '6',
        account_id: '3',
        merchant_name: 'GOOGLE STORAGE',
        normalized_name: 'Google One',
        category: 'Cloud Storage',
        typical_amount: 2.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-15',
        next_expected: '2026-02-15',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '7',
        account_id: '1',
        merchant_name: 'DISNEY PLUS',
        normalized_name: 'Disney+',
        category: 'Streaming',
        typical_amount: 13.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-03',
        next_expected: '2026-02-03',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '8',
        account_id: '4',
        merchant_name: 'ADOBE CREATIVE',
        normalized_name: 'Adobe Creative Cloud',
        category: 'Software',
        typical_amount: 59.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-07',
        next_expected: '2026-02-07',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '9',
        account_id: '4',
        merchant_name: 'PELOTON DIGITAL',
        normalized_name: 'Peloton',
        category: 'Fitness',
        typical_amount: 24.00,
        billing_cycle: 'monthly',
        last_charged: '2026-01-09',
        next_expected: '2026-02-09',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '10',
        account_id: '2',
        merchant_name: 'NYT DIGITAL',
        normalized_name: 'NY Times',
        category: 'News/Media',
        typical_amount: 17.00,
        billing_cycle: 'monthly',
        last_charged: '2026-01-11',
        next_expected: '2026-02-11',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    // Apple App Store subscriptions
    {
        id: '11',
        account_id: '5',
        merchant_name: 'APPLE.COM/BILL ITUNES',
        normalized_name: 'iCloud+',
        category: 'Cloud Storage',
        typical_amount: 2.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-14',
        next_expected: '2026-02-14',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '12',
        account_id: '5',
        merchant_name: 'APPLE.COM/BILL APPLE ONE',
        normalized_name: 'Apple One Family',
        category: 'Entertainment',
        typical_amount: 22.95,
        billing_cycle: 'monthly',
        last_charged: '2026-01-02',
        next_expected: '2026-02-02',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '13',
        account_id: '5',
        merchant_name: 'APPLE.COM/BILL DUOLINGO',
        normalized_name: 'Duolingo Plus',
        category: 'Education',
        typical_amount: 12.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-06',
        next_expected: '2026-02-06',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    // Google Play Store subscriptions
    {
        id: '14',
        account_id: '6',
        merchant_name: 'GOOGLE*YOUTUBE PREMIUM',
        normalized_name: 'YouTube Premium',
        category: 'Streaming',
        typical_amount: 13.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-04',
        next_expected: '2026-02-04',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '15',
        account_id: '6',
        merchant_name: 'GOOGLE*HEADSPACE',
        normalized_name: 'Headspace',
        category: 'Healthcare',
        typical_amount: 12.99,
        billing_cycle: 'monthly',
        last_charged: '2026-01-13',
        next_expected: '2026-02-13',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
    },
];

export const sampleAlerts: Alert[] = [
    {
        id: '1',
        subscription_id: '1',
        type: 'price_increase',
        message: 'Netflix increased from $19.99 to $22.99 (+15%)',
        previous_amount: 19.99,
        new_amount: 22.99,
        acknowledged: false,
        created_at: '2026-01-10T00:00:00Z',
    },
    {
        id: '2',
        subscription_id: '8',
        type: 'price_increase',
        message: 'Adobe Creative Cloud increased from $54.99 to $59.99 (+9.1%)',
        previous_amount: 54.99,
        new_amount: 59.99,
        acknowledged: false,
        created_at: '2026-01-07T00:00:00Z',
    },
    {
        id: '3',
        subscription_id: '3',
        type: 'unexpected_charge',
        message: 'OpenAI charged $65.00 instead of typical $45.00',
        previous_amount: 45.00,
        new_amount: 65.00,
        acknowledged: true,
        created_at: '2026-01-01T00:00:00Z',
    },
];

// Helper functions for sample data
export function getAccountById(id: string): Account | undefined {
    return sampleAccounts.find(a => a.id === id);
}

export function getSubscriptionsByAccount(accountId: string): Subscription[] {
    return sampleSubscriptions.filter(s => s.account_id === accountId);
}

export function getAlertsBySubscription(subscriptionId: string): Alert[] {
    return sampleAlerts.filter(a => a.subscription_id === subscriptionId);
}

export function getUnacknowledgedAlerts(): Alert[] {
    return sampleAlerts.filter(a => !a.acknowledged);
}

export function getTotalMonthlySpend(): number {
    return sampleSubscriptions
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + s.typical_amount, 0);
}

export function getSpendByCategory(): Record<string, number> {
    return sampleSubscriptions
        .filter(s => s.status === 'active')
        .reduce((acc, s) => {
            acc[s.category] = (acc[s.category] || 0) + s.typical_amount;
            return acc;
        }, {} as Record<string, number>);
}

export function getSpendByAccount(): { account: Account; total: number }[] {
    return sampleAccounts.map(account => ({
        account,
        total: sampleSubscriptions
            .filter(s => s.account_id === account.id && s.status === 'active')
            .reduce((sum, s) => sum + s.typical_amount, 0),
    }));
}
