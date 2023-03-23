import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import p from './package.json';
// https://astro.build/config
export default defineConfig({
    integrations: [solidJs(), tailwind()],

    vite: defineConfig(({ mode }) => {
        const __isDev__ = mode === 'development';
        console.log(mode);
        return {
            define: {
                __version__: JSON.stringify(p.version),
                __isDev__: JSON.stringify(__isDev__),
            },
            envPrefix: 'VITE_',
            worker: { format: 'iife' },
        };
    }),
});
