import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        hmr: {
            overlay: true,
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'components': path.resolve(__dirname, './src/components'),
            'contexts': path.resolve(__dirname, './src/contexts'),
            'utils': path.resolve(__dirname, './src/utils'),
            'views': path.resolve(__dirname, './src/views'),
            'layouts': path.resolve(__dirname, './src/layouts'),
            'config': path.resolve(__dirname, './src/config'),
            'assets': path.resolve(__dirname, './src/assets'),
            'routes': path.resolve(__dirname, './src/routes'),
            'theme': path.resolve(__dirname, './src/theme'),
        },
    },
});
