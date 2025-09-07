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
        <div className="bg-background-card p-6 rounded-2xl shadow-lg w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Waste In & Out</h2>
                <div className="flex items-center gap-3 text-sm">
                    <span>7 Days</span>
                    <Heart className="w-4 h-4 text-brand-pink" />
                </div>
            </div>

            {/* Chart */}
            <div className="h-60">
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2D45" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#6B7280"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#6B7280"
                            tick={{ fill: "#9CA3AF", fontSize: 12 }}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1A1C2C",
                                borderRadius: "8px",
                                border: "none",
                                color: "#fff",
                            }}
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
