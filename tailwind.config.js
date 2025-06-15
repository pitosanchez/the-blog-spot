/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'storyteller-cream': '#FAF4E8',
                'bodega-brick': '#C9482C',
                'community-teal': '#387D7A',
                'vintage-ink': '#2C2C2C',
            },
            fontFamily: {
                'display': ['Merriweather', 'serif'],
                'body': ['Space Grotesk', 'sans-serif'],
                'accent': ['DM Sans', 'sans-serif'],
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
} 