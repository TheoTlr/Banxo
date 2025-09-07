"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleLogin = async () => {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            router.push("/") // redirige vers le tableau de bord
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-[400px] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Connexion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
