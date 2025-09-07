"use client"

import {useEffect, useState} from "react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {TrendingDown, TrendingUp, Wallet} from "lucide-react"
import {supabase} from "@/lib/supabaseClient";
import DialogCompte from "@/components/composant/dialogCompte"
import DialogTag from "@/components/composant/dialogTag";
import DialogTransaction from "@/components/composant/dialogTransaction";
import CardStats from "@/components/composant/cardStats";
import TransactionList from "@/components/composant/transactionList";
import TransactionCamembert from "@/components/composant/transactionCamembert";
import TimeGraph from "@/components/composant/timeGraph";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import ThemeToggle from "@/components/composant/themeToggle";
import YearGraph from "@/components/composant/yearGraph";
import TagExpenses from "@/components/composant/tagExpenses";
import Sidebar from "@/components/composant/sidebar";

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

const sampleTransactions = [
  {
    id: 1,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Hotel Garden",
    amount: 291,
    date: "13 Jan 2020",
  },
  {
    id: 2,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Plastic Factory",
    amount: 691,
    date: "13 Jan 2020",
  },
  {
    id: 3,
    type: "expense",
    title: "Transfer Deposit",
    subtitle: "Customer Andy",
    amount: 80,
    date: "13 Jan 2020",
  },
  {
    id: 4,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Hotel Garden",
    amount: 291,
    date: "13 Jan 2020",
  },
  {
    id: 5,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Plastic Factory",
    amount: 691,
    date: "13 Jan 2020",
  },
  {
    id: 6,
    type: "expense",
    title: "Transfer Deposit",
    subtitle: "Customer Andy",
    amount: 80,
    date: "13 Jan 2020",
  },
  {
    id: 7,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Hotel Garden",
    amount: 291,
    date: "13 Jan 2020",
  },
  {
    id: 8,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Plastic Factory",
    amount: 691,
    date: "13 Jan 2020",
  },
  {
    id: 9,
    type: "expense",
    title: "Transfer Deposit",
    subtitle: "Customer Andy",
    amount: 80,
    date: "13 Jan 2020",
  },
  {
    id: 10,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Hotel Garden",
    amount: 291,
    date: "13 Jan 2020",
  },
  {
    id: 11,
    type: "income",
    title: "Deposit Waste",
    subtitle: "Plastic Factory",
    amount: 691,
    date: "13 Jan 2020",
  },
  {
    id: 12,
    type: "expense",
    title: "Transfer Deposit",
    subtitle: "Customer Andy",
    amount: 80,
    date: "13 Jan 2020",
  },
];

const regionData = [
  { name: "Bojongsoang", value: 854, color: "#FF4D94" }, // rose
  { name: "Baleendah", value: 620, color: "#28D7A2" },  // vert
  { name: "Sukapura", value: 420, color: "#1FA2FF" },   // bleu
  { name: "Mekarsari", value: 300, color: "#8B5CF6" },  // violet
];

const data = [
  { day: "Monday", in: 700, out: 300 },
  { day: "Tuesday", in: 800, out: 400 },
  { day: "Wednesday", in: 500, out: 900 },
  { day: "Thursday", in: 300, out: 600 },
  { day: "Friday", in: 700, out: 200 },
  { day: "Saturday", in: 900, out: 500 },
  { day: "Sunday", in: 600, out: 700 },
];

const mockTags = [
  { id: 1, nom: "Courses" },
  { id: 2, nom: "Logement" },
  { id: 3, nom: "Loisirs" },
  { id: 4, nom: "Transport" },
];

const mockTransactions = [
  { id: 1, solde: -50 },   // courses
  { id: 2, solde: -200 },  // logement
  { id: 3, solde: -30 },   // transport
  { id: 4, solde: -70 },   // loisirs
  { id: 5, solde: 1500 },  // revenu salaire
  { id: 6, solde: -20 },   // courses
  { id: 7, solde: -15 },   // transport
];

// ✅ Table de jointure
const mockJoins = [
  { id: 1, id_transaction: 1, id_tag: 1 },
  { id: 2, id_transaction: 2, id_tag: 2 },
  { id: 3, id_transaction: 3, id_tag: 4 },
  { id: 4, id_transaction: 4, id_tag: 3 },
  { id: 5, id_transaction: 6, id_tag: 1 },
  { id: 6, id_transaction: 7, id_tag: 4 },
];

const totalSolde = mockTransactions.reduce((sum, t) => sum + t.solde, 0);

export default function BankingDashboard() {
  const router = useRouter()

  // 🔐 États d'auth
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Charger les comptes
  const [comptes, setComptes] = useState<Compte[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Compte>({
    id: 0,
    nom: "",
    proprietaire: "",
    solde: 0,
  })

  // Charger les tags
  const [tags, setTags] = useState<Tag[]>([])

  // Charger les transactions
  const [transactions, setTransactions] = useState<Transaction[]>([])

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

  // --- tes fonctions fetch --- //
  const fetchCompte = async () => {
    const { data, error } = await supabase.from("compte").select("*").order("solde")
    if (error) console.error(error)
    else if (data && data.length > 0) {
      setComptes(data)
      setSelectedAccount(data[0])
    }
  }

  const fetchTags = async () => {
    const { data, error } = await supabase.from("tag").select("*").order("nom")
    if (error) console.error(error)
    else setTags(data)
  }

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
          tag: tag ( id, nom )
        )
      `)
        .order("date_transaction", { ascending: false })

    if (error) {
      console.error(error)
    } else if (data) {
      const normalized = data.map((t: any) => ({
        ...t,
        tags: t.j_transaction_tag,
      }))
      setTransactions(normalized)
    }
  }

  // Initialisation (seulement si connecté)
  useEffect(() => {
    if (session) {
      fetchTransactions()
      fetchTags()
      fetchCompte()
    }
  }, [session])

  const handleChange = (value: string) => {
    const id = Number(value)
    setSelectedAccountId(id)
    const account = comptes.find((c) => c.id === id)
    if (account) {
      setSelectedAccount(account)
    }
  }

  // --- rendu conditionnel --- //
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          Chargement...
        </div>
    )
  }

  if (!session) {
    return null // en attendant redirection
  }

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
            <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/login")
                }}
            >
              Déconnexion
            </Button>

            <ThemeToggle/>
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

          <div className="grid lg:grid-cols-3 lg:grid-rows-[300px_360px] gap-4">
            {/* TransactionCamembert : 2 cols, 1 row */}
            <div className="col-span-1 row-span-1">
              <TransactionCamembert data={regionData} />
            </div>

            <div className="col-span-1 row-span-1">
              <TagExpenses tags={mockTags} transactions={mockTransactions} joins={mockJoins} totalSolde={totalSolde}/>
            </div>

            {/* TransactionList : 1 col, 2 rows */}
            <div className="col-span-1 row-span-2">
              <TransactionList transactions={sampleTransactions} />
            </div>

            {/* TimeGraph : 2 cols, 1 row */}
            <div className="col-span-2 row-span-1">
              <YearGraph/>
            </div>
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
        </main>
      </div>
  )
}
