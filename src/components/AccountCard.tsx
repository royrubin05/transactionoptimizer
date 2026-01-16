'use client';

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

interface AccountCardProps {
    name: string;
    institution: string;
    mask: string;
    total: number;
    subscriptionCount: number;
    color: 'gold' | 'blue' | 'silver' | 'purple';
}

const cardColors = {
    gold: 'from-amber-400 via-yellow-500 to-orange-500',
    blue: 'from-blue-500 via-indigo-500 to-purple-600',
    silver: 'from-slate-400 via-gray-500 to-slate-600',
    purple: 'from-purple-500 via-violet-500 to-indigo-600',
};

export function AccountCard({ name, institution, mask, total, subscriptionCount, color }: AccountCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            whileHover={{ scale: 1.03, rotateY: 5 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cardColors[color]} p-6 text-white shadow-xl`}
            style={{ aspectRatio: '1.6/1' }}
        >
            {/* Card texture overlay */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.2)_0%,_transparent_50%)]" />
            </div>

            <div className="relative h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-80">{institution}</p>
                        <p className="text-lg font-bold">{name}</p>
                    </div>
                    <CreditCard className="w-8 h-8 opacity-80" />
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm opacity-80">•••• {mask}</p>
                        <p className="text-xs opacity-60">{subscriptionCount} subscriptions</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                        <p className="text-xs opacity-80">per month</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
