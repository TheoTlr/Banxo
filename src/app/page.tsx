"use client"

import {useEffect, useState} from "react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {TrendingDown, TrendingUp, Wallet} from "lucide-react"
import {supabase} from "@/lib/supabaseClient";
import DialogCompte from "@/components/composant/dialogCompte"
import DialogTag from "@/components/composant/dialogTag";
import DialogTransaction from "@/components/composant/dialogTransaction";
import CardStats from "@/components/composant/cardStats";

interface Transaction {
  id: number
  compte_id: number
  montant: number
  description: string
  date_transaction: string
  type_transaction: "income" | "expense"
  tags: { tag: { id: number; nom: string } }[]
}

interface Tag {
  id: number
  nom: string
}

interface Compte {
  id: number,
  nom: string,
  solde: number,
  proprietaire: string,
}

export default function BankingDashboard() {
  // Charger les comptes
  const [comptes, setComptes] = useState<Compte[]>([])
  const fetchCompte = async () => {
    const { data, error } = await supabase.from("compte").select("*").order("solde")
    if (error) console.error(error)
    else {
      setComptes(data)
      setSelectedAccount(data[0])
    }
  }

  // Charger les tags
  const [tags, setTags] = useState<Tag[]>([])
  const fetchTags = async () => {
    const { data, error } = await supabase.from("tag").select("*").order("nom")
    if (error) console.error(error)
    else setTags(data)
  }

  // Charger les transactions
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const fetchTransactions = async () => {
    const { data, error } = await supabase
        .from("transaction")
        .select(`
        id,
        montant,
        description,
        date_transaction,
        type_transaction,
        j_transaction_tag (
          tag: tag (
            id, nom
          )
        )
      `)
        .order("date_transaction", { ascending: false })

    if (error) {
      console.error(error)
    } else {
      const normalized = data.map((t: any) => ({
        ...t,
        tags: t.j_transaction_tag,
      }))
      setTransactions(normalized)
    }
  }

  // Selection du compte qu'on affiche
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Compte>({
      id: 0,
      nom: "",
      proprietaire: "",
      solde: 0,
  });

  const handleChange = (value: string) => {
    const id = Number(value);
    setSelectedAccountId(id);
    const account = comptes.find((c) => c.id === id) ;
    if (account != null) {
      setSelectedAccount(account);
    }
  };

  // Initialisation
  useEffect(() => {
    fetchTransactions()
    fetchTags()
    fetchCompte()
  }, [])

  return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Bancaire</h1>
              <p className="text-muted-foreground">Gérez vos finances personnelles</p>
            </div>

            <div className="space-y-4">
              <Select value={selectedAccountId ? String(selectedAccountId) : ""} onValueChange={handleChange}>
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
            <DialogTransaction comptes={comptes} tags={tags} onTransactionCreated={fetchTransactions}/>
            <DialogTag onTagCreated={fetchTags} />
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <CardStats
                title="Solde Total"
                amount={selectedAccount.solde}
                percentage={2.5}
                icon={<Wallet className="h-4 w-4" />}
            />
            {/* Faire le calcul des transactions dans le mois pour afficher les revenus */}
            <CardStats
                title="Revenus"
                amount={selectedAccount.solde}
                percentage={4.4}
                icon={<TrendingUp className="h-4 w-4 text-primary" />}
            />
            {/* Faire le calcul des transactions dans le mois pour afficher les dépenses */}
            <CardStats
                title="Revenus"
                amount={-selectedAccount.solde}
                percentage={5.6}
                icon={<TrendingDown className="h-4 w-4 text-destructive" />}
            />
          </div>

          {/* Charts and Transactions */}
          {/*<div className="grid gap-6 lg:grid-cols-2">*/}
          {/*  /!* Charts *!/*/}
          {/*  <div className="space-y-6">*/}
          {/*    <Tabs defaultValue="pie" className="w-full">*/}
          {/*      <TabsList className="grid w-full grid-cols-3">*/}
          {/*        <TabsTrigger value="pie" className="gap-2">*/}
          {/*          <PieChartIcon className="h-4 w-4" />*/}
          {/*          Répartition*/}
          {/*        </TabsTrigger>*/}
          {/*        <TabsTrigger value="bar" className="gap-2">*/}
          {/*          <BarChart3 className="h-4 w-4" />*/}
          {/*          Catégories*/}
          {/*        </TabsTrigger>*/}
          {/*        <TabsTrigger value="line" className="gap-2">*/}
          {/*          <Calendar className="h-4 w-4" />*/}
          {/*          Évolution*/}
          {/*        </TabsTrigger>*/}
          {/*      </TabsList>*/}

          {/*      <TabsContent value="pie">*/}
          {/*        <Card>*/}
          {/*          <CardHeader>*/}
          {/*            <CardTitle>Répartition des Dépenses</CardTitle>*/}
          {/*            <CardDescription>Par catégorie ce mois-ci</CardDescription>*/}
          {/*          </CardHeader>*/}
          {/*          <CardContent>*/}
          {/*            <ResponsiveContainer width="100%" height={300}>*/}
          {/*              <PieChart>*/}
          {/*                <Pie*/}
          {/*                    data={pieChartData}*/}
          {/*                    cx="50%"*/}
          {/*                    cy="50%"*/}
          {/*                    labelLine={false}*/}
          {/*                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}*/}
          {/*                    outerRadius={80}*/}
          {/*                    fill="#8884d8"*/}
          {/*                    dataKey="value"*/}
          {/*                >*/}
          {/*                  {pieChartData.map((entry, index) => (*/}
          {/*                      <Cell key={`cell-${index}`} fill={entry.color} />*/}
          {/*                  ))}*/}
          {/*                </Pie>*/}
          {/*                <Tooltip formatter={(value) => [`${value} €`, "Montant"]} />*/}
          {/*              </PieChart>*/}
          {/*            </ResponsiveContainer>*/}
          {/*          </CardContent>*/}
          {/*        </Card>*/}
          {/*      </TabsContent>*/}

          {/*      <TabsContent value="bar">*/}
          {/*        <Card>*/}
          {/*          <CardHeader>*/}
          {/*            <CardTitle>Dépenses par Catégorie</CardTitle>*/}
          {/*            <CardDescription>Montants détaillés</CardDescription>*/}
          {/*          </CardHeader>*/}
          {/*          <CardContent>*/}
          {/*            <ResponsiveContainer width="100%" height={300}>*/}
          {/*              <BarChart data={pieChartData}>*/}
          {/*                <CartesianGrid strokeDasharray="3 3" />*/}
          {/*                <XAxis dataKey="name" />*/}
          {/*                <YAxis />*/}
          {/*                <Tooltip formatter={(value) => [`${value} €`, "Montant"]} />*/}
          {/*                <Bar dataKey="value" fill="hsl(var(--primary))" />*/}
          {/*              </BarChart>*/}
          {/*            </ResponsiveContainer>*/}
          {/*          </CardContent>*/}
          {/*        </Card>*/}
          {/*      </TabsContent>*/}
          {/*    </Tabs>*/}
          {/*  </div>*/}

          {/*  /!* Recent Transactions *!/*/}
          {/*  <Card>*/}
          {/*    <CardHeader>*/}
          {/*      <CardTitle className="flex items-center gap-2">*/}
          {/*        <CreditCard className="h-5 w-5" />*/}
          {/*        Transactions Récentes*/}
          {/*      </CardTitle>*/}
          {/*      <CardDescription>Vos dernières opérations</CardDescription>*/}
          {/*    </CardHeader>*/}
          {/*    <CardContent>*/}
          {/*      <div className="space-y-4">*/}
          {/*        {transactions.slice(0, 8).map((transaction) => (*/}
          {/*            <div key={transaction.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">*/}
          {/*              <div className="flex-1">*/}
          {/*                <p className="font-medium text-sm">{transaction.description}</p>*/}
          {/*                <div className="flex items-center gap-2 mt-1">*/}
          {/*                  {transaction.tags.map((rel) => (*/}
          {/*                      <Badge*/}
          {/*                          key={rel.tag.id}*/}
          {/*                          variant="secondary"*/}
          {/*                          className="text-xs"*/}
          {/*                      >*/}
          {/*                        {rel.tag.nom}*/}
          {/*                      </Badge>*/}
          {/*                  ))}*/}
          {/*                  <span className="text-xs text-muted-foreground">{transaction.date_transaction}</span>*/}
          {/*                </div>*/}
          {/*              </div>*/}
          {/*              <div className={`font-bold ${transaction.type_transaction === "income" ? "text-primary" : "text-destructive"}`}>*/}
          {/*                {transaction.type_transaction === "income" ? "+" : ""}*/}
          {/*                {transaction.montant.toFixed(2)} €*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*        ))}*/}
          {/*      </div>*/}
          {/*    </CardContent>*/}
          {/*  </Card>*/}
          {/*</div>*/}
        </div>
      </div>
  )
}
