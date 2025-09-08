"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // adapte selon ton projet

interface Compte {
    id: number;
    nom: string;
}

interface Tag {
    id: number;
    nom: string;
}

interface DialogTransactionProps {
    comptes: Compte[];
    tags: Tag[];
}

export default function DialogTransaction({ comptes, tags }: DialogTransactionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        compte_id: 0,
        montant: "",
        description: "",
        tag_id: "",
        type_transaction: "expense" as "income" | "expense",
    });

    const addTransaction = async () => {
        if (!newTransaction.compte_id || !newTransaction.montant || !newTransaction.description || !newTransaction.tag_id) {
            alert("Merci de remplir tous les champs !");
            return;
        }

        // Insertion transaction
        const { data: inserted, error } = await supabase
            .from("transaction")
            .insert([
                {
                    compte_id: newTransaction.compte_id,
                    montant:
                        newTransaction.type_transaction === "expense"
                            ? -Math.abs(Number.parseFloat(newTransaction.montant))
                            : Number.parseFloat(newTransaction.montant),
                    description: newTransaction.description,
                    type_transaction: newTransaction.type_transaction,
                    date_transaction: new Date().toISOString().split("T")[0],
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Erreur Supabase:", error);
            return;
        }

        // Relier au tag
        await supabase.from("j_transaction_tag").insert([
            { transaction_id: inserted.id, tag_id: Number(newTransaction.tag_id) },
        ]);

        setNewTransaction({
            compte_id: 0,
            montant: "",
            description: "",
            tag_id: "",
            type_transaction: "expense",
        });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter une transaction
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouvelle Transaction</DialogTitle>
                    <DialogDescription>Ajoutez une nouvelle transaction à votre compte</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="compte">Compte</Label>
                        <Select
                            value={newTransaction.compte_id ? String(newTransaction.compte_id) : ""}
                            onValueChange={(value) => setNewTransaction({ ...newTransaction, compte_id: Number(value) })}
                        >
                            <SelectTrigger id="select-account">
                                <SelectValue placeholder="Choisir un compte" />
                            </SelectTrigger>
                            <SelectContent>
                                {comptes.map((compte) => (
                                    <SelectItem key={compte.id} value={String(compte.id)}>
                                        {compte.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={newTransaction.type_transaction}
                                onValueChange={(value: "income" | "expense") =>
                                    setNewTransaction({ ...newTransaction, type_transaction: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expense">Dépense</SelectItem>
                                    <SelectItem value="income">Revenu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Montant (€)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={newTransaction.montant}
                                onChange={(e) => setNewTransaction({ ...newTransaction, montant: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Description de la transaction"
                            value={newTransaction.description}
                            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tag">Tag</Label>
                        <Select
                            value={newTransaction.tag_id}
                            onValueChange={(value) => setNewTransaction({ ...newTransaction, tag_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un tag" />
                            </SelectTrigger>
                            <SelectContent>
                                {tags.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)}>
                                        {t.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={addTransaction} className="w-full">
                        Ajouter la transaction
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
