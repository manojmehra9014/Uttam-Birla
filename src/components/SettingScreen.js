import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Avatar, Divider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';

const SettingsScreen = ({ componentId }) => {
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
        alert("Contect to Admin or Contect to nearby Store - emailID, PhoneNumber");
    };

    const openOtherSection = () => {
        Navigation.push(componentId, {
            component: {
                name: 'LoginScreen',
            },
        });
    };

    const showLogoutModal = () => (
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        handleLogout()
                    },
                },
            ],
        ));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Avatar at the top center */}
                <Avatar bg="blue.500" size="xl" source={require('../assets/image/painter.png')} />
                <Text style={styles.headerText}>Settings</Text>
            </View>

            <Divider />

            <View style={styles.section}>
                <TouchableOpacity style={styles.sectionButton} onPress={() => showLogoutModal()}>
                    <Text style={styles.sectionText}>Logout</Text>
                </TouchableOpacity>
                <Divider />
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.sectionButton} onPress={openHelpSection}>
                    <Text style={styles.sectionText}>Help</Text>
                </TouchableOpacity>
                <Divider />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
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
        marginTop: 10,
    },
    section: {
        marginVertical: 10,
    },
    sectionButton: {
        paddingVertical: 15,
        backgroundColor: '#fff',
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
        color: '#1230AE',
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
});

export default SettingsScreen;
