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
            'hooks': path.resolve(__dirname, './src/hooks'),
        },
    },
    optimizeDeps: {
        include: ['moment', 'moment/locale/vi'], // ép bundler giữ lại locale vi
    },
    build: {
        chunkSizeWarningLimit: 600, // Tăng cảnh báo chunk nếu cần
        rollupOptions: {
            output: {
                // Tách các thư viện lớn ra khỏi bundle chính
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('apexcharts')) {
                            return 'charts-vendor';
                        }
                        if (id.includes('lodash')) {
                            return 'lodash-vendor';
                        }
                        if (id.includes('axios')) return 'axios-vendor';
                        if (id.includes('moment')) return 'moment-vendor';
                        // Thêm các thư viện khác nếu muốn tách riêng
                        return 'vendor';
                    }
                },
            },
        },
    },
});
