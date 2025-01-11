import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { i18n } from '../services/i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import utils from '../services/utils';
import axios from 'axios';
import GlobalAlert from './GlobalAlert';

const ForgetPassScreen = ({ componentId }) => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('Info');
    const [otp, setOPT] = useState('');

    const handleOpt = async () => {
        if (!phone) {
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg("Enter_Phone_Number_To_Get_New_Password");
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg("Invalid_Phone_Number_Format");
            return;
        }
        try {
            const payload = {
                "phone": phone
            }
            const isNoInternet = await utils.checkInternetReachability()
            if (isNoInternet) {
                setShowAlert(true);
                setAlertType("no_internet");
                setAlertMsg("internet_msg")
                return;
            }
            setLoading(true);
            const response = await axios.post(utils.baseUrl + '/user/forgot-password', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${utils.token}`,
                }
            });
            setLoading(false);
            if (response.status == 200) {
                setShowAlert(true);
                setAlertType("Password_Updated");
                setAlertMsg(`${t("Password_Updated_Message")} ${response?.data?.data?.newPassword}`);
                setOPT(response?.data?.data?.newPassword)
            } else {
                setShowAlert(true);
                setAlertType("Info");
                setAlertMsg("An_error_occurred");
            }
        } catch (error) {
            setLoading(false);
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg("An_error_occurred");
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
                                <Text style={styles.buttonText}>{t("Generate_Password")}</Text>
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
                <GlobalAlert
                    visible={showAlert}
                    title={alertType}
                    message={alertMsg}
                    onConfirm={alertType === "Password_Updated" ? () => {
                        setShowAlert(false)
                        Navigation.push(componentId, {
                            component: {
                                name: 'LoginScreen',
                            },
                        });
                    } : undefined}
                    onCancel={() => { setShowAlert(false) }}
                />
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