/// <reference types="vitest" />
import { defineConfig } from 'vite';
import p from './package.json';
import visualizer from 'rollup-plugin-visualizer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
export default defineConfig(({ mode }) => {
    const __isDev__ = mode === 'development';
    return {
        base: './',
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: './node_modules/@chinese-fonts/jxzk/dist/江西拙楷/*.{css,woff2}',
                        dest: 'font',
                    },
                ],
            }),
            // solidPlugin(),
            {
                enforce: 'pre',

                resolveId(id) {
                    if (id === 'viewerjs') {
                        return {
                            external: true,
                            id: 'https://cdn.jsdelivr.net/npm/viewerjs@1.11.2/dist/viewer.esm.min.js',
                        };
                    }
                },
                transform(code, id) {
                    // 兼容 worker 模式
                    if (!__isDev__ && id.includes('/src/worker/index')) {
                        return code.replace(/{[^{]*?type:\s*?'module',*?[^}]*?}/g, '');
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

                '/.netlify/functions/upload_auth':
                    'http://localhost:9999/.netlify/functions/upload_auth',
                '/.netlify/functions/status': 'http://localhost:9999/.netlify/functions/status',
            },
        },
        // resolve: {
        //     alias: {
        //         '@fontsource/material-icons-rounded/index.css': '/src/index.css',
        //         // '@cn-ui/animate': '/node_modules/@cn-ui/animate/src/index.tsx',
        //     },
        // },
        define: {
            __version__: JSON.stringify(p.version),
            __isDev__: JSON.stringify(__isDev__),
        },

        // build: {
        //     rollupOptions: {
        //         input: {
        //             index: './index.html',
        //             gallery: './gallery.html',
        //             notebook: './notebook.html',
        //         },
        //     },
        // },
        worker: { format: 'iife' },
    };
});
