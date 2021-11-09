import { defineConfig } from 'vite';

import vue  from '@vitejs/plugin-vue';
import path from 'path';


export default defineConfig(
    {
        build: {
            terserOptions: {
                mangle: true,
                parse: {
                    html5_comments: false
                }
            }
        },

        plugins: [vue()],

        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), 'src/'),
                '~': path.resolve(process.cwd())
            }
        },

        server: { open: true }
    }
);
