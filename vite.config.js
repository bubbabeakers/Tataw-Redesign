import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './src/lib/server/webSocketServer';

const config = {
	plugins: [sveltekit(), webSocketServer]
};

export default defineConfig(config);