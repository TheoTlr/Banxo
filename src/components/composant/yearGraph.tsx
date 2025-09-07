"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const monthlyData = [
    { month: "Jan", accountA: 1200, accountB: 800 },
    { month: "Feb", accountA: 1500, accountB: 1100 },
    { month: "Mar", accountA: 1700, accountB: 900 },
    { month: "Apr", accountA: 1400, accountB: 1300 },
    { month: "May", accountA: 1800, accountB: 1200 },
    { month: "Jun", accountA: 1600, accountB: 1000 },
];

export default function MonthlyBalanceChart() {
    return (
        <div className="bg-background-card p-6 h-full rounded-2xl shadow-card w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-text-primary">
                    Solde mensuel (2 comptes)
                </h2>
                <span className="text-sm text-text-secondary">2025</span>
            </div>

            {/* Chart */}
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={6}>
                        {/* Dégradés */}
                        <defs>
                            <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id="gradientB" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF4D94" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#FF4D94" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2D45" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#6B7280"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#6B7280"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={false}
                            contentStyle={{
                                backgroundColor: "#1A1C2C",
                                borderRadius: "8px",
                                border: "none",
                                color: "#fff",
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: "12px", color: "#9CA3AF" }}
                            iconType="circle"
                        />

                        {/* Barres avec dégradé */}
                        <Bar
                            dataKey="accountA"
                            fill="url(#gradientA)"
                            radius={[6, 6, 0, 0]}
                            name="Compte A"
                            activeBar={false}
                        />
                        <Bar
                            dataKey="accountB"
                            fill="url(#gradientB)"
                            radius={[6, 6, 0, 0]}
                            name="Compte B"
                            activeBar={false}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
