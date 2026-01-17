'use client';

import { motion } from 'framer-motion';
import {
    ArrowUpDown, MoreHorizontal, AlertCircle,
    ExternalLink, Calendar, CreditCard, Tag
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
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-[30%] cursor-pointer group" onClick={() => handleSort('normalized_name')}>
                                Service <SortIcon active={sortKey === 'normalized_name'} />
                            </th>
                            <th className="w-[15%] cursor-pointer group" onClick={() => handleSort('category')}>
                                Category <SortIcon active={sortKey === 'category'} />
                            </th>
                            <th className="w-[15%] cursor-pointer group text-right" onClick={() => handleSort('typical_amount')}>
                                Cost <SortIcon active={sortKey === 'typical_amount'} />
                            </th>
                            <th className="w-[15%] cursor-pointer group" onClick={() => handleSort('billing_cycle')}>
                                Frequency <SortIcon active={sortKey === 'billing_cycle'} />
                            </th>
                            <th className="w-[15%] cursor-pointer group" onClick={() => handleSort('next_expected')}>
                                Next Charge <SortIcon active={sortKey === 'next_expected'} />
                            </th>
                            <th className="w-[10%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSubs.map((sub) => {
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
                                >
                                    <td>
                                        <div className="flex items-center gap-3">
                                            {/* Placeholder Icon */}
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
                                    <td>
                                        <span className="badge badge-gray gap-1">
                                            <Tag className="w-3 h-3" />
                                            {sub.category}
                                        </span>
                                    </td>
                                    <td className="text-right font-medium font-mono text-slate-700">
                                        ${sub.typical_amount.toFixed(2)}
                                    </td>
                                    <td>
                                        <span className="text-sm text-slate-600 capitalize">{sub.billing_cycle}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${isSoon ? 'text-amber-600 font-medium' : 'text-slate-600'}`}>
                                                {new Date(sub.next_expected).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            {isSoon && (
                                                <span className="badge badge-red text-[10px] px-1.5">
                                                    Soon
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn-ghost p-2 rounded-lg">
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
