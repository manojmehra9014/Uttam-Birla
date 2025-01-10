import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NativeBaseProvider, Avatar, Select, CheckIcon, Divider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { i18n } from '../services/i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import utils from '../services/utils';
import axios from 'axios';
const ForgetPassScreen = ({ componentId }) => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpt = async () => {
        if (!phone) {
            Alert.alert(t("Info"), t("Enter_Phone_Number_To_Get_New_Password"), [
                {
                    text: t("Ok"),
                }
            ])
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            Alert.alert(t("Info"), t("Invalid_Phone_Number_Format"), [
                {
                    text: t("Ok"),
                }
            ]);
            return;
        }
        try {
            const payload = {
                "phone": phone
            }
            setLoading(true);
            const response = await axios.post('https://api.uttambirla.com/user/forgot-password', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${utils.token}`,
                }
            });
            setLoading(false);
            if (response.status == 200) {
                Alert.alert(t("Password_Updated"), `${t("Password_Updated_Message")} ${response?.data?.data?.newPassword}`, [
                    {
                        text: t("Ok"), onPress: () => {
                            Navigation.push(componentId, {
                                component: {
                                    name: 'LoginScreen',
                                },
                            });
                        }
                    }
                ])
            } else {
                Alert.alert(t("Info"), t("An_error_occurred"), [
                    {
                        text: t("Ok"),
                    }
                ]);
            }
        } catch (error) {
            setLoading(false);
            Alert.alert(t("Info"), t("An_error_occurred"), [
                {
                    text: t("Ok"),
                }
            ])
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ height: "100%" }}>
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
                            <TouchableOpacity onPress={handleOpt} style={styles.button}>
                                <Text style={styles.buttonText}>{t("Generate Password")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Navigation.pop(componentId);
                            }} style={styles.forgetbutton}>
                                <Text style={styles.forgetbuttonText}>{t("back")}</Text>
                            </TouchableOpacity>
                        </View>
                        <Spinner visible={loading} textContent={t("Loading")} textStyle={{ color: "#fff" }} />
                    </View>
                </ScrollView>
            </NativeBaseProvider>
        </SafeAreaProvider>
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
        padding: 8,
        paddingLeft: 12,
        borderRadius: 30,
        borderColor: '#1230AE',
        backgroundColor: '#FFFFFF',
    },
    button: {
        width: '90%',
        marginTop: 60,
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

export default ForgetPassScreen;