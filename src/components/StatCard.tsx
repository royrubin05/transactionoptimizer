'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color: 'indigo' | 'pink' | 'green' | 'orange' | 'purple' | 'cyan';
}

const colorClasses = {
    indigo: {
        bg: 'bg-indigo-50',
        icon: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        text: 'text-indigo-600',
    },
    pink: {
        bg: 'bg-pink-50',
        icon: 'bg-gradient-to-br from-pink-500 to-rose-600',
        text: 'text-pink-600',
    },
    green: {
        bg: 'bg-emerald-50',
        icon: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        text: 'text-emerald-600',
    },
    orange: {
        bg: 'bg-orange-50',
        icon: 'bg-gradient-to-br from-orange-500 to-amber-600',
        text: 'text-orange-600',
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'bg-gradient-to-br from-purple-500 to-violet-600',
        text: 'text-purple-600',
    },
    cyan: {
        bg: 'bg-cyan-50',
        icon: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        text: 'text-cyan-600',
    },
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color }: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)' }}
            className="card card-glow p-6"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colors.icon} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            {trend && trendValue && (
                <div className="mt-4 flex items-center gap-2">
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                    {trend === 'neutral' && <Minus className="w-4 h-4 text-slate-400" />}
                    <span className={`text-sm font-medium ${trend === 'up' ? 'text-red-500' :
                            trend === 'down' ? 'text-emerald-500' :
                                'text-slate-400'
                        }`}>
                        {trendValue}
                    </span>
                </div>
            )}
        </motion.div>
    );
}
