"use client";

import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";
import {useBankingStore} from "@/store/bankingStore";

export default function TransactionCamembert() {
    const transactions = useBankingStore((state) => state.transactions)

    const regionData = transactions
        .filter(t => t.type_transaction === "DEPENSE")
        .reduce((acc: { name: string; value: number; color: string }[], t) => {
        t.tags.forEach((rel) => {
            const tag = rel.tag
            const existing = acc.find((item) => item.name === tag.nom)
            if (existing) {
                existing.value += t.montant
            } else {
                acc.push({
                    name: tag.nom,
                    value: t.montant,
                    color: tag.couleur || "#888888", // couleur par défaut si elle n’existe pas
                })
            }
        })
        return acc
    }, [])

    return (
        <div className="shadow-card rounded-2xl h-full w-full p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold mb-6">
                    Dépenses Mensuel
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
                                data={regionData}
                                dataKey="value"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={5}
                            >
                                {regionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                    {regionData.map((entry, i) => (
                        <div key={i} className="flex items-center gap-2">
              <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
              />
                            <span className="text-sm">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
