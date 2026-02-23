/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2563eb",
                secondary: "#475569",
                bgLight: "#f8fafc",
                bgDark: "#0f172a",
                surface: "#ffffff",
            }
        },
    },
    plugins: [],
}
