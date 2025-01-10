import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import { NativeBaseProvider, Radio } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import utils from '../services/utils';
import axios from 'axios';
const debounce = require('lodash.debounce');
import GlobalAlert from './GlobalAlert';
const CouponScreen = () => {
    const [couponCode, setCouponCode] = useState('');
    const [couponVerified, setCouponVerified] = useState(false);
    const [account, setAccount] = useState('');
    const [ifsc, setifsc] = useState('');
    const [upiId, setUpiId] = useState('');
    const [phone, setPhone] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [spinner, showSpinner] = useState(false);
    const [paymentType, setPaymentType] = useState('upi');
    const [verifyCode, setVerifyCode] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('Info');

    const { t } = useTranslation();

    // Verify coupon code function
    const verifyCouponCode = async () => {
        if (couponCode) {
            try {
                const isNoInternet = await utils.checkInternetReachability()
                if (isNoInternet) {
                    setShowAlert(true);
                    setAlertType("no_internet");
                    setAlertMsg("internet_msg")
                    return;
                }
                showSpinner(true);
                const payload = {
                    "coupanCode": couponCode
                };
                const response = await axios.post(utils.baseUrl + '/coupan/verify', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${utils.token}`,
                    },
                });
                showSpinner(false);
                setCouponVerified(response ? true : false);
                setVerifyCode(true);
            } catch (error) {
                setCouponVerified(false);
                setVerifyCode(false);
                console.log(error.response);
                showSpinner(false);
                setShowAlert(true);
                setAlertType("Server_Error");
                setAlertMsg(error.response.data.error);
            }
        } else {
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg("Please_fill_all_required_fields_correctly_to_proceed");
            return;
        }
    };

    useEffect(() => {
        if (couponVerified) {
            setCouponVerified(false);
        }
    }, [couponCode])


    const validateInputs = () => {
        if (!couponCode || !phone || (paymentType === 'bank' ? !account || !ifsc : !upiId)) {
            setShowAlert(true);
            setAlertType("Validation_Error");
            setAlertMsg("Please_fill_all_required_fields_correctly_to_proceed");
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateInputs()) return;
        setIsModalVisible(true);
    };

    const confirmSubmission = async () => {
        try {
            const payload = {
                "coupanCode": couponCode,
                "phone": phone,
                ...(paymentType === "upi"
                    ? { "upiId": upiId }
                    : { "accountNo": account, "ifscCode": ifsc })
            };
            const isNoInternet = await utils.checkInternetReachability()
            if (isNoInternet) {
                setShowAlert(true);
                setAlertType("no_internet");
                setAlertMsg("internet_msg")
                return;
            }
            showSpinner(true);
            console.log(payload);
            const response = await axios.post(utils.baseUrl + '/payout/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${utils.token}`,
                }
            });
            console.log(response);
            if (response.status) {
                setIsModalVisible(false);
                showSpinner(false);
                setShowAlert(true);
                setAlertType("Success");
                setAlertMsg("Coupon_submitted_successfully");
            } else {
                setIsModalVisible(false);
                showSpinner(false);
            }

        } catch (error) {
            console.log(error.response);
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg(error.response.data.message);
        } finally {
            setIsModalVisible(false);
            showSpinner(false);
        }

    };

    const buttonStyle = (value) => ({
        backgroundColor: paymentType === value ? '#007bff' : '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 0.5,
        alignItems: "center",
        marginHorizontal: 5,
    });

    const textStyle = (value) => ({
        color: paymentType === value ? '#fff' : '#000',
        fontWeight: paymentType === value ? 'bold' : 'normal',
    });

    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.containerImage}>
                            <Image
                                source={require('../assets/image/logo.png')}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
                            <Text style={{ fontSize: 22, color: "#1230AE", fontWeight: "800" }}>{t('CouponWithdrawal')}</Text>
                        </View>
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t("Enter_Coupon_Code")}
                                    value={couponCode}
                                    onChangeText={setCouponCode}
                                    placeholderTextColor="#AAAAAA"
                                />
                                {(verifyCode || couponVerified) && (
                                    <Icons
                                        name={couponVerified ? "check-circle" : "close-circle-outline"}
                                        size={24}
                                        color={couponVerified ? "green" : "red"}
                                        style={styles.icon}
                                    />
                                )}
                            </View>
                            <View>
                                {couponVerified === true && (
                                    <>
                                        <View style={[{
                                            paddingBottom: 10,
                                            width: "100%",
                                            backgroundColor: '#fff',
                                            flexDirection: "row"
                                        }]}>
                                            <TouchableOpacity
                                                style={buttonStyle('upi')}
                                                onPress={() => setPaymentType('upi')}
                                            >
                                                <Text style={textStyle('upi')}>{t("UPI")}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={buttonStyle('bank')}
                                                onPress={() => setPaymentType('bank')}
                                            >
                                                <Text style={textStyle('bank')}>{t("BankTransfer")}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>

                                )}
                            </View>
                            {couponVerified === false &&
                                <TouchableOpacity onPress={verifyCouponCode} style={styles.button}>
                                    <Text style={styles.buttonText}>{t("Verify")}</Text>
                                </TouchableOpacity>
                            }
                            {couponVerified === true && (
                                <>
                                    {paymentType === 'upi' && (
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={t('Enter_UPI_Id')}
                                                value={upiId}
                                                onChangeText={setUpiId}
                                                placeholderTextColor="#AAAAAA"
                                            />
                                        </View>
                                    )}
                                    {paymentType === 'bank' && (
                                        <>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder={t("Enter_Bank_Account_Number")}
                                                    value={account}
                                                    onChangeText={setAccount}
                                                    placeholderTextColor="#AAAAAA"
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder={t("Enter_IFSC_Code")}
                                                    value={ifsc}
                                                    onChangeText={setifsc}
                                                    placeholderTextColor="#AAAAAA"
                                                />
                                            </View>
                                        </>
                                    )}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={t("Enter_Phone_Number")}
                                            value={phone}
                                            onChangeText={setPhone}
                                            keyboardType="phone-pad"
                                            placeholderTextColor="#AAAAAA"
                                        />
                                    </View>
                                </>
                            )}

                            {couponVerified &&
                                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                    <Text style={styles.buttonText}>{t("Submit")}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <Spinner visible={spinner} textContent={t("Submitting")} textStyle={{ color: "#fff" }} />
                        <GlobalAlert
                            visible={showAlert}
                            title={alertType}
                            message={alertMsg}
                            onConfirm={
                                alertType === "Server_Error"
                                    ? () => {
                                        setCouponVerified(false);
                                        setCouponCode('');
                                        setVerifyCode(false);
                                        setShowAlert(false)
                                    }
                                    : alertType === "Success"
                                        ? () => {
                                            setCouponCode('');
                                            setCouponVerified(null);
                                            setAccount('');
                                            setifsc('');
                                            setUpiId('');
                                            setPhone('');
                                            setPaymentType('');
                                            setShowAlert(false)
                                        }
                                        : undefined
                            }
                            onCancel={() => setShowAlert(false)}
                        />
                        <Modal
                            visible={isModalVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setIsModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>{t("Review_Details")}</Text>
                                    <Text>Coupon Code: {couponCode}</Text>
                                    <Text>Payment Type: {paymentType}</Text>
                                    {paymentType === 'upi' && <Text>UPI Id: {upiId}</Text>}
                                    {paymentType === 'bank' && <Text>Bank Account: {account}</Text>}
                                    <Text>Phone: {phone}</Text>
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#1230AE',
        paddingLeft: 12,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    inputContainerValidation: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#1230AE',
        paddingLeft: 12,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        padding: 8,
        color: '#1230AE',
    },
    icon: {
        marginRight: 10,
    },
    radioGroup: {
        alignSelf: 'flex-start',
        marginVertical: 10,
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
