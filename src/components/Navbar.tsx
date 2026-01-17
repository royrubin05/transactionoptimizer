'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, CreditCard, Settings, LayoutDashboard,
    Bell, Menu, X, Sparkles, Zap
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/accounts', label: 'Accounts', icon: Home },
    { href: '/settings', label: 'Settings', icon: Settings },
];

interface NavbarProps {
    alertCount?: number;
}

export function Navbar({ alertCount = 0 }: NavbarProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <motion.div
                                className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                                <Sparkles className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">SubTrack</h1>
                                <p className="text-xs text-slate-500 hidden sm:block">Subscription Intelligence</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive
                                                ? 'bg-indigo-100 text-indigo-700 font-medium'
                                                : 'text-slate-600 hover:bg-white/50'
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span className="text-sm">{item.label}</span>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-xl hover:bg-white/50 transition-colors relative"
                            >
                                <Bell className="w-5 h-5 text-slate-600" />
                                {alertCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                                        {alertCount}
                                    </span>
                                )}
                            </motion.button>

                            {/* Mobile menu button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-xl hover:bg-white/50 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-5 h-5 text-slate-600" />
                                ) : (
                                    <Menu className="w-5 h-5 text-slate-600" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.nav
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 md:hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-indigo-600" />
                                        <span className="font-bold text-slate-900">Menu</span>
                                    </div>
                                    <button onClick={() => setMobileMenuOpen(false)}>
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <motion.div
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <item.icon className="w-5 h-5" />
                                                    <span>{item.label}</span>
                                                </motion.div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <p className="text-xs text-slate-400 text-center">
                                        SubTrack v1.0.0
                                    </p>
                                </div>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
