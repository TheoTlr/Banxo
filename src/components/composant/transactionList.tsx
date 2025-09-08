"use client";

import {ArrowDownLeft, ArrowUpRight} from "lucide-react";
import {useBankingStore} from "@/store/bankingStore";

export default function TransactionList() {
    const transactions = useBankingStore((state) => state.transactions)
    console.log("Transaction :", transactions)


    return (
        <div className="shadow-card rounded-2xl w-full p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-lg font-semibold text-text-primary">Transaction du mois</h2>
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
                                    tx.type_transaction === "REVENU"
                                        ? "bg-brand-blue/20 text-brand-blue"
                                        : "bg-brand-pink/20 text-brand-pink"
                                }`}
                            >
                                {tx.type_transaction === "REVENU" ? (
                                    <ArrowUpRight className="w-5 h-5" />
                                ) : (
                                    <ArrowDownLeft className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <p className="text-text-primary font-medium">{tx.description}</p>
                                <p className="text-xs text-text-secondary">{tx.tags.map((t) => t.tag.nom).join(", ")}</p>
                            </div>
                        </div>

                        {/* Amount + Date */}
                        <div className="text-right">
                            <p className="text-text-primary font-semibold">{tx.montant}€</p>
                            <p className="text-xs text-text-secondary">{tx.date_transaction}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

