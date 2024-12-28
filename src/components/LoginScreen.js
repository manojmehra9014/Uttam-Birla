import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider, useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData, postData } from '../services/apiService';
import { setAuthentication } from '../services/authService';
import Spinner from 'react-native-loading-spinner-overlay';
Icon.loadFont();
import i18n from '../services/i18n';
import utils from '../services/utils';

const LoginScreen = ({ componentId }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();
    const [spinner, showSpinner] = useState('fasle');
    const [language, setLanguage] = useState('en');

    const changeLanguage = async (language) => {
        i18n.changeLanguage(language);
        setLanguage(language);
        try {
            await AsyncStorage.setItem('selectedLanguage', language);
        } catch (error) {
            console.error('Error saving language to AsyncStorage', error);
        }
    };

    useEffect(() => {
        SplashScreen.hide();
        const getLanguageFromStorage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
                const phone = await AsyncStorage.getItem('phone')
                const password = await AsyncStorage.getItem('password');
                if (phone && password) {
                    setPhone(phone);
                    setPassword(password);
                    handleLogin(phone, password);
                }
                if (savedLanguage) {
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
                visible: false,
                height: 0,
            },
        });
    }, []);

    const handleLogin = async (phone, password) => {
        if (phone && password) {
            showSpinner(true);
            const payload = {
                "phone": phone,
                "password": password,
            };
            try {
                const response = await postData('user/login', payload);
                showSpinner(false);
                if (response.status) {
                    await AsyncStorage.setItem('phone', phone);
                    await AsyncStorage.setItem('password', password);
                    utils.token = response?.data?.access_token;
                    utils.userType = response?.data?.data?.userType;
                    utils.agentId = response?.data?.data?._id;
                    Navigation.push(componentId, {
                        component: {
                            name: 'NavigationController',
                        },
                    });
                } else {
                    showSpinner(false);
                    Alert.alert(t("Info"), t("An_error_occurred"), [
                        {
                            text: t("Ok"),
                        }
                    ])
                }
            } catch (err) {
                showSpinner(false);
                Alert.alert(t("Info"), t("Please_fill_all_required_fields_correctly_to_proceed"), [
                    {
                        text: t("Ok"),
                    }
                ])
            }
        } else {
            await setAuthentication(false);
            Alert.alert(t("Info"), t("fillAllFields"), [
                {
                    text: t("Ok"),
                }
            ])
        }
    };

    return (
        <I18nextProvider i18n={i18n}>
            <SafeAreaProvider>
                <NativeBaseProvider>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                                    maxLength={12}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
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
                                <TouchableOpacity onPress={() => { handleLogin(phone, password) }} style={styles.button}>
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
                        <Spinner visible={spinner} textContent={t("Loading")} textStyle={{ color: "#fff" }} />
                    </ScrollView>
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
    spinnerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    containerimage: {
        backgroundColor: '#fff',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        padding: 8,
        paddingLeft: 12,
        marginBottom: 10,
        borderRadius: 30,
        borderColor: '#1230AE',
        backgroundColor: '#FFFFFF',
        color: "#1230AE"
    },
    button: {
        width: '90%',
        marginTop: 50,
        backgroundColor: "#1230AE",
        borderRadius: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    forgetbutton: {
        width: '90%',
        backgroundColor: "#fff",
        borderRadius: 40,
        height: 40,
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