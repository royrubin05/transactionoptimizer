'use client';

import { motion } from 'framer-motion';
import {
    Tv, Music, Code, ShoppingBag, Cloud, Newspaper,
    Dumbbell, Gamepad2, GraduationCap, Heart, Sparkles,
    CreditCard, MoreHorizontal
} from 'lucide-react';
import { Subscription } from '@/lib/supabase';

interface SubscriptionCardProps {
    subscription: Subscription;
    accountName?: string;
    showAccount?: boolean;
    onViewDetails?: (id: string) => void;
}

const categoryIcons: Record<string, typeof Tv> = {
    'Streaming': Tv,
    'Music': Music,
    'Software': Code,
    'Shopping': ShoppingBag,
    'Cloud Storage': Cloud,
    'News/Media': Newspaper,
    'Fitness': Dumbbell,
    'Gaming': Gamepad2,
    'Education': GraduationCap,
    'Healthcare': Heart,
    'Entertainment': Sparkles,
};

const categoryColors: Record<string, string> = {
    'Streaming': 'from-red-500 to-rose-600',
    'Music': 'from-green-500 to-emerald-600',
    'Software': 'from-blue-500 to-indigo-600',
    'Shopping': 'from-orange-500 to-amber-600',
    'Cloud Storage': 'from-cyan-500 to-blue-600',
    'News/Media': 'from-slate-500 to-gray-600',
    'Fitness': 'from-purple-500 to-violet-600',
    'Gaming': 'from-pink-500 to-rose-600',
    'Education': 'from-yellow-500 to-orange-600',
    'Healthcare': 'from-rose-500 to-pink-600',
    'Entertainment': 'from-indigo-500 to-purple-600',
};

export function SubscriptionCard({ subscription, accountName, showAccount = true, onViewDetails }: SubscriptionCardProps) {
    const Icon = categoryIcons[subscription.category] || CreditCard;
    const colorClass = categoryColors[subscription.category] || 'from-slate-500 to-gray-600';

    const nextCharge = new Date(subscription.next_expected);
    const today = new Date();
    const daysUntil = Math.ceil((nextCharge.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="card card-glow p-4 cursor-pointer"
            onClick={() => onViewDetails?.(subscription.id)}
        >
            <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${colorClass} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                            {subscription.normalized_name}
                        </h3>
                        <span className="badge badge-info text-xs">
                            {subscription.billing_cycle}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <span>{subscription.category}</span>
                        {showAccount && accountName && (
                            <>
                                <span>•</span>
                                <span className="truncate">{accountName}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                        ${subscription.typical_amount.toFixed(2)}
                    </p>
                    <p className={`text-xs ${daysUntil <= 3 ? 'text-orange-600 font-medium' : 'text-slate-500'}`}>
                        {daysUntil === 0 ? 'Today' :
                            daysUntil === 1 ? 'Tomorrow' :
                                daysUntil < 0 ? 'Overdue' :
                                    `in ${daysUntil} days`}
                    </p>
                </div>

                <button
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Open options menu
                    }}
                >
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
            </div>
        </motion.div>
    );
}
