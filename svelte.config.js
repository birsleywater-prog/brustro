import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const trustedOrigins = (env.ORIGIN || '')
	.split(';')
	.map((o) => o.trim())
	.filter(Boolean);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	onwarn: (warning, handler) => {
		if (warning.code.startsWith('a11y_')) {
			return;
		}
		handler(warning);
	},
	kit: {
		adapter: adapter(),
		csrf: {
			trustedOrigins: trustedOrigins
		}
	}
};

export default config;
