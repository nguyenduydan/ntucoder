import { useEffect } from 'react';
import NProgress from 'nprogress';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProgressBar = () => {
    const location = useLocation();
    const { isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) {
            NProgress.start();
        } else {
            NProgress.done();
        }
    }, [isLoading]);

    // Nếu muốn vẫn kích hoạt khi route đổi, giữ cái này
    useEffect(() => {
        NProgress.start();
        const timer = setTimeout(() => {
            if (!isLoading) {
                NProgress.done();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [location]);

    return null;
};

export default ProgressBar;
