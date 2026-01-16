'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, HelpCircle, X, Check } from 'lucide-react';
import { Alert } from '@/lib/supabase';

interface AlertCardProps {
    alert: Alert;
    subscriptionName?: string;
    onAcknowledge?: (id: string) => void;
}

const alertConfig = {
    price_increase: {
        icon: TrendingUp,
        color: 'from-rose-500 to-pink-600',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        textColor: 'text-rose-700',
    },
    unexpected_charge: {
        icon: AlertTriangle,
        color: 'from-orange-500 to-amber-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-700',
    },
    missed: {
        icon: HelpCircle,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
    },
};

export function AlertCard({ alert, subscriptionName, onAcknowledge }: AlertCardProps) {
    const config = alertConfig[alert.type];
    const Icon = config.icon;

    if (alert.acknowledged) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`relative overflow-hidden rounded-xl border ${config.borderColor} ${config.bgColor} p-4`}
        >
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    {subscriptionName && (
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {subscriptionName}
                        </p>
                    )}
                    <p className={`mt-1 text-sm font-medium ${config.textColor}`}>
                        {alert.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {new Date(alert.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </p>
                </div>

                {onAcknowledge && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                            title="Acknowledge"
                        >
                            <Check className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                            title="Dismiss"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
