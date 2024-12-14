import { AppRegistry } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { name as appName } from './app.json';
import { checkAuthentication } from './src/services/authService'; // Import authentication check service
// Disable font scaling globally for all Text and TextInput components

// Import your screens
import LoginScreen from './src/components/LoginScreen';
import SignUpScreen from './src/components/SignUpScreen';
import HomeScreen from './src/components/HomeScreen';
import ForgetPassScreen from './src/components/ForgetPassword';
import NavigationController from './src/components/NavigationController';

// Set default options for navigation
Navigation.setDefaultOptions({
  topBar: {
    visible: false, // Hide top bar for all screens
    height: 0, // Set top bar height to 0
  },
});

// Register screens with React Native Navigation
Navigation.registerComponent('LoginScreen', () => LoginScreen);
Navigation.registerComponent('SignUpScreen', () => SignUpScreen);
Navigation.registerComponent('HomeScreen', () => HomeScreen);
Navigation.registerComponent('ForgetPassScreen', () => ForgetPassScreen);
Navigation.registerComponent('NavigationController', () => NavigationController);

// Function to check authentication status and navigate accordingly
const initializeApp = async () => {
  const isAuthenticated = await checkAuthentication();
  console.log(isAuthenticated);
  // Set the root navigation based on authentication status
  if (false) {
    // If authenticated, show HomeScreen
    Navigation.setRoot({
      root: {
        bottomTabs: {
          children: [
            {
              stack: {
                children: [
                  {
                    component: {
                      name: 'HomeScreen',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: 'Home',
                  },
                },
              },
            },
          ],
        },
      },
    });
  } else {
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
  }
};

// Initialize the app
initializeApp();

// Register the app
AppRegistry.registerComponent(appName, () => LoginScreen); // Register the LoginScreen as the root component
