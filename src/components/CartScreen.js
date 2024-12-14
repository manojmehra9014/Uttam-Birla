import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing selected items
import { Avatar, Divider } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing the Icon component

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        // Fetch selected items from AsyncStorage when the screen loads
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

        fetchCartItems();
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
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const handleDecreaseQuantity = (itemId) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const handleRemoveItem = async (itemId) => {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        try {
            await AsyncStorage.setItem('selectedItems', JSON.stringify(updatedItems));
        } catch (error) {
            console.error('Error updating AsyncStorage:', error);
        }
    };

    const handleCheckout = () => {
        // Trigger the checkout modal
        setShowModal(true);
    };

    const confirmCheckout = async () => {
        // Logic to handle API request for placing the order
        try {
            const orderData = {
                items: cartItems,
                totalAmount,
            };
            // Replace with actual API call
            const response = await fetch('https://api.example.com/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                console.log('Order placed successfully');
                setShowModal(false);
                // Optionally, reset the cart or navigate to another screen
            } else {
                console.log('Error placing order');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={styles.cartContent}>
                <Text style={styles.cartTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cartDescription} numberOfLines={1} >{item.description}</Text>
                <Text style={styles.cartPrice}>${item.price}</Text>

                <View style={styles.quantityControls}>
                    <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                    <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)} style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
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
                    <Text style={{ fontSize: 14, color: "#1230AE", fontWeight: '700' }}>
                        Your Cart
                    </Text>
                    <Text style={{ fontSize: 14, color: "#1230AE", fontWeight: '700' }}>
                        Customize Your Cart & Edit Items.
                    </Text>
                </View>
            </View>
            <Divider />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Icon name="shopping-cart" size={50} color="#1230AE" />
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}


            {cartItems.length > 0 && (
                <>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={{ backgroundColor: "#fff", justifyContent: "center", alignItems: "center", padding: 10 }}>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>Checkout Now</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Order Summary</Text>
                        <ScrollView style={styles.scrollView}>
                            {cartItems.map((item) => (
                                <View key={item.id} style={styles.modalItem}>
                                    <Text>{item.title} x {item.quantity}</Text>
                                    <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                                </View>
                            ))}
                            <Text style={styles.modalTotal}>Total: ${totalAmount.toFixed(2)}</Text>
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <Button color={'#1230AE'} title="Place Order" onPress={confirmCheckout} />
                            <Button title="Cancel" color={'#1230AE'} onPress={() => setShowModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        width: '80%',
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
