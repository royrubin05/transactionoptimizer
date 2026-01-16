'use client';

import { motion } from 'framer-motion';

interface CategoryBreakdownProps {
    data: Record<string, number>;
    total: number;
}

const categoryColors: Record<string, string> = {
    'Streaming': '#ef4444',
    'Music': '#22c55e',
    'Software': '#3b82f6',
    'Shopping': '#f97316',
    'Cloud Storage': '#06b6d4',
    'News/Media': '#64748b',
    'Fitness': '#a855f7',
    'Gaming': '#ec4899',
    'Education': '#eab308',
    'Healthcare': '#f43f5e',
    'Entertainment': '#6366f1',
};

export function CategoryBreakdown({ data, total }: CategoryBreakdownProps) {
    const sortedCategories = Object.entries(data)
        .sort(([, a], [, b]) => b - a);

    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Spend by Category</h3>

            {/* Visual bar chart */}
            <div className="space-y-3">
                {sortedCategories.map(([category, amount], index) => {
                    const percentage = (amount / total) * 100;
                    const color = categoryColors[category] || '#94a3b8';

                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{category}</span>
                                <span className="text-slate-600">${amount.toFixed(2)}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend dots */}
            <div className="mt-6 flex flex-wrap gap-3">
                {sortedCategories.map(([category]) => (
                    <div key={category} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: categoryColors[category] || '#94a3b8' }}
                        />
                        {category}
                    </div>
                ))}
            </div>
        </div>
    );
}
