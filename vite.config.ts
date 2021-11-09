import { defineConfig } from 'vite';

import vue  from '@vitejs/plugin-vue';
import html from 'vite-plugin-html';
import path from 'path';


export default defineConfig(
    {
        build: {
            terserOptions: { mangle: true }
        },

        plugins: [
            vue(),
            html()
        ],

        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), 'src/'),
                '~': path.resolve(process.cwd())
            }
        },

        server: { open: true }
    }
);
