import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import Indian_states_cities_list from "indian-states-cities-list";
import { NativeBaseProvider, Avatar, Select, CheckIcon, Divider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { setAuthentication } from '../services/authService';
import { fetchData, postData } from '../services/apiService';
import Icon from 'react-native-vector-icons/Feather';
import { getParsedCommandLineOfConfigFile } from 'typescript/lib/typescript';

const SignUpScreen = ({ componentId }) => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState('en');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState(Indian_states_cities_list.STATES_OBJECT);
    const [city, setCity] = useState();
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        SplashScreen.hide();
        Navigation.setDefaultOptions({
            topBar: {
                visible: false,
                height: 0,
            },
        });
    }, []);

    useEffect(() => {
        if (selectedState) {
            const selectedCities = Indian_states_cities_list.STATE_WISE_CITIES[selectedState] || [];
            setCity(selectedCities);
        }
    }, [selectedState]);

    const handleSignUp = async () => {
        if (username && email && phone && address && pincode && state && city && password && selectedCity) {
            const payload = {
                "name": username,
                "phone": phone,
                "email": email,
                "password": password,
                "city": selectedCity,
                "district": address,
                "state": selectedState,
            };
            const response = await postData('/user', payload);
            if (response.seccess) {
                alert(t('signUpSuccess'));
                Navigation.push(componentId, {
                    component: {
                        name: 'LoginScreen',
                    },
                });
            }
        } else {
            await setAuthentication(false);
            alert(t('fillAllFields'));
        }
    };

    const handleStateChange = (state) => {
        setSelectedState(state);
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
    };

    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ backgroundColor: "#fff", padding: 4 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Avatar bg="white" size="xl" source={require('../assets/image/logo.png')}></Avatar>
                            </View>
                            <View>
                                <Text style={{ fontSize: 14, color: "#1230AE", fontWeight: 700 }}>
                                    {t('welcomeMessage')}
                                </Text>
                                <Text style={{ fontSize: 14, color: "#1230AE", fontWeight: 700 }}>
                                    {t('subMessage')}
                                </Text>
                            </View>
                        </View>
                        <Divider />
                        <View style={{ flexGrow: 1, padding: 16, backgroundColor: '#fff' }}>
                            <Text style={{ fontSize: 25, color: "#1230AE", fontWeight: 700 }}>
                                {t('signUp')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('usernamePlaceholder')}
                            value={username}
                            onChangeText={setUsername}
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
                            placeholder={t('phonePlaceholder')}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholderTextColor="#AAAAAA"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('addressPlaceholder')}
                            value={address}
                            onChangeText={setAddress}
                            placeholderTextColor="#AAAAAA"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('pincodePlaceholder')}
                            value={pincode}
                            onChangeText={setPincode}
                            keyboardType="numeric"
                            placeholderTextColor="#AAAAAA"
                        />

                        <View style={{ marginBottom: 15 }}>
                            <Select
                                selectedValue={selectedState}
                                minWidth="100%"
                                accessibilityLabel={t('statePlaceholder')}
                                placeholder={t('statePlaceholder')}
                                _selectedItem={{
                                    bg: "blue.400",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                mt={1}
                                _light={{
                                    borderColor: "#1230AE",
                                    borderRadius: 40,
                                    borderWidth: 1,
                                }}
                                _dark={{
                                    borderColor: "#1230AE",
                                    borderRadius: 40,
                                    borderWidth: 1,
                                }}
                                onValueChange={itemValue => setSelectedState(itemValue)}
                            >
                                {state.map((stateItem) => (
                                    <Select.Item label={stateItem.label} value={stateItem.value} key={stateItem.value} />
                                ))}
                            </Select>
                        </View>

                        {city && (
                            <View style={{ marginBottom: 15 }}>

                                <Select
                                    selectedValue={selectedCity}
                                    minWidth="100%"
                                    accessibilityLabel={t('cityPlaceholder')}
                                    placeholder={t('cityPlaceholder')}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />,
                                    }}
                                    mt={1}
                                    _light={{
                                        borderColor: "#1230AE",
                                        borderRadius: 40,
                                        borderWidth: 1,
                                    }}
                                    _dark={{
                                        borderColor: "#1230AE",
                                        borderRadius: 40,
                                        borderWidth: 1,
                                    }}
                                    onValueChange={itemValue => setSelectedCity(itemValue)}
                                >
                                    {city.map((cityItem) => (
                                        <Select.Item label={cityItem.label} value={cityItem.value} key={cityItem.value} />
                                    ))}
                                </Select>
                            </View>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder={t('passwordPlaceholder')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#AAAAAA"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder={t('confirmPasswordPlaceholder')}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor="#AAAAAA"
                        />
                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={{
                                width: '90%',
                                marginTop: 10,
                                backgroundColor: "#1230AE",
                                borderRadius: 40,
                                height: 40,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff" }}>{t('signUp')}</Text>
                        </TouchableOpacity>
                        <Text
                            style={[styles.switchToLogin, { marginBottom: 5 }]}
                            onPress={() => {
                                Navigation.push(componentId, {
                                    component: {
                                        name: 'LoginScreen',
                                    },
                                });
                            }}
                        >
                            {t('alreadyHaveAccount')}
                        </Text>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1230AE',
    },
    subTitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#1230AE',
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

    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#1230AE',
        borderRadius: 30,
        color: '#000',
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    termsText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
    switchToLogin: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 30,
        padding: 15,
        color: '#1230AE',
        textDecorationLine: 'underline',
    },
});
export default SignUpScreen;