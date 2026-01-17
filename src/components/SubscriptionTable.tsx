'use client';

import { motion } from 'framer-motion';
import {
    ArrowUpDown, MoreHorizontal, CreditCard, Tag
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
        <ArrowUpDown className={`w-3 h-3 ml-1 inline-block transition-opacity ${active ? 'opacity-100' : 'opacity-30 group-hover:opacity-50'}`} />
    );

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-[1px] border-slate-200">
                            <th className="bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group border-b border-slate-200" onClick={() => handleSort('normalized_name')}>
                                Service <SortIcon active={sortKey === 'normalized_name'} />
                            </th>
                            <th className="bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group border-b border-slate-200" onClick={() => handleSort('category')}>
                                Category <SortIcon active={sortKey === 'category'} />
                            </th>
                            <th className="bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group text-right border-b border-slate-200" onClick={() => handleSort('typical_amount')}>
                                Cost <SortIcon active={sortKey === 'typical_amount'} />
                            </th>
                            <th className="bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group border-b border-slate-200" onClick={() => handleSort('billing_cycle')}>
                                Frequency <SortIcon active={sortKey === 'billing_cycle'} />
                            </th>
                            <th className="bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer group border-b border-slate-200" onClick={() => handleSort('next_expected')}>
                                Next Charge <SortIcon active={sortKey === 'next_expected'} />
                            </th>
                            <th className="bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSubs.map((sub, index) => {
                            const account = getAccountById(sub.account_id);
                            const isHighCost = sub.typical_amount > 50;
                            const daysUntil = Math.ceil((new Date(sub.next_expected).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isSoon = daysUntil <= 3 && daysUntil >= 0;

                            return (
                                <motion.tr
                                    key={sub.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="hover:bg-slate-50 border-b border-slate-100 last:border-0 group"
                                >
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br
                        ${sub.normalized_name.startsWith('A') ? 'from-blue-500 to-indigo-600' :
                                                    sub.normalized_name.startsWith('N') ? 'from-red-500 to-rose-600' :
                                                        sub.normalized_name.startsWith('S') ? 'from-green-500 to-emerald-600' :
                                                            'from-slate-500 to-slate-600'}`}
                                            >
                                                {sub.normalized_name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{sub.normalized_name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <CreditCard className="w-3 h-3" />
                                                    {account ? `${account.institution} •••${account.mask || '••••'}` : 'Unknown Source'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {sub.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 align-middle text-right font-medium font-mono text-slate-700">
                                        ${sub.typical_amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <span className="text-sm text-slate-600 capitalize">{sub.billing_cycle}</span>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${isSoon ? 'text-amber-600 font-medium' : 'text-slate-600'}`}>
                                                {new Date(sub.next_expected).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            {isSoon && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-red-50 text-red-600 border border-red-200">
                                                    Soon
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-middle text-center">
                                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
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
