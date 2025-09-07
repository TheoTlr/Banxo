//tailwind.config.js
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "#111322",
                    secondary: "#1A1C2C",
                    card: "#1F2233",
                    border: "#2A2D45",
                },
                text: {
                    primary: "#F9FAFB",
                    secondary: "#9CA3AF",
                },
                brand: {
                    blue: "#38BDF8",
                    pink: "#FF4D94",
                    purple: "#A855F7",
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