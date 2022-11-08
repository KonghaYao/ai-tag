/// <reference types="vitest" />
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import p from './package.json';
import visualizer from 'rollup-plugin-visualizer';
import fs from 'fs';
export default defineConfig(({ mode }) => {
    return {
        base: './',
        plugins: [
            solidPlugin(),
            {
                enforce: 'pre',
                transformIndexHtml(code) {
                    return code.replace(
                        '<!-- Info Inject -->',
                        fs.readFileSync('./html/searchEngine.html', 'utf8')
                    );
                },
                resolveId(id) {
                    if (id === 'viewerjs') {
                        return {
                            external: true,
                            id: 'https://cdn.jsdelivr.net/npm/viewerjs/dist/viewer.esm.min.js',
                        };
                    }
                },
            },
            mode === 'analyze' &&
                (visualizer({ open: true, filename: 'visualizer/stat.html' }) as any),
        ],
        server: {
            port: 3000,
            proxy: {
                // 配合 netlify 的云函数
                '/.netlify/functions/notion_get':
                    'http://localhost:9999/.netlify/functions/notion_get',
                '/.netlify/functions/notion_create':
                    'http://localhost:9999/.netlify/functions/notion_create',
            },
        },
        resolve: {
            alias: {
                // '@cn-ui/sortable': './src/components/sortable/index',
                // viewerjs: 'https://unpkg.com/viewerjs',
            },
        },
        define: {
            __version__: JSON.stringify(p.version),
        },
        optimizeDeps: {
            include: [
                'lodash-es',
                'copy-to-clipboard',
                'viewerjs',
                '@vant/area-data',
                'mitt',
                'zxcvbn',
            ],
            exclude: ['@cn-ui/core'],
        },
        build: {
            rollupOptions: {
                input: {
                    index: './index.html',
                    gallery: './gallery.html',
                },
            },
        },
    };
});
