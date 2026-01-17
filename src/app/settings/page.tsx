'use client';

import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon, Bell, CreditCard, Shield,
    Zap, Globe, Moon, Sun, Check, ChevronRight,
    Webhook, Database, Key
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useState } from 'react';

interface SettingItemProps {
    icon: typeof SettingsIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    onClick?: () => void;
}

function SettingItem({ icon: Icon, title, description, action, onClick }: SettingItemProps) {
    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={onClick}
            className={`flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                <Icon className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-slate-900">{title}</h4>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            {action || (onClick && <ChevronRight className="w-5 h-5 text-slate-400" />)}
        </motion.div>
    );
}

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-500' : 'bg-slate-300'
                }`}
        >
            <motion.div
                initial={false}
                animate={{ x: enabled ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
        </button>
    );
}

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [priceAlerts, setPriceAlerts] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);

    return (
        <div className="min-h-screen gradient-mesh">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
                    <p className="mt-1 text-slate-600">
                        Manage your preferences and integrations
                    </p>
                </motion.div>

                {/* Notifications Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6 mb-6"
                >
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-600" />
                        Notifications
                    </h3>

                    <div className="space-y-1">
                        <SettingItem
                            icon={Bell}
                            title="Push Notifications"
                            description="Receive alerts for price changes and new charges"
                            action={<ToggleSwitch enabled={notifications} onChange={setNotifications} />}
                        />
                        <SettingItem
                            icon={Zap}
                            title="Price Change Alerts"
                            description="Get notified when subscription prices increase"
                            action={<ToggleSwitch enabled={priceAlerts} onChange={setPriceAlerts} />}
                        />
                        <SettingItem
                            icon={Globe}
                            title="Weekly Summary Report"
                            description="Receive a weekly email with your subscription overview"
                            action={<ToggleSwitch enabled={weeklyReport} onChange={setWeeklyReport} />}
                        />
                    </div>
                </motion.section>

                {/* Connected Sources Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6 mb-6"
                >
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                        Connected Sources
                    </h3>

                    <div className="space-y-1">
                        <SettingItem
                            icon={CreditCard}
                            title="Credit Cards (via Plaid)"
                            description="Connect your credit cards to track subscriptions automatically"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon={Shield}
                            title="Apple App Store"
                            description="Connect to view iOS app subscriptions"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon={Globe}
                            title="Google Play Store"
                            description="Connect to view Android app subscriptions"
                            onClick={() => { }}
                        />
                    </div>
                </motion.section>

                {/* n8n Integration Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6 mb-6"
                >
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Webhook className="w-5 h-5 text-indigo-600" />
                        n8n Automation
                    </h3>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-slate-600 mb-3">
                            Connect SubTrack to n8n for automated workflows. Use these webhook endpoints:
                        </p>
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">POST</span>
                                <span className="text-slate-600">/api/n8n/transactions</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">POST</span>
                                <span className="text-slate-600">/api/n8n/sync</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">POST</span>
                                <span className="text-slate-600">/api/n8n/alerts</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <SettingItem
                            icon={Key}
                            title="Webhook Secret"
                            description="Configure a secret key for secure webhook calls"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon={Database}
                            title="Sync Schedule"
                            description="Configure automatic sync interval (default: 30 days)"
                            onClick={() => { }}
                        />
                    </div>
                </motion.section>

                {/* API Keys Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                >
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-indigo-600" />
                        API Configuration
                    </h3>

                    <div className="space-y-1">
                        <SettingItem
                            icon={Database}
                            title="Plaid API Keys"
                            description="Configure your Plaid credentials for bank connections"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon={Zap}
                            title="Gemini AI API Key"
                            description="Configure Google Gemini for AI-powered categorization"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon={Globe}
                            title="Supabase Configuration"
                            description="Configure your database connection"
                            onClick={() => { }}
                        />
                    </div>
                </motion.section>

                {/* Version Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8 text-sm text-slate-400"
                >
                    <p>SubTrack v1.0.0 • Built with 💜</p>
                </motion.div>
            </main>
        </div>
    );
}
