import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            solidPlugin(),
            mode === 'analyze' &&
                (visualizer({ open: true, filename: 'visualizer/stat.html' }) as any),
        ],
        server: {
            port: 3000,
        },
        resolve: {
            alias: {
                '@cn-ui/core/index.css': '/src/style/index.css',
                '@cn-ui/core': '/src/index.ts',
            },
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
    };
});
