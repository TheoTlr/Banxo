"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // adapte l'import selon ton projet

interface Compte {
    id: number;
    nom: string;
    proprietaire: string;
    solde: number;
}

interface DialogCompteProps {
    onAccountCreated: () => void; // callback pour refresh les comptes après ajout
}

export default function DialogCompte({ onAccountCreated }: DialogCompteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newCompte, setNewCompte] = useState({
        nom: "",
        proprietaire: "",
        solde: 0,
    });

    const addAccount = async () => {
        const { error } = await supabase.from("compte").insert([newCompte]);
        if (error) {
            console.error("Erreur Supabase:", JSON.stringify(error, null, 2));
            return;
        }

        setIsOpen(false);
        setNewCompte({ nom: "", proprietaire: "", solde: 0 });
        onAccountCreated(); // refresh depuis la page parent
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Ajouter un compte
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouveau Compte</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="account-name">Nom du compte</Label>
                        <Input
                            id="account-name"
                            placeholder="Ex: Compte courant"
                            value={newCompte.nom}
                            onChange={(e) => setNewCompte({ ...newCompte, nom: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account-owner">Propriétaire</Label>
                        <Input
                            id="account-owner"
                            placeholder="Ex: Jean Dupont"
                            value={newCompte.proprietaire}
                            onChange={(e) => setNewCompte({ ...newCompte, proprietaire: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account-balance">Solde (€)</Label>
                        <Input
                            id="account-balance"
                            type="number"
                            placeholder="0.00"
                            value={newCompte.solde}
                            onChange={(e) => setNewCompte({ ...newCompte, solde: Number(e.target.value) })}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            if (!newCompte.nom || !newCompte.proprietaire) {
                                alert("Merci de remplir tous les champs !");
                                return;
                            }
                            addAccount();
                        }}
                        className="w-full"
                    >
                        Créer le compte
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
