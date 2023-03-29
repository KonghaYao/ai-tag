import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import p from './package.json';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://magic-tag.netlify.app',
    integrations: [solidJs(), tailwind(), sitemap()],
    // output: 'server',
});
