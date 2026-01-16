import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Account {
    id: string;
    plaid_account_id: string;
    plaid_access_token: string;
    name: string;
    institution: string;
    type: string;
    mask: string;
    created_at: string;
}

export interface Transaction {
    id: string;
    account_id: string;
    plaid_transaction_id: string;
    amount: number;
    date: string;
    merchant_name: string;
    category: string[];
    ai_category: string;
    pending: boolean;
    created_at: string;
}

export interface Subscription {
    id: string;
    account_id: string;
    merchant_name: string;
    normalized_name: string;
    category: string;
    typical_amount: number;
    billing_cycle: 'monthly' | 'yearly' | 'weekly';
    last_charged: string;
    next_expected: string;
    status: 'active' | 'cancelled' | 'paused';
    created_at: string;
}

export interface Alert {
    id: string;
    subscription_id: string;
    type: 'price_increase' | 'unexpected_charge' | 'missed';
    message: string;
    previous_amount: number;
    new_amount: number;
    acknowledged: boolean;
    created_at: string;
}
