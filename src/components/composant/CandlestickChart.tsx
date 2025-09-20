"use client"

import React from "react"
import Chart from "react-apexcharts"

function generateMockData(days: number) {
    const candles: { x: Date; y: number[] }[] = []
    const volumes: { x: Date; y: number; fillColor: string }[] = []


    let price = 1.1

    for (let i = 0; i < days; i++) {
        const open = price
        const close = open + (Math.random() - 0.5) * 0.2
        const high = Math.max(open, close) + Math.random() * 0.1
        const low = Math.min(open, close) - Math.random() * 0.1

        const candle = {
            x: new Date(2025, 8, i + 1),
            y: [Number(open.toFixed(2)), Number(high.toFixed(2)), Number(low.toFixed(2)), Number(close.toFixed(2))],
        }

        candles.push(candle)

        // Volume color dépend du sens de la bougie
        const isBullish = close >= open
        const color = isBullish ? "var(--brand-blue)" : "var(--brand-pink)"

        volumes.push({
            x: candle.x,
            y: Math.floor(500 + Math.random() * 3000),
            fillColor: color,
        })

        price = close
    }

    return { candles, volumes }
}

const { candles, volumes } = generateMockData(60)

export default function CandlestickChart() {
    const series: ApexAxisChartSeries = [
        { name: "candle", type: "candlestick", data: candles },
        { name: "volume", type: "column", data: volumes },
    ]

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "candlestick",
            height: 350,
            background: "transparent", // on gère le fond avec Tailwind
            toolbar: { show: false },
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "var(--brand-blue)", // bleu de ton thème
                    downward: "var(--brand-pink)", // rose de ton thème
                },
                wick: {
                    useFillColor: true,
                }
            },
            bar: {
                columnWidth: "60%",
                distributed: true, // chaque barre prend la couleur définie dans data
            },
        },
        fill: {
            type: ["solid", "gradient"],
            gradient: {
                shade: "dark",
                type: "vertical",
                gradientToColors: ["transparent"], // dégradé vers transparent
                opacityFrom: 0.9,
                opacityTo: 0.2,
            },
        },
        colors: volumes.map((v) => v.fillColor),
        xaxis: {
            type: "datetime",
            labels: { style: { colors: "var(--text-secondary)" } },
        },
        yaxis: [
            {
                tooltip: { enabled: true },
                labels: { style: { colors: "var(--text-secondary)" } },
            },
            {
                opposite: true,
                seriesName: "volume",
                labels: { style: { colors: "var(--text-secondary)" } },
            },
        ],
        grid: {
            borderColor: "rgba(255,255,255,0.1)",
        },
        theme: { mode: "dark" },
        legend: { show: false },
    }

    return (
        <div className="rounded-xl bg-background-card p-4 shadow-md">
            <Chart options={options} series={series} type="candlestick" height={350} />
        </div>
    )
}
