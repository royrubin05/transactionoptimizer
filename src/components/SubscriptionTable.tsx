'use client';

import { motion } from 'framer-motion';
import {
    ArrowUpDown, MoreHorizontal, CreditCard, Tag, Sparkles
} from 'lucide-react';
import { Subscription } from '@/lib/supabase';
import { useState } from 'react';
import { getAccountById } from '@/lib/sample-data';

interface SubscriptionTableProps {
    subscriptions: Subscription[];
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
    const [sortKey, setSortKey] = useState<keyof Subscription>('next_expected');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const sortedSubs = [...subscriptions].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal === undefined || bVal === undefined) return 0;

        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof Subscription) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const SortIcon = ({ active }: { active: boolean }) => (
        <ArrowUpDown className={`w-3 h-3 ml-1 inline-block transition-opacity ${active ? 'opacity-70 text-indigo-500' : 'opacity-20 hover:opacity-100'}`} />
    );

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-indigo-100 rounded-3xl p-6 shadow-xl shadow-indigo-100/50">
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3 text-left">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('normalized_name')}>
                                Service <SortIcon active={sortKey === 'normalized_name'} />
                            </th>
                            <th className="px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('category')}>
                                Category <SortIcon active={sortKey === 'category'} />
                            </th>
                            <th className="px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-widest cursor-pointer group text-right" onClick={() => handleSort('typical_amount')}>
                                Cost <SortIcon active={sortKey === 'typical_amount'} />
                            </th>
                            <th className="px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('billing_cycle')}>
                                Frequency <SortIcon active={sortKey === 'billing_cycle'} />
                            </th>
                            <th className="px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort('next_expected')}>
                                Next Charge <SortIcon active={sortKey === 'next_expected'} />
                            </th>
                            <th className="px-4 py-2 text-xs font-bold text-indigo-400 uppercase tracking-widest text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSubs.map((sub, index) => {
                            const account = getAccountById(sub.account_id);
                            const daysUntil = Math.ceil((new Date(sub.next_expected).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isSoon = daysUntil <= 3 && daysUntil >= 0;

                            return (
                                <motion.tr
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                                    className="bg-white shadow-sm hover:shadow-md rounded-2xl transition-all duration-200 group"
                                >
                                    <td className="px-4 py-4 align-middle first:rounded-l-2xl">
                                        <div className="flex items-center gap-4">
                                            {/* Fun, squircle icon container */}
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-md transform group-hover:rotate-6 transition-transform
                        ${sub.normalized_name.startsWith('A') ? 'bg-gradient-to-tr from-blue-400 to-indigo-500' :
                                                    sub.normalized_name.startsWith('N') ? 'bg-gradient-to-tr from-rose-400 to-red-500' :
                                                        sub.normalized_name.startsWith('S') ? 'bg-gradient-to-tr from-emerald-400 to-teal-500' :
                                                            'bg-gradient-to-tr from-slate-400 to-slate-500'}`}
                                            >
                                                {sub.normalized_name.substring(0, 1)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-[15px]">{sub.normalized_name}</div>
                                                <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                    {account && <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                                                    {account ? `${account.institution}` : 'Unknown'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-middle">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
                      ${sub.category === 'Entertainment' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                sub.category === 'Utilities' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    sub.category === 'Food' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                        'bg-slate-50 text-slate-600 border-slate-100'}`}
                                        >
                                            {sub.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 align-middle text-right">
                                        <span className="font-bold text-slate-700 text-[15px]">${sub.typical_amount.toFixed(2)}</span>
                                    </td>
                                    <td className="px-4 py-4 align-middle">
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                            {sub.billing_cycle}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold ${isSoon ? 'text-rose-500' : 'text-slate-600'}`}>
                                                {new Date(sub.next_expected).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            {isSoon && (
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-500 animate-pulse">
                                                    <Sparkles className="w-3 h-3" />
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-middle text-center last:rounded-r-2xl">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
