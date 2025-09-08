"use client"

import { create } from "zustand"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"

interface Transaction {
    id: number
    compte_id: number
    montant: number
    description: string
    date_transaction: string
    type_transaction: "REVENU" | "DEPENSE"
    tags: { tag: { id: number; nom: string, couleur: string } }[]
}

interface Tag {
    id: number
    nom: string
    color: string
}

interface Compte {
    id: number
    nom: string
    solde: number
    proprietaire: string
}

interface BankingState {
    comptes: Compte[]
    comptesMonth: Record<string, number[]>
    tags: Tag[]
    transactions: Transaction[]
    selectedAccount: Compte | null

    fetchCompte: () => Promise<void>
    fetchCompteMonth: () => Promise<void>
    fetchTags: () => Promise<void>
    fetchTransactions: () => Promise<void>
    setSelectedAccount: (id: number) => void
}

export const useBankingStore = create<BankingState>((set, get) => ({
    comptes: [],
    comptesMonth: {},
    tags: [],
    transactions: [],
    selectedAccount: null,

    fetchCompte: async () => {
        const { data, error } = await supabase.from("compte").select("*").order("solde")
        if (error) {
            console.error(error)
            return
        }
        if (data && data.length > 0) {
            set({ comptes: data, selectedAccount: data[0] })
        }
    },

    fetchCompteMonth: async () => {
        const { data, error } = await supabase
            .from("compte_month")
            .select(
                `
        *,
        compte_id (
          proprietaire
        )
      `
            )
            .order("proprietaire", { referencedTable: "compte_id" })

        if (error) {
            console.error(error)
            return
        }

        if (data && data.length > 0) {
            const monthsOrder = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ]

            const record: Record<string, number[]> = {}
            monthsOrder.forEach((m) => {
                record[m] = []
            })

            data.forEach((cm: any) => {
                const userId = cm.compte_id?.proprietaire
                if (userId == null) return
                const month = format(new Date(cm.date), "MMM")
                if (!record[month]) {
                    record[month] = []
                }
                record[month].push(cm.montant)
            })

            monthsOrder.forEach((m) => {
                if (record[m][0] == null) record[m][0] = 0
                if (record[m][1] == null) record[m][1] = 0
            })

            set({ comptesMonth: record })
        }
    },

    fetchTags: async () => {
        const { data, error } = await supabase.from("tag").select("*").order("nom")
        if (error) {
            console.error(error)
            return
        }
        set({ tags: data || [] })
    },

    fetchTransactions: async () => {
        const { data, error } = await supabase
            .from("transaction")
            .select(`
        id,
        montant,
        description,
        date_transaction,
        type_transaction,
        j_transaction_tag (
          tag: tag ( id, nom, couleur )
        )
      `)
            .gte("date_transaction", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
            .lte("date_transaction", new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString())
            .order("date_transaction", { ascending: false })

        if (error) {
            console.error(error)
            return
        }
        if (data) {
            const normalized = data.map((t: any) => ({
                ...t,
                tags: t.j_transaction_tag,
            }))
            set({ transactions: normalized })
        }
    },

    setSelectedAccount: (id: number) => {
        const { comptes } = get()
        const account = comptes.find((c) => c.id === id) || null
        set({ selectedAccount: account })
    },
}))
