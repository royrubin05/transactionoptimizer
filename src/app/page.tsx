'use client';

import { motion } from 'framer-motion';
import {
  CreditCard, AlertCircle, Wallet, TrendingUp,
  Plus, Sparkles, RefreshCw,
  Apple, Smartphone
} from 'lucide-react';
import {
  StatCard, AlertCard, SubscriptionCard,
  AccountCard, CategoryBreakdown, Navbar
} from '@/components';
import {
  sampleAccounts, sampleSubscriptions, sampleAlerts,
  getTotalMonthlySpend, getSpendByCategory, getSpendByAccount,
  getAccountById, getSubscriptionsByAccount
} from '@/lib/sample-data';
import { useState } from 'react';

// Card color mapping for accounts
const accountColors: Record<string, 'gold' | 'blue' | 'silver' | 'purple'> = {
  'American Express': 'gold',
  'Chase': 'blue',
  'Capital One': 'silver',
  'PayPal': 'purple',
  'Apple': 'silver',
  'Google': 'blue',
};

export default function Dashboard() {
  const [alerts, setAlerts] = useState(sampleAlerts);

  const totalSpend = getTotalMonthlySpend();
  const categorySpend = getSpendByCategory();
  const accountSpend = getSpendByAccount();
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const activeSubscriptions = sampleSubscriptions.filter(s => s.status === 'active');

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div className="min-h-screen gradient-mesh">
      <Navbar alertCount={unacknowledgedAlerts.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-900">
            Good afternoon! 👋
          </h2>
          <p className="mt-1 text-slate-600">
            Here&apos;s your subscription overview for January 2026
          </p>
        </motion.div>

        {/* Alerts Section */}
        {unacknowledgedAlerts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-semibold text-slate-900">Attention Needed</h3>
              <span className="badge badge-danger">{unacknowledgedAlerts.length} alerts</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {unacknowledgedAlerts.map(alert => {
                const subscription = sampleSubscriptions.find(s => s.id === alert.subscription_id);
                return (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    subscriptionName={subscription?.normalized_name}
                    onAcknowledge={handleAcknowledgeAlert}
                  />
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Monthly Recurring"
            value={`$${totalSpend.toFixed(2)}`}
            subtitle="across all sources"
            icon={Wallet}
            color="indigo"
            trend="up"
            trendValue="+$8.00 vs last month"
          />
          <StatCard
            title="Active Subscriptions"
            value={activeSubscriptions.length}
            subtitle="tracked services"
            icon={CreditCard}
            color="pink"
          />
          <StatCard
            title="Yearly Projection"
            value={`$${(totalSpend * 12).toFixed(0)}`}
            subtitle="estimated annual spend"
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Sources Connected"
            value={sampleAccounts.length}
            subtitle="cards & app stores"
            icon={Smartphone}
            color="purple"
          />
        </section>

        {/* Account Cards (Credit Cards + App Stores) */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Your Sources</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Source
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountSpend
              .filter(({ total }) => total > 0)
              .map(({ account, total }) => (
                <AccountCard
                  key={account.id}
                  name={account.name}
                  institution={account.institution}
                  mask={account.mask || (account.type === 'app_store' ? '📱' : '')}
                  total={total}
                  subscriptionCount={getSubscriptionsByAccount(account.id).length}
                  color={accountColors[account.institution] || 'silver'}
                />
              ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subscriptions List */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">All Subscriptions</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Now
              </motion.button>
            </div>

            <div className="space-y-3">
              {activeSubscriptions.map((subscription, index) => {
                const account = getAccountById(subscription.account_id);
                return (
                  <motion.div
                    key={subscription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <SubscriptionCard
                      subscription={subscription}
                      accountName={account?.name}
                    />
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Category Breakdown */}
          <aside>
            <CategoryBreakdown data={categorySpend} total={totalSpend} />

            {/* Subscription Sources Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 mt-4"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Supported Sources</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Credit Cards</p>
                    <p className="text-xs text-slate-500">Via Plaid (Visa, Amex, etc.)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Apple className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Apple App Store</p>
                    <p className="text-xs text-slate-500">Via App Store Connect API</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Google Play Store</p>
                    <p className="text-xs text-slate-500">Via Google Play Developer API</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <Wallet className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">PayPal</p>
                    <p className="text-xs text-slate-500">Via PayPal Subscriptions API</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 italic">
                💡 Coming soon: Stripe, Venmo, Bank Accounts
              </p>
            </motion.div>
          </aside>
        </div>
      </main>

      {/* Floating Action Button - Mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 lg:hidden btn btn-primary p-4 rounded-full shadow-xl"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
