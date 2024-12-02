import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import { NativeBaseProvider, Spinner } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import i18n from '../services/i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { fetchData, postData } from '../services/apiService';


Icon.loadFont();

const LoginScreen = ({ componentId }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { t, i18n } = useTranslation();
    const [spinner, showSpinner] = useState('fasle');
    const [language, setLanguage] = useState('en'); // Default language is 'en'

    // Change language function
    const changeLanguage = async (language) => {
        i18n.changeLanguage(language);
        setLanguage(language);
        try {
            // Save selected language to AsyncStorage
            await AsyncStorage.setItem('selectedLanguage', language);
        } catch (error) {
            console.error('Error saving language to AsyncStorage', error);
        }
    };

    useEffect(() => {
        // Hide splash screen once app is loaded
        SplashScreen.hide();

        // Retrieve language from AsyncStorage
        const getLanguageFromStorage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
                if (savedLanguage) {
                    // If a saved language exists, apply it
                    i18n.changeLanguage(savedLanguage);
                    setLanguage(savedLanguage);
                }
            } catch (error) {
                console.error('Error loading language from AsyncStorage', error);
            }
        };

        getLanguageFromStorage();

        Navigation.setDefaultOptions({
            topBar: {
                visible: false, // Disable the top bar globally
                height: 0,      // Optional: Set height to 0
            },
        });
    }, []);

    const handleLogin = async () => {
        if (email && phone && password) {
            showSpinner(true);
            const payload = {
                "phone": phone,
                "email": email,
                "password": password,
            };
            const response = await postData('/user/login', payload);
            if (response.success) {
                Navigation.push(componentId, {
                    component: {
                        name: 'NavigationController',
                    },
                });
            } else {
                alert("Something went wrong!");
            }
            showSpinner(false);
        } else {
            await setAuthentication(false);
            alert(t('fillAllFields'));
        }
    };

    return (
        <I18nextProvider i18n={i18n}>
            <SafeAreaProvider>
                <NativeBaseProvider>
                    <View style={{ height: "100%" }}>
                        <TouchableOpacity
                            style={styles.languageIconContainer}
                            onPress={() => changeLanguage(language === 'en' ? 'hi' : 'en')}
                        >
                            <Icon name="language" size={40} color="#1230AE" />
                        </TouchableOpacity>
                        <View style={styles.containerimage}>
                            <Image
                                source={require('../assets/image/logo.png')}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.container}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('phonePlaceholder')}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholderTextColor="#AAAAAA"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={t('emailPlaceholder')}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                placeholderTextColor="#AAAAAA"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder={t("password")}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor="#AAAAAA"
                            />

                            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                                <Text style={styles.buttonText}>{t("login")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                Navigation.push(componentId, {
                                    component: {
                                        name: 'ForgetPassScreen',
                                    },
                                });
                            }} style={styles.forgetbutton}>
                                <Text style={styles.forgetbuttonText}>{t("forgetPassword")}</Text>
                            </TouchableOpacity>

                            <Text
                                style={styles.switchToLogin}
                                onPress={() => {
                                    Navigation.push(componentId, {
                                        component: {
                                            name: 'SignUpScreen',
                                        },
                                    });
                                }}
                            >
                                {t("dontHaveAccount")}
                            </Text>
                        </View>
                    </View>
                </NativeBaseProvider>
            </SafeAreaProvider>
        </I18nextProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    containerimage: {
        backgroundColor: '#fff',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 400,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        padding: 12,
        marginBottom: 10,
        borderRadius: 30,
        borderColor: '#1230AE',
        backgroundColor: '#FFFFFF',
        color: "#1230AE"
    },
    button: {
        width: '90%',
        marginTop: 100,
        backgroundColor: "#1230AE",
        borderRadius: 40,
        height: '8%',
        justifyContent: "center",
        alignItems: "center"
    },
    forgetbutton: {
        width: '90%',
        backgroundColor: "#fff",
        borderRadius: 40,
        height: '8%',
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#1230AE"
    },
    buttonText: {
        color: '#fff',
    },
    forgetbuttonText: {
        color: '#1230AE',
    },
    switchToLogin: {
        textAlign: 'center',
        marginTop: 40,
        color: '#1230AE',
        textDecorationLine: 'underline',
    },
    languageIconContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    languagePickerContainer: {
        width: '80%',
        marginTop: 20,
    },
    languagePicker: {
        height: 50,
        width: '100%',
        borderColor: '#1230AE',
        borderWidth: 1,
        borderRadius: 10,
        color: '#1230AE',
    },
});

export default LoginScreen;
