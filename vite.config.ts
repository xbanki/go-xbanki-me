import { createHtmlPlugin } from 'vite-plugin-html';
import { DateTime }         from 'luxon';
import { defineConfig }     from 'vite';

import vue  from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(
    {
        build: {
            minify: 'terser',
            terserOptions: { mangle: true }
        },

        define: {
            'LAST_BUILD_TIME': `'${DateTime.now().toRFC2822()}'`
        },

        plugins: [
            vue(),
            createHtmlPlugin()
        ],

        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), 'src/'),
                '~': path.resolve(process.cwd())
            }
        },

        server: { open: true, strictPort: true }
    }
);
