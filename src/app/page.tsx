"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import DialogCompte from "@/components/composant/dialogCompte"
import DialogTag from "@/components/composant/dialogTag"
import DialogTransaction from "@/components/composant/dialogTransaction"
import CardStats from "@/components/composant/cardStats"
import TransactionList from "@/components/composant/transactionList"
import TransactionCamembert from "@/components/composant/transactionCamembert"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/composant/themeToggle"
import YearGraph from "@/components/composant/yearGraph"
import TagExpenses from "@/components/composant/tagExpenses"
import Sidebar from "@/components/composant/sidebar"
import { useBankingStore } from "@/store/bankingStore"
import CandlestickChart from "@/components/composant/CandlestickChart";

const regionData = [
  { name: "Bojongsoang", value: 854, color: "#FF4D94" },
  { name: "Baleendah", value: 620, color: "#28D7A2" },
  { name: "Sukapura", value: 420, color: "#1FA2FF" },
  { name: "Mekarsari", value: 300, color: "#8B5CF6" },
]

export default function BankingDashboard() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const {
    comptes,
    tags,
    selectedAccount,
    fetchCompte,
    fetchCompteMonth,
    fetchTransactions,
    setSelectedAccount,
  } = useBankingStore()

  // Vérif session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/login")
      } else {
        setSession(data.session)
      }
      setLoading(false)
    }
    getSession()
  }, [router])

  // Fetch init
  useEffect(() => {
    if (session) {
      fetchCompte()
      fetchCompteMonth()
      fetchTransactions()
    }
  }, [session, fetchCompte, fetchCompteMonth, fetchTransactions])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  if (!session) return null

  return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-background md:p-6">
          <div className="bg-background md:p-6">
            <div className="mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Bancaire</h1>
                  <p className="text-muted-foreground">Gérez vos finances personnelles</p>
                </div>

                <div className="space-y-4">
                  <Select
                      value={selectedAccount ? String(selectedAccount.id) : ""}
                      onValueChange={(value) => setSelectedAccount(Number(value))}
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

                <DialogCompte onAccountCreated={fetchCompte} />
                <DialogTransaction comptes={comptes} tags={tags} />
                <DialogTag />
                <Button
                    variant="outline"
                    onClick={async () => {
                      await supabase.auth.signOut()
                      router.push("/login")
                    }}
                >
                  Déconnexion
                </Button>

                <ThemeToggle />
              </div>

              {/* Overview Cards */}
              {selectedAccount && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <CardStats
                        title="Solde Total"
                        amount={selectedAccount.solde}
                        percentage={2.5}
                        icon={<Wallet className="h-4 w-4" />}
                    />
                    <CardStats
                        title="Revenus"
                        amount={selectedAccount.solde}
                        percentage={4.4}
                        icon={<TrendingUp className="h-4 w-4 text-primary" />}
                    />
                    <CardStats
                        title="Dépenses"
                        amount={-selectedAccount.solde}
                        percentage={5.6}
                        icon={<TrendingDown className="h-4 w-4 text-destructive" />}
                    />
                  </div>
              )}

              <div className="grid lg:grid-cols-3 lg:grid-rows-[300px_360px] gap-4">
                <div className="col-span-1 row-span-1">
                  <TransactionCamembert data={regionData} />
                </div>

                <div className="col-span-1 row-span-1">
                  <TagExpenses tags={[]} transactions={[]} joins={[]} totalSolde={0} />
                </div>

                <div className="col-span-1 row-span-2">
                  <TransactionList />
                </div>

                <div className="col-span-2 row-span-1">
                  <CandlestickChart />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
