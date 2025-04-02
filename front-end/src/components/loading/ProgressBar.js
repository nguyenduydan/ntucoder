import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useLocation } from 'react-router-dom';

const ProgressBar = () => {
    const location = useLocation();

    useEffect(() => {
        // Start the progress bar whenever location changes
        NProgress.start();

        // Stop the progress bar when the navigation ends
        const timer = setTimeout(() => {
            NProgress.done();
        }, 300); // This will stop the progress bar after 300ms (you can adjust the timeout)

        return () => {
            clearTimeout(timer); // Clean up timeout if the component unmounts
        };
    }, [location]); // Dependency on location ensures it triggers on route change

    return null;
};

export default ProgressBar;
