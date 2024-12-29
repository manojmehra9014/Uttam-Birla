import { Navigation } from "react-native-navigation";
import App from "./App";
import { Text, TextInput } from 'react-native';

if (Text.defaultProps == null) Text.defaultProps = {};
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;

Navigation.registerComponent('com.uttambirla', () => App);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'LoginScreen'
                        }
                    }
                ]
            }
        }
    });
});