'use client';

import { motion } from 'framer-motion';
import { Plus, CreditCard, Apple, Smartphone, Wallet, Link2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AccountCard } from '@/components/AccountCard';
import {
    sampleAccounts, sampleAlerts, getSpendByAccount, getSubscriptionsByAccount
} from '@/lib/sample-data';

const accountColors: Record<string, 'gold' | 'blue' | 'silver' | 'purple'> = {
    'American Express': 'gold',
    'Chase': 'blue',
    'Capital One': 'silver',
    'PayPal': 'purple',
    'Apple': 'silver',
    'Google': 'blue',
};

const sourceTypes = [
    {
        id: 'credit_cards',
        name: 'Credit Cards',
        description: 'Connect via Plaid to automatically track credit card subscriptions',
        icon: CreditCard,
        color: 'from-blue-500 to-indigo-600',
        available: true,
    },
    {
        id: 'apple',
        name: 'Apple App Store',
        description: 'View subscriptions purchased through iOS apps',
        icon: Apple,
        color: 'from-slate-600 to-slate-800',
        available: true,
    },
    {
        id: 'google',
        name: 'Google Play Store',
        description: 'View subscriptions purchased through Android apps',
        icon: Smartphone,
        color: 'from-green-500 to-emerald-600',
        available: true,
    },
    {
        id: 'paypal',
        name: 'PayPal',
        description: 'Track recurring PayPal payments and subscriptions',
        icon: Wallet,
        color: 'from-blue-400 to-blue-600',
        available: true,
    },
    {
        id: 'stripe',
        name: 'Stripe',
        description: 'Coming soon - Track Stripe recurring payments',
        icon: Link2,
        color: 'from-purple-500 to-indigo-600',
        available: false,
    },
    {
        id: 'venmo',
        name: 'Venmo',
        description: 'Coming soon - Track Venmo recurring payments',
        icon: Wallet,
        color: 'from-cyan-500 to-blue-500',
        available: false,
    },
];

export default function AccountsPage() {
    const unacknowledgedAlerts = sampleAlerts.filter(a => !a.acknowledged);
    const accountSpend = getSpendByAccount();

    return (
        <div className="min-h-screen gradient-mesh">
            <Navbar alertCount={unacknowledgedAlerts.length} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Accounts</h2>
                        <p className="mt-1 text-slate-600">
                            {sampleAccounts.length} sources connected
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Connect Source
                    </motion.button>
                </motion.div>

                {/* Connected Accounts */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Connected Accounts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accountSpend
                            .filter(({ total }) => total > 0)
                            .map(({ account, total }, index) => (
                                <motion.div
                                    key={account.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AccountCard
                                        name={account.name}
                                        institution={account.institution}
                                        mask={account.mask || (account.type === 'app_store' ? '📱' : '')}
                                        total={total}
                                        subscriptionCount={getSubscriptionsByAccount(account.id).length}
                                        color={accountColors[account.institution] || 'silver'}
                                    />
                                </motion.div>
                            ))}
                    </div>
                </motion.section>

                {/* Available Sources */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sourceTypes.map((source, index) => (
                            <motion.div
                                key={source.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                whileHover={source.available ? { scale: 1.02, y: -4 } : {}}
                                className={`card p-6 ${!source.available ? 'opacity-60' : 'cursor-pointer'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${source.color} shadow-lg`}>
                                        <source.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-slate-900">{source.name}</h4>
                                            {!source.available && (
                                                <span className="badge badge-info text-xs">Coming Soon</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{source.description}</p>
                                    </div>
                                </div>

                                {source.available && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full mt-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        Connect
                                    </motion.button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"
                >
                    <h4 className="font-semibold text-indigo-900 mb-2">🔒 Your data is secure</h4>
                    <p className="text-sm text-indigo-700">
                        SubTrack uses bank-level encryption and never stores your login credentials.
                        Credit card connections are handled securely through Plaid, a trusted financial data platform
                        used by millions of users.
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
