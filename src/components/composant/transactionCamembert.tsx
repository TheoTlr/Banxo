"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, User } from "lucide-react";

interface RegionData {
    name: string;
    value: number;
    color: string;
}

interface CustomerRegionChartProps {
    data: RegionData[];
}

export default function TransactionCamembert({ data }: CustomerRegionChartProps) {
    return (
        <div className="card w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold mb-6">
                    Customer based region
                </h2>
                <div className="flex items-center gap-6">
                    <button className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                        {"<"}
                    </button>
                    <button className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                        {">"}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Donut chart */}
                <div className="w-40 h-40">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={5}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const { name, value } = payload[0].payload;
                                        return (
                                            <div className="bg-[#1A1C2C] text-white text-sm rounded-lg px-3 py-2 shadow-lg">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-300" />
                                                    {name}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <User className="w-4 h-4 text-gray-300" />
                                                    {value}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                    {data.map((entry, i) => (
                        <div key={i} className="flex items-center gap-2">
              <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
              />
                            <span className="text-gray-300 text-sm">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
