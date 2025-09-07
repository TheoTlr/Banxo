"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
} from "recharts";
import { Heart } from "lucide-react";

interface DataPoint {
    day: string;
    in: number;
    out: number;
}

interface WasteInOutChartProps {
    data: DataPoint[];
}

export default function TimeGraph({ data }: WasteInOutChartProps) {
    return (
        <div className="bg-gradient-to-b from-[#1A1C2C] to-[#111322] p-6 rounded-2xl shadow-lg w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-lg">Waste In & Out</h2>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <span>7 Days</span>
                    <Heart className="w-4 h-4 text-pink-500" />
                </div>
            </div>

            {/* Chart */}
            <div className="h-60">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="gradientIn" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF4D94" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#FF4D94" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradientOut" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2D45" />
                        <XAxis
                            dataKey="day"
                            stroke="#6B7280"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#6B7280"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1A1C2C",
                                borderRadius: "8px",
                                border: "none",
                                color: "#fff",
                            }}
                        />

                        {/* Zones avec dégradé */}
                        <Area
                            type="monotone"
                            dataKey="in"
                            stroke="none"
                            fill="url(#gradientIn)"
                        />
                        <Area
                            type="monotone"
                            dataKey="out"
                            stroke="none"
                            fill="url(#gradientOut)"
                        />

                        <Line
                            type="monotone"
                            dataKey="in"
                            stroke="#FF4D94"
                            strokeWidth={3}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="out"
                            stroke="#38BDF8"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
