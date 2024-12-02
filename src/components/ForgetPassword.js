import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { NativeBaseProvider, Avatar, Select, CheckIcon, Divider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const ForgetPassScreen = ({ componentId }) => {
    const { t, i18n } = useTranslation();
    const [phone, setPhone] = useState('');

    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
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
                        <TouchableOpacity onPress={{}} style={styles.button}>
                            <Text style={styles.buttonText}>{t("Get OTP")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            Navigation.pop(componentId);
                        }} style={styles.forgetbutton}>
                            <Text style={styles.forgetbuttonText}>{t("back")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        padding: 12,
        marginBottom: 10,
        borderRadius: 30,
        borderColor: '#1230AE',
        backgroundColor: '#FFFFFF',
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

export default ForgetPassScreen;