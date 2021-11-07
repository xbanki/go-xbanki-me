import { defineConfig } from 'vite';

import vue  from '@vitejs/plugin-vue';
import path from 'path';


export default defineConfig(
  {
    plugins: [ vue() ],

    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src/'),
        '~': path.resolve(process.cwd())
      }
    },

    server: { open: true }
  }
);
