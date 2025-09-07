"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
                {icon && <div>{icon}</div>}
            </CardHeader>
            <CardContent>
                <div
                    className={"text-2xl font-bold"}
                >
                    {amount.toFixed(2)} €
                </div>
                {percentage !== undefined && (
                    <p className="text-xs">
                        {amount >= 0 ? "+" : ""}
                        {percentage.toFixed(1)}% du revenu total
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
