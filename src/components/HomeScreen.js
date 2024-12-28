import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Modal, TouchableOpacity, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { Avatar, Divider } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fetchData, postData, getData } from '../services/apiService';
import utils from '../services/utils';
import Spinner from 'react-native-loading-spinner-overlay';
const HomeScreen = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePrev, setShowImagePreview] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [userType, setUserType] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const payload = {
                    "page": page,
                    "limit": limit,
                    "sortOrder": "desc",
                    "sortBy": "createdAt",
                };
                const response = await getData('product/list', payload);
                if (page === 1) {
                    setItems(response.data.data);
                } else {
                    setItems(prevItems => [...prevItems, ...response.data]);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
                setLoading(false);
                Alert.alert(t("Info"), t("An_error_occurred"), [
                    {
                        text: t("Ok"),
                    }
                ])
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
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
    }, [page]);
    useEffect(() => {
        const fetchUserType = () => {
            setUserType(utils.userType || 2);
        };
        fetchUserType();
    }, []);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setShowImagePreview(true);
    };

    const handleItemPress = async (item) => {
        const isSelected = selectedItems.some(selected => selected._id === item._id);
        let updatedSelectedItems;

        if (isSelected) {
            updatedSelectedItems = selectedItems.filter(selected => selected._id !== item._id);
            Toast.show({
                type: 'info',
                text1: 'Item Removed',
                text2: `${item.name} has been removed from your selection.`,
            });
        } else {
            updatedSelectedItems = [...selectedItems, item];
            Toast.show({
                type: 'success',
                text1: 'Item Added',
                text2: `${item.name} has been added to your selection.`,
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
        const isSelected = selectedItems.some(selected => selected._id === item._id);
        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => { (utils.userType == 3 || utils.userType == 4) && handleItemPress(item) }}
            >
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => { handleImagePress(item?.images?.[0]) }}>
                        <Image
                            source={{
                                uri: item?.images?.[0] || "https://thumbs.dreamstime.com/b/no-image-available-icon-vector-illustration-flat-design-140476186.jpg"
                            }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <Text numberOfLines={2} style={styles.name}>{item?.name}</Text>
                    <Text numberOfLines={2} style={styles.description}>{item?.discription}</Text>
                    <Text style={styles.price}>₹{item?.price}</Text>
                    <Text style={styles.available}>{item.active ? 'In Stock' : 'Out of Stock'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleLoadMore = () => {
        if (!loading) {
            setPage(prevPage => prevPage + 1);
        }
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

                    {loading && page === 1 ? (
                        <Spinner visible={true} textContent={t("Loading")} textStyle={{ color: "#fff" }} />
                    ) : (
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContainer}
                            onEndReached={() => { handleLoadMore }}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
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
