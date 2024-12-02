import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { setupNavigation } from '../navigation/Navigation'; // Import navigation setup

const Routes = () => {
    useEffect(() => {
        setupNavigation();
    }, []);

    return null;
};
export default Routes;
