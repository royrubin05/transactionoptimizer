'use client';

import { motion } from 'framer-motion';
import {
  CreditCard, AlertCircle, TrendingUp,
  Plus, Sparkles, Filter, MoreHorizontal,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { Navbar, SubscriptionTable } from '@/components';
import {
  sampleSubscriptions, sampleAlerts,
  getTotalMonthlySpend, getSpendByCategory,
  sampleAccounts
} from '@/lib/sample-data';
import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const totalSpend = getTotalMonthlySpend();
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const activeSubscriptions = sampleSubscriptions.filter(s => s.status === 'active');

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar alertCount={unacknowledgedAlerts.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Summary Stats - Very Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="panel p-4 flex flex-col justify-between h-28">
            <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
              <span>Total Monthly</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">${totalSpend.toFixed(2)}</div>
              <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <span className="bg-emerald-50 px-1 rounded">+3.2%</span> vs last month
              </div>
            </div>
          </div>

          <div className="panel p-4 flex flex-col justify-between h-28">
            <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
              <span>Active Subs</span>
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{activeSubscriptions.length}</div>
              <div className="text-xs text-slate-400 mt-1">Across {sampleAccounts.length} sources</div>
            </div>
          </div>

          <div className="panel p-4 flex flex-col justify-between h-28">
            <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
              <span>Yearly Forecast</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">${(totalSpend * 12).toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Estimated annual</div>
            </div>
          </div>

          <div className="panel p-4 flex flex-col justify-center items-center h-28 border-dashed border-2 bg-slate-50 hover:bg-white hover:border-indigo-300 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Plus className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-slate-600 mt-2">Connect New Source</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content Area - Table */}
          <div className="lg:col-span-8 space-y-6">

            {/* Alerts Banner (Compact) */}
            {unacknowledgedAlerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-orange-900">Attention Needed ({unacknowledgedAlerts.length})</h4>
                  <div className="mt-1 space-y-1">
                    {unacknowledgedAlerts.map(alert => (
                      <div key={alert.id} className="text-xs text-orange-800 flex justify-between items-center group cursor-pointer hover:bg-orange-100/50 p-1 rounded transition-colors">
                        <span>{alert.message}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* List Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Active Subscriptions</h3>
              <div className="flex gap-2">
                <button className="btn btn-secondary text-xs">
                  <Filter className="w-3 h-3" /> Filter
                </button>
                <button className="btn btn-primary text-xs">
                  Export
                </button>
              </div>
            </div>

            {/* Dense Data Table */}
            <SubscriptionTable subscriptions={activeSubscriptions} />
          </div>

          {/* Sidebar - Comparison & Sources */}
          <div className="lg:col-span-4 space-y-6">

            {/* Quick Actions / Sources Summary */}
            <div className="panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Connected Sources</h3>
                <Link href="/accounts" className="text-xs text-indigo-600 font-medium hover:underline">Manage</Link>
              </div>

              <div className="space-y-3">
                {sampleAccounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shadow-sm
                        ${account.institution === 'Chase' ? 'bg-blue-600' :
                          account.institution === 'American Express' ? 'bg-amber-500' :
                            account.type === 'app_store' ? 'bg-slate-800' : 'bg-indigo-500'}`}
                      >
                        {account.institution.substring(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{account.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {account.mask ? `•••• ${account.mask}` : 'Connected'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {/* Placeholder for spend per source logic if needed */}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spend by Category Mini-Chart */}
            <div className="panel p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Top Categories</h3>
              <div className="space-y-4">
                {Object.entries(getSpendByCategory()).slice(0, 5).map(([cat, amount], idx) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="text-slate-500">${amount.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][idx % 5]}`}
                        style={{ width: `${(amount / totalSpend) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to full report */}
            <div className="p-4 bg-indigo-900 rounded-xl text-white relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24" />
              </div>
              <h4 className="font-bold mb-1 relative z-10">AI Insights</h4>
              <p className="text-xs text-indigo-200 mb-3 relative z-10 w-3/4">
                Gemini found 2 ways to save ~${(totalSpend * 0.1).toFixed(0)}/mo on your subscriptions.
              </p>
              <div className="flex items-center text-xs font-bold text-indigo-200 group-hover:text-white transition-colors">
                View Report <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
