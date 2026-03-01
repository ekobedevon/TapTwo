import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			body: '#3F4041',
			primary: '#2B7FFF',
			secondary: '#EFF6FF',
			unselected: '#595A5A',
			background: '#f9fcfd',
			logo: '#2B7FFF'
		},
		extend: {
			// colors: {
				// text: '#0e1316',
				// background: '#f8fbfc',
				// primary: '#4193c3',
				// secondary: '#aac6d5',
				// accent: '#7dacca',
				// text_dark: '#e9eef1',
				// background_dark: '#030607',
				// primary_dark: '#3c8ebe',
				// secondary_dark: '#2a4655',
				// accent_dark: '#356582'
			// },
			screens: {
				'3xl': '1920px', // 1080p monitor
				'4xl': '2560px' // 1440p monitor
			}
		}
	},

	plugins: [typography, forms]
} satisfies Config;
