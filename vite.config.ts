import { createHtmlPlugin } from 'vite-plugin-html';
import { DateTime }         from 'luxon';
import { defineConfig }     from 'vite';

import md   from '@jackfranklin/rollup-plugin-markdown';
import vue  from '@vitejs/plugin-vue';
import path from 'path';

import licensePlugin from './license_plugin';

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
            md(),
            vue(),
            licensePlugin(),
            createHtmlPlugin()
        ],

        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), 'src/'),
                '~': path.resolve(process.cwd())
            }
        },

        server: { open: true, strictPort: true, host: true }
    }
);
