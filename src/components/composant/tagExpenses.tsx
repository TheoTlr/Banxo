"use client";

import React from "react";

interface Tag {
    id: number;
    nom: string;
}

interface Transaction {
    id: number;
    solde: number; // solde négatif = dépense
}

interface JTransactionTag {
    id: number;
    id_transaction: number;
    id_tag: number;
}

interface TagExpensesProps {
    tags: Tag[];
    transactions: Transaction[];
    joins: JTransactionTag[];
    totalSolde: number; // somme totale des soldes du compte
}

export default function TagExpenses({
                                        tags,
                                        transactions,
                                        joins,
                                        totalSolde,
                                    }: TagExpensesProps) {
    // Fonction pour calculer le total des dépenses d'un tag
    const getTagExpense = (tagId: number) => {
        // récupérer toutes les transactions liées au tag
        const linkedTransactions = joins
            .filter((j) => j.id_tag === tagId)
            .map((j) => transactions.find((t) => t.id === j.id_transaction))
            .filter((t): t is Transaction => t !== undefined);

        // ne garder que les dépenses (solde < 0)
        const expenses = linkedTransactions
            .filter((t) => t.solde < 0)
            .reduce((sum, t) => sum + Math.abs(t.solde), 0);

        return expenses;
    };

    return (
        <div className="shadow-card rounded-2xl h-full w-full p-4">
            {tags.map((tag) => {
                const expense = getTagExpense(tag.id);
                const percentage = totalSolde > 0 ? (expense / totalSolde) * 100 : 0;

                return (
                    <div key={tag.id} className="space-y-1">
                        {/* Nom + montant */}
                        <div className="flex justify-between text-sm">
                            <span className="text-text-primary">{tag.nom}</span>
                            <span className="text-text-secondary">{expense.toFixed(2)} €</span>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-96 bg-background-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brand-pink rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-text-secondary min-w-[3ch]">
                                {percentage.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
