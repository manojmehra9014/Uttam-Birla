import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Avatar, Divider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import i18n from '../services/i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalAlert from './GlobalAlert';

const SettingsScreen = ({ componentId }) => {
    const [language, setLanguage] = useState('en');
    const { t } = useTranslation();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('Info');

    useEffect(() => {
        const fetchLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
                if (savedLanguage) {
                    setLanguage(savedLanguage);
                }
            } catch (error) {
                console.error('Error fetching language from AsyncStorage', error);
            }
        };
        fetchLanguage();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('selectedItems');
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('phone');
            await AsyncStorage.removeItem('password');
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
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const openHelpSection = () => {
        setShowAlert(true);
        setAlertType("Info");
        setAlertMsg("Please_contact_the_admin_or_visit_the_nearest_store");
    };

    const showLogoutModal = () => {
        setShowAlert(true);
        setAlertType("Logout");
        setAlertMsg("logoutContinew");
    };

    const changeLanguage = async (language) => {
        i18n.changeLanguage(language);
        setLanguage(language);
        try {
            await AsyncStorage.setItem('selectedLanguage', language);
        } catch (error) {
            console.error('Error saving language to AsyncStorage', error);
        }
    };

    return (<>
        <Image source={require("../assets/image/painter.png")} style={{ width: "100%", height: 300 }} resizeMode='cover' />
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{t('Setting')}</Text>
            </View >

            <Divider />

            <View >
                <TouchableOpacity
                    style={styles.languageIconContainer}
                    onPress={() => changeLanguage(language === 'en' ? 'hi' : 'en')}
                >
                    <View style={{ flex: 0.4, justifyContent: "center", alignItems: "center" }}>
                        <Icon name="language" size={40} color="#1230AE" />
                    </View>
                    <View style={{ flex: 0.6, justifyContent: "center", alignItems: "center" }}>
                        <Text style={styles.languageText}>{language === 'en' ? 'English' : 'हिन्दी'}</Text>
                    </View>
                </TouchableOpacity>
                <Divider />
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.sectionButton} onPress={() => showLogoutModal()}>
                    <Text style={styles.sectionText}>{t("Logout")}</Text>
                </TouchableOpacity>
                <Divider />
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.sectionButton} onPress={openHelpSection}>
                    <Text style={styles.sectionText}>{t('Help')}</Text>
                </TouchableOpacity>
                <Divider />
            </View>
            <GlobalAlert
                visible={showAlert}
                title={alertType}
                message={alertMsg}
                onConfirm={alertType === "Logout" ? () => {
                    setShowAlert(false);
                    handleLogout();
                } : undefined}
                onCancel={() => { setShowAlert(false) }}
            />



        </View >
    </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1230AE',
    },
    section: {
        marginVertical: 10,
    },
    sectionButton: {
        paddingVertical: 15,
        backgroundColor: '#1230AE',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    languageIconContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 10
    },
    languageText: {
        color: "#1230AE"
    }
});

export default SettingsScreen;
