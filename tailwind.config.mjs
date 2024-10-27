/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // mode: 'jit',
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [require('@corvu/tailwind')],
}
