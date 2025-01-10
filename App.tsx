import { AppRegistry } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { name as appName } from './app.json';

import LoginScreen from './src/components/LoginScreen';
import SignUpScreen from './src/components/SignUpScreen';
import HomeScreen from './src/components/HomeScreen';
import ForgetPassScreen from './src/components/ForgetPassword';
import NavigationController from './src/components/NavigationController';
import CartScreen from './src/components/CartScreen';
import CouponScreen from './src/components/CouponScreen';
import SettingsScreen from './src/components/SettingScreen';
import GlobalAlert from './src/components/GlobalAlert';
Navigation.setDefaultOptions({
  topBar: {
    visible: false,
    height: 0,
  },
});

// Register screens with React Native Navigation
Navigation.registerComponent('LoginScreen', () => LoginScreen);
Navigation.registerComponent('SignUpScreen', () => SignUpScreen);
Navigation.registerComponent('HomeScreen', () => HomeScreen);
Navigation.registerComponent('ForgetPassScreen', () => ForgetPassScreen);
Navigation.registerComponent('NavigationController', () => NavigationController);
Navigation.registerComponent('CartScreen', () => CartScreen);
Navigation.registerComponent('CouponScreen', () => CouponScreen);
Navigation.registerComponent('SettingsScreen', () => SettingsScreen);
Navigation.registerComponent('GlobalAlert', () => GlobalAlert);

// Function to check authentication status and navigate accordingly
const initializeApp = async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'LoginScreen',
            },
          },
        ],
      },
    },
  });
};
initializeApp();
AppRegistry.registerComponent(appName, () => LoginScreen); // Register the LoginScreen as the root component
