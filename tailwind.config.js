/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['"Plus Jakarta Sans"', 'sans-serif']
            },
            colors: {
                brand: {
                    50: 'var(--brand-50, #e0f4ff)',
                    100: 'var(--brand-100, #b3e5fc)',
                    200: 'var(--brand-200, #81d4fa)',
                    300: 'var(--brand-300, #4fc3f7)',
                    400: 'var(--brand-400, #29b6f6)',
                    500: 'var(--brand-500, #0077B6)',
                    600: 'var(--brand-600, #0069a3)',
                    700: 'var(--brand-700, #005a8f)',
                    800: 'var(--brand-800, #004b7a)',
                    900: 'var(--brand-900, #023E8A)',
                },
                water: {
                    light: 'var(--water-light, #CAF0F8)',
                    mid: 'var(--water-mid, #90E0EF)',
                    dark: 'var(--water-dark, #0096C7)',
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' }
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                }
            }
        }
    },
    plugins: []
}
