"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionTT {
    id: number;
    type: "income" | "expense"; // income = bleu (entrée), expense = rouge (sortie)
    title: string;
    subtitle: string;
    amount: number;
    date: string;
}

interface TransactionListProps {
    transactions: TransactionTT[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    return (
        <div className="shadow-card rounded-2xl w-full p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-lg font-semibold text-text-primary">Last Transaction</h2>
                <button className="text-sm text-brand-blue hover:underline">See All</button>
            </div>

            {/* Transactions avec scroll */}
            <div className="space-y-2 overflow-y-auto flex-1 scrollbar-none">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="flex items-center justify-between bg-background-secondary hover:bg-background-border transition-colors p-3 rounded-xl"
                    >
                        {/* Icon + Text */}
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-3 rounded-full ${
                                    tx.type === "income"
                                        ? "bg-brand-blue/20 text-brand-blue"
                                        : "bg-brand-pink/20 text-brand-pink"
                                }`}
                            >
                                {tx.type === "income" ? (
                                    <ArrowUpRight className="w-5 h-5" />
                                ) : (
                                    <ArrowDownLeft className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <p className="text-text-primary font-medium">{tx.title}</p>
                                <p className="text-xs text-text-secondary">{tx.subtitle}</p>
                            </div>
                        </div>

                        {/* Amount + Date */}
                        <div className="text-right">
                            <p className="text-text-primary font-semibold">${tx.amount}</p>
                            <p className="text-xs text-text-secondary">{tx.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

