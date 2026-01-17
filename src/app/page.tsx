'use client';

import { motion } from 'framer-motion';
import {
  CreditCard, AlertCircle, TrendingUp,
  Plus, Sparkles, Filter, MoreHorizontal,
  ChevronRight, ArrowRight, Wallet, Zap, Calendar
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
    <div className="min-h-screen pb-20">
      <Navbar alertCount={unacknowledgedAlerts.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Fun Greeting Header */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Here's the scoop <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">for January</span> 🍦
          </h1>
          <p className="text-slate-500 font-medium mt-2">You're tracking 15 subscriptions like a pro.</p>
        </div>

        {/* Fun Stats Cards - Bouncy & Colorful */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-5 shadow-lg shadow-indigo-100 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monthly</span>
              </div>
              <div className="text-3xl font-black text-slate-800">${totalSpend.toFixed(2)}</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-5 shadow-lg shadow-purple-100 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active</span>
              </div>
              <div className="text-3xl font-black text-slate-800">{activeSubscriptions.length}</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-5 shadow-lg shadow-blue-100 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Yearly</span>
              </div>
              <div className="text-3xl font-black text-slate-800">${(totalSpend * 12).toLocaleString()}</div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-300 rounded-3xl p-5 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Add Source</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content Area - Table */}
          <div className="lg:col-span-8 space-y-8">

            {/* Alerts Banner (Playful) */}
            {unacknowledgedAlerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-100 rounded-3xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-2xl">
                  🚨
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800">Heads up!</h4>
                  <div className="text-sm text-slate-600 mt-0.5">
                    {unacknowledgedAlerts.length} updates need your attention. <span className="underline decoration-orange-300 font-bold cursor-pointer">Start fixing</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              {/* Header with Pill Buttons */}
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                  Active Subscriptions
                </h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
                    Filter
                  </button>
                  <button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 cursor-pointer">
                    Export
                  </button>
                </div>
              </div>

              {/* Verified 'Fun' Table */}
              <SubscriptionTable subscriptions={activeSubscriptions} />
            </div>
          </div>

          {/* Sidebar - Comparison & Sources */}
          <div className="lg:col-span-4 space-y-6">

            {/* Sources List - Card Style */}
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-6 border border-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Your Wallet</h3>
                <Link href="/accounts" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full transition-colors">Manage</Link>
              </div>

              <div className="space-y-4">
                {sampleAccounts.map(account => (
                  <motion.div
                    key={account.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-8 rounded-lg shadow-md flex items-center justify-center text-white text-[10px] font-bold tracking-widest relative overflow-hidden
                        ${account.institution === 'Chase' ? 'bg-blue-600' :
                          account.institution === 'American Express' ? 'bg-amber-500' :
                            account.type === 'app_store' ? 'bg-slate-800' : 'bg-indigo-500'}`}
                      >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30"></div>
                        {/* Card Chip Simulation */}
                        <div className="absolute top-1/2 left-1 transform -translate-y-1/2 w-1.5 h-1 bg-yellow-200 rounded-sm opacity-80"></div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{account.name}</div>
                        <div className="text-[11px] font-semibold text-slate-400">
                          {account.mask ? `•••• ${account.mask}` : 'Connected'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fun AI Insights Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden shadow-xl shadow-indigo-200 cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner border border-white/10">
                  ✨
                </div>
                <h4 className="font-black text-xl mb-2">Gemini Found Savings</h4>
                <p className="text-indigo-100 text-sm font-medium mb-4 leading-relaxed">
                  We found 2 subscriptions you might not need anymore. Save <span className="font-bold text-white bg-indigo-500/50 px-1 py-0.5 rounded">~${(totalSpend * 0.1).toFixed(0)}/mo</span> instantly.
                </p>
                <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm shadow-md">
                  Reveal Insights
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
