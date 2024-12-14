import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
const CouponScreen = () => {
    const [couponCode, setCouponCode] = useState('');
    const [account, setAccount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [phone, setPhone] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [spinner, showSpinner] = useState(false);

    const validateInputs = () => {
        if (!couponCode || !upiId || !phone || !account) {
            Alert.alert("Validation Error", "Please fill all fields.");
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateInputs()) return;
        setIsModalVisible(true);
    };

    const confirmSubmission = () => {
        setIsModalVisible(false);
        showSpinner(true);
        setTimeout(() => {
            showSpinner(false);
            Alert.alert("Success", "Coupon submitted successfully!");
        }, 2000);
    };

    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <KeyboardAvoidingView>
                        <View style={styles.container}>
                            <View style={styles.containerImage}>
                                <Image
                                    source={require('../assets/image/logo.png')}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
                                <Text style={{ fontSize: 22, color: "#1230AE", fontWeight: "800" }}>Coupon Withdrawal</Text>
                            </View>
                            <View style={styles.formContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Coupon Code"
                                    value={couponCode}
                                    onChangeText={setCouponCode}
                                    placeholderTextColor="#AAAAAA"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter UPI Id"
                                    value={upiId}
                                    onChangeText={setUpiId}
                                    placeholderTextColor="#AAAAAA"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Bank Account Number"
                                    value={account}
                                    onChangeText={setAccount}
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#AAAAAA"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Phone Number"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#AAAAAA"
                                />

                                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            <Spinner visible={spinner} textContent="Submitting..." textStyle={{ color: "#fff" }} />

                            {/* Review Modal */}
                            <Modal
                                visible={isModalVisible}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={() => setIsModalVisible(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>Review Details</Text>
                                        <Text>Coupon Code: {couponCode}</Text>
                                        <Text>UPI Id: {upiId}</Text>
                                        <Text>Phone: {phone}</Text>
                                        <Text>Bank Account: {account}</Text>
                                        <View style={styles.modalActions}>
                                            <TouchableOpacity
                                                style={styles.modalButton}
                                                onPress={() => setIsModalVisible(false)}
                                            >
                                                <Text style={styles.modalButtonText}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.modalButton, styles.modalButtonConfirm]}
                                                onPress={confirmSubmission}
                                            >
                                                <Text style={styles.modalButtonText}>Confirm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </NativeBaseProvider>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    containerImage: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: '80%',
        height: 150,
    },
    formContainer: {
        alignItems: 'center',
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
        color: "#1230AE",
    },
    button: {
        width: '90%',
        marginTop: 20,
        backgroundColor: "#1230AE",
        borderRadius: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#1230AE',
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    modalButtonConfirm: {
        backgroundColor: 'green',
    },
    modalButtonText: {
        color: '#fff',
    },
});

export default CouponScreen;
