import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../services/i18n';
import { useTranslation } from 'react-i18next';

const GlobalAlert = ({ visible, title, message, onConfirm, confirmText = "Ok", onCancel, cancelText = "Close" }) => {
    const { t } = useTranslation();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.alertTitle}>{t(title)}</Text>
                    <Text style={styles.alertMessage}>{t(message)}</Text>
                    <View style={styles.buttonContainer}>
                        {onCancel && (
                            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                <Text style={styles.cancelButtonText}>{t(cancelText)}</Text>
                            </TouchableOpacity>
                        )}
                        {onConfirm && (
                            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                                <Text style={styles.confirmButtonText}>{t(confirmText)}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
        color: "#000"
    },
    alertMessage: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 40
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: "center"
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 50,
        marginRight: 10,
        flex: 0.5,
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
        textAlign: "center"
    },
    confirmButton: {
        backgroundColor: '#1230AE',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 50,
        flex: 0.5,

    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: "center"

    },
});

export default GlobalAlert;
