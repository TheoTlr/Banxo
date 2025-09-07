"use client"

import {
    Home,
    Users,
    Grid,
    Wallet,
    MapPin,
    Package,
    DollarSign,
    FileText,
} from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/composant/themeToggle";

const navItems = [
    { label: "Dashboard", icon: Home, href: "/" },
    { label: "Customer", icon: Users, href: "/customers" },
    { label: "Category", icon: Grid, href: "/categories" },
    { label: "Transaction", icon: Wallet, href: "/transactions" },
    { label: "Pick-up", icon: MapPin, href: "/pickup" },
    { label: "Stock", icon: Package, href: "/stock" },
    { label: "Financial", icon: DollarSign, href: "/financial" },
    { label: "Raport", icon: FileText, href: "/reports" },
]

export default function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col bg-background-sidebar">
            {/* Logo */}
            <div className="flex items-center gap-2 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-blue-400 font-bold">
                    W
                </div>
                <span className="text-lg font-semibold">WasteBank</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium  hover:bg-white/10 hover:text-white"
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm">
                        C
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Welcome,</span>
                        <span className="text-sm font-medium">WB Bersinar</span>
                        <ThemeToggle/>
                    </div>
                </div>
            </div>
        </aside>
    )
}
