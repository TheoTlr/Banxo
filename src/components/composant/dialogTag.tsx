"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // adapte selon ton projet


export default function DialogTag() {
    const [isOpen, setIsOpen] = useState(false);
    const [newTag, setNewTag] = useState("");

    const addTag = async () => {
        if (!newTag.trim()) return;

        const { error } = await supabase.from("tag").insert([{ nom: newTag }]);
        if (error) {
            console.error("Erreur Supabase:", JSON.stringify(error, null, 2));
            return;
        }

        setNewTag("");
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <FolderPlus className="h-4 w-4" />
                    Ajouter un tag
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouveau Tag</DialogTitle>
                    <DialogDescription>Ajoutez un nouveau tag personnalisé</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-tag">Nom du tag</Label>
                        <Input
                            id="new-tag"
                            placeholder="Ex: Abonnements"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                        />
                    </div>
                    <Button onClick={addTag} className="w-full">
                        Ajouter le tag
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
