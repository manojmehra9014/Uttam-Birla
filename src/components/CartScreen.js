import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Divider, Select, CheckIcon } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import utils from '../services/utils';
import { Button } from 'react-native-paper';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import GlobalAlert from './GlobalAlert';
const CartScreen = () => {
    const { t } = useTranslation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [distributer, setDistributer] = useState(null);
    const [distributerList, setDistributerList] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('Info');

    const fetchDistributerListData = async () => {
        try {
            const isNoInternet = await utils.checkInternetReachability()
            if (isNoInternet) {
                setShowAlert(true);
                setAlertType("no_internet");
                setAlertMsg("internet_msg")
                return;
            }
            const response = await axios.get(utils.baseUrl + '/user/distributer/list', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${utils.token}`,
                }
            });
            console.log(response.data.data);
            setDistributerList(response.data.data);
        } catch (error) {
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg(error?.response?.data?.message || "An_error_occurred");
            return;
        }
    }

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const savedItems = await AsyncStorage.getItem('selectedItems');
                if (savedItems) {
                    const parsedItems = JSON.parse(savedItems);
                    const updatedItems = parsedItems.map(item => ({
                        ...item,
                        quantity: item.quantity || 1,
                        price: item.price || 0,
                    }));
                    setCartItems(updatedItems);
                    calculateTotal(updatedItems);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDistributerListDataWrapper = async () => {
            await fetchDistributerListData();
        };

        fetchCartItems();
        fetchDistributerListDataWrapper();
    }, []);

    const calculateTotal = (items) => {
        let total = 0;
        items.forEach(item => {
            if (item.price && item.quantity && !isNaN(item.price) && !isNaN(item.quantity)) {
                total += item.price * item.quantity;
            }
        });
        setTotalAmount(total);
    };

    const handleIncreaseQuantity = (itemId) => {
        const updatedItems = cartItems.map(item =>
            item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const handleDecreaseQuantity = (itemId) => {
        const updatedItems = cartItems.map(item =>
            item._id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const handleRemoveItem = async (itemId) => {
        const updatedItems = cartItems.filter(item => item._id !== itemId);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        try {
            await AsyncStorage.setItem('selectedItems', JSON.stringify(updatedItems));
        } catch (error) {
            console.error('Error updating AsyncStorage:', error);
        }
    };

    const handleCheckout = () => {
        setShowModal(true);
    };

    const fetchDistributerListData2 = async (payload) => {
        try {
            const isNoInternet = await utils.checkInternetReachability()
            if (isNoInternet) {
                setShowAlert(true);
                setAlertType("no_internet");
                setAlertMsg("internet_msg")
                return;
            }
            setSpinner(true)
            const response = await axios.post(utils.baseUrl + '/order/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${utils.token}`,
                }
            });
            if (response.status) {
                setSpinner(false)
                await AsyncStorage.removeItem('selectedItems');
                setCartItems([]);
                setShowModal(false);
                setShowAlert(true);
                setAlertType("Order_Confirmed");
                setAlertMsg("Your_order_has_been_successfully_placed");
            } else {
                setSpinner(false)
                setShowAlert(true);
                setAlertType("Info");
                setAlertMsg("An_error_occurred");
            }
        } catch (error) {
            setSpinner(false)
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg("An_error_occurred");
        } finally {
            setSpinner(false)
        }
    }

    const confirmCheckout = async () => {
        if (!distributer || !utils.agentId) {
            setShowAlert(true);
            setAlertType("Info");
            setAlertMsg("Please_select_all_required_field");
            return;
        }
        const orderItems = cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity || 1,
        }));
        const agentId = utils.agentId
        const payload = {
            "distributorId": distributer,
            "agentId": agentId,
            "items": orderItems,
            "price": totalAmount.toString()
        }
        try {
            fetchDistributerListData2(payload);
        } catch (error) {
            setShowAlert(true);
            setAlertType("Error");
            setAlertMsg("Something_went_Wrong");
            console.error('Error placing the order:', error);
        }
    };

    const renderCartItem = ({ item }) => (
        <View key={item._id} style={styles.cartItem}>
            <Image source={{ uri: item.images?.[0] }} style={styles.cartImage} />
            <View style={styles.cartContent}>
                <Text style={styles.cartTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cartDescription} numberOfLines={1} >{item.discription}</Text>
                <Text style={styles.cartPrice}>₹{item.price}</Text>

                <View style={styles.quantityControls}>
                    <TouchableOpacity onPress={() => handleDecreaseQuantity(item._id)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                    <TouchableOpacity onPress={() => handleIncreaseQuantity(item._id)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => handleRemoveItem(item._id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>{t("Remove")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff" }}>
                <View style={{ marginHorizontal: 10 }}>
                    <Avatar bg="white" size="xl" source={require('../assets/image/logo.png')} />
                </View>
                <View>
                    <Text style={{ fontSize: 14, color: "#1230AE", fontWeight: '700' }}>{t("Your_cart")}</Text>
                    <Text style={{ fontSize: 14, color: "#1230AE", fontWeight: '700' }}>{t("Customize_Your_Cart")}</Text>
                </View>
            </View>
            <Divider />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Image source={require('../assets/image/cart.png')} style={{ height: '50%', width: "100%" }} />
                    <Text style={styles.emptyCartText}>{t("Your_cart_is_empty")}</Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}


            {cartItems.length > 0 && (
                <>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>{t("Total_")} ₹{totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={{ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", padding: 10 }}>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>{t("Checkout_Now")}</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
                maxHeight={"90%"}
                minWidth={"95%"}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t("Order_Summary")}</Text>
                        <ScrollView style={styles.scrollView}>
                            {distributerList &&
                                <View style={{ marginBottom: 15 }}>
                                    <Select
                                        selectedValue={distributer}
                                        minWidth="100%"
                                        accessibilityLabel={t('selectDistributor')}
                                        placeholder={t('selectDistributor')}
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
                                        onValueChange={itemValue => setDistributer(itemValue)}
                                    >
                                        {distributerList.map((stateItem) => (
                                            <Select.Item label={stateItem.name} value={stateItem._id} key={stateItem._id} />
                                        ))}
                                    </Select>
                                </View>
                            }
                            {cartItems.map((item) => (
                                <View key={item.id} style={styles.modalItem}>
                                    <Text>{item.name} x {item.quantity}</Text>
                                    <Text>₹{(item.price * item.quantity).toFixed(2)}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View>
                            <Text style={styles.modalTotal}>{t("Total_")} ₹{totalAmount.toFixed(2)}</Text>
                            <View style={styles.modalActions}>
                                <Button mode="contained" onPress={confirmCheckout} style={{ backgroundColor: "#1230AE", borderRadius: 25 }} >{t("Place_Order")}</Button>
                                <Button mode="contained" onPress={() => setShowModal(false)} style={{ backgroundColor: "#1230AE", borderRadius: 25 }} >{t("Cancel")}</Button>
                            </View>
                        </View>
                        <Spinner visible={spinner} textContent={t("Submitting")} textStyle={{ color: "#fff" }} />
                        <GlobalAlert
                            visible={showAlert}
                            title={alertType}
                            message={alertMsg}
                            onCancel={() => { setShowAlert(false) }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 10,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        borderColor: '#fff',
        borderWidth: 2,
    },
    cartImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    cartContent: {
        flex: 1,
    },
    cartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cartDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cartPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
        marginBottom: 5,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityButton: {
        width: 30,
        height: 30,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    removeButton: {
        marginTop: 10,
        backgroundColor: '#7ef1f0',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#1230AE',
        fontSize: 14,
    },
    checkoutButton: {
        width: '95%',
        marginTop: 5,
        backgroundColor: "#1230AE",
        borderRadius: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    totalText: {
        fontSize: 18,
        marginLeft: 5,
        fontWeight: 'bold',
        color: '#1230AE',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly transparent background
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%', // Restrict height of the modal
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollView: {
        maxHeight: '60%', // Allow scroll if content exceeds this height
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalTotal: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    modalActions: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyCartText: {
        fontSize: 18,
        color: '#1230AE',
        marginTop: 10,
    },
});

export default CartScreen;
