import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import p from './package.json';

// https://astro.build/config
export default defineConfig({
    integrations: [solidJs(), tailwind()],
    // output: 'server',
});
