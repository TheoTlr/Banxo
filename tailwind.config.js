//tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "var(--background)",
                    secondary: "var(--background-secondary)",
                    card: "var(--background-card)",
                    border: "var(--background-border)",
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                },
                brand: {
                    blue: "var(--brand-blue)",
                    pink: "var(--brand-pink)",
                    purple: "var(--brand-purple)",
                },
            },
            boxShadow: {
                card: "0 4px 20px rgba(0,0,0,0.3)", },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.5rem",
            },
        },
    },
    plugins: [], };