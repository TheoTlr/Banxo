"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // utilitaire tailwind (optionnel)

interface CardStatsProps {
    title: string;
    amount: number;
    icon?: React.ReactNode;
    percentage?: number;
}

export default function CardStats({ title, amount, icon, percentage }: CardStatsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        "text-2xl font-bold",
                        amount >= 0 ? "text-primary" : "text-destructive"
                    )}
                >
                    {amount.toFixed(2)} €
                </div>
                {percentage !== undefined && (
                    <p className="text-xs text-muted-foreground">
                        {amount >= 0 ? "+" : ""}
                        {percentage.toFixed(1)}% du revenu total
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
