/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fall': 'fall linear forwards',
            },
            keyframes: {
                fall: {
                    '0%': { transform: 'translateY(-10%)' },
                    '100%': { transform: 'translateY(110%)' },
                }
            }
        },
    },
    plugins: [],
}
