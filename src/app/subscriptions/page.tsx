'use client';

import { motion } from 'framer-motion';
import {
    Plus, Filter, Search, ArrowUpDown,
    Tv, Music, Code, ShoppingBag, Cloud, Newspaper,
    Dumbbell, Gamepad2
} from 'lucide-react';
import { Navbar, SubscriptionTable } from '@/components';
import {
    sampleSubscriptions, sampleAlerts, getAccountById
} from '@/lib/sample-data';
import { useState } from 'react';

const categories = [
    { name: 'All', icon: Filter },
    { name: 'Streaming', icon: Tv },
    { name: 'Music', icon: Music },
    { name: 'Software', icon: Code },
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Cloud Storage', icon: Cloud },
    { name: 'Fitness', icon: Dumbbell },
];

export default function SubscriptionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<'name' | 'amount' | 'date'>('name');

    const unacknowledgedAlerts = sampleAlerts.filter(a => !a.acknowledged);

    const filteredSubscriptions = sampleSubscriptions
        .filter(s => s.status === 'active')
        .filter(s =>
            selectedCategory === 'All' || s.category === selectedCategory
        )
        .filter(s =>
            s.normalized_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'amount':
                    return b.typical_amount - a.typical_amount;
                case 'date':
                    return new Date(a.next_expected).getTime() - new Date(b.next_expected).getTime();
                default:
                    return a.normalized_name.localeCompare(b.normalized_name);
            }
        });

    const totalMonthly = filteredSubscriptions.reduce((sum, s) => sum + s.typical_amount, 0);

    return (
        <div className="min-h-screen gradient-mesh">
            <Navbar alertCount={unacknowledgedAlerts.length} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Subscriptions</h2>
                        <p className="mt-1 text-slate-600">
                            {filteredSubscriptions.length} active • ${totalMonthly.toFixed(2)}/month
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Add Subscription
                    </motion.button>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-4 mb-6"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search subscriptions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4 text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'name' | 'amount' | 'date')}
                                className="px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none bg-white"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="amount">Sort by Amount</option>
                                <option value="date">Sort by Next Charge</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category.name;
                            return (
                                <motion.button
                                    key={category.name}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${isActive
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <category.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{category.name}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Subscriptions List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    {filteredSubscriptions.length > 0 ? (
                        <SubscriptionTable subscriptions={filteredSubscriptions} />
                    ) : (
                        <div className="card p-12 text-center bg-white border border-dashed border-slate-300">
                            <p className="text-slate-500">No subscriptions found</p>
                            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
