import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast
import axios from 'axios';
import { Avatar, Divider } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';


const HomeScreen = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePrev, setShowImagePreview] = useState(false);

    useEffect(() => {
        // Fetch items from the API
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://fakestoreapi.com/products'); // Sample API endpoint
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();

        // Load selected items from AsyncStorage
        const loadSelectedItems = async () => {
            try {
                const savedItems = await AsyncStorage.getItem('selectedItems');
                if (savedItems) {
                    setSelectedItems(JSON.parse(savedItems));
                }
            } catch (error) {
                console.error('Error loading selected items:', error);
            }
        };

        loadSelectedItems();
    }, []);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setShowImagePreview(true);
    };

    const handleItemPress = async (item) => {
        const isSelected = selectedItems.find(selected => selected.id === item.id);
        let updatedSelectedItems;
        if (isSelected) {
            // Remove item from the selected list
            updatedSelectedItems = selectedItems.filter(selected => selected.id !== item.id);
            Toast.show({
                type: 'info',
                text1: 'Item Removed',
                text2: `${item.title} has been removed from your selection.`,
            });
        } else {
            // Add item to the selected list
            updatedSelectedItems = [...selectedItems, item];
            Toast.show({
                type: 'success',
                text1: 'Item Added',
                text2: `${item.title} has been added to your selection.`,
            });
        }
        setSelectedItems(updatedSelectedItems);
        try {
            await AsyncStorage.setItem('selectedItems', JSON.stringify(updatedSelectedItems));
        } catch (error) {
            console.error('Error saving selected items:', error);
        }
    };

    const closeImagePreview = () => {
        setShowImagePreview(false);
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedItems.find(selected => selected.id === item.id);
        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => handleItemPress(item)}
            >
                <TouchableOpacity
                    style={{ alignItems: "center", justifyContent: "center" }}
                    onPress={() => handleImagePress(item.image)}
                >
                    <Image source={{ uri: item.image }} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.content}>
                    <Text numberOfLines={2} style={styles.name}>{item.title}</Text>
                    <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
                    <Text style={styles.price}>${item.price}</Text>
                    <Text style={styles.available}>{item.available ? 'In Stock' : 'Out of Stock'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <View style={styles.container}>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff" }}>
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

                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
                    ) : (
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}

                    {imagePrev && (
                        <Modal visible={true} transparent={true} animationType="slide">
                            <View style={styles.modalContainer}>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                                    <TouchableOpacity style={styles.closeIcon} onPress={closeImagePreview}>
                                        <Text style={styles.closeIconText}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            </NativeBaseProvider>
        </SafeAreaProvider>
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
    card: {
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
    selectedCard: {
        borderColor: '#1230AE',
        borderWidth: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
        marginBottom: 5,
    },
    available: {
        fontSize: 14,
        color: '#e74c3c',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        width: '90%',
        height: '70%',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 10,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    closeIconText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
});

export default HomeScreen;
