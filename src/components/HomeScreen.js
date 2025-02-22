import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Modal, TouchableOpacity, ScrollView, Dimensions, BackHandler } from 'react-native';
import Toast from 'react-native-toast-message';
import { Avatar, Divider } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { NativeBaseProvider, Button } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import utils from '../services/utils';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { width } = Dimensions.get('window');
import GlobalAlert from './GlobalAlert';
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
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [IsAlredySelected, setIsAlredySelected] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [alredyInCart, setAlredyinCart] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('Info');
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const isNoInternet = await utils.checkInternetReachability()
                if (isNoInternet) {
                    setShowAlert(true);
                    setAlertType("no_internet");
                    setAlertMsg("internet_msg")
                    return;
                }
                setLoading(true);
                const response = await axios.get(utils.baseUrl + '/product/list', {
                    params: {
                        "page": page,
                        "limit": limit,
                        "sortOrder": "desc",
                        "sortBy": "createdAt",
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${utils.token}`,
                    }
                });

                if (page === 1) {
                    setItems(response.data.data);
                } else {
                    setItems(prevItems => [...prevItems, ...response.data]);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
                setLoading(false);
                setShowAlert(true);
                setAlertMsg(error?.response?.message || "An_error_occurred")
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
        const backAction = () => {
            setShowAlert(true);
            setAlertType("Exit_App")
            setAlertMsg("Do you want to exit?");
            return true; // Prevent the default back button behavior
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        };
    }, []);

    const handleImagePress = (image) => {
        setSelectedImage(image);
        setShowImagePreview(true);
    };

    const handleItemPress = async (item) => {
        const isSelected = selectedItems.some(selected => selected._id === item._id);
        let updatedSelectedItems;
        console.log(isSelected);
        if (isSelected) {
            updatedSelectedItems = selectedItems.filter(selected => selected._id !== item._id);
            Toast.show({
                type: 'info',
                text1: 'Item Removed',
                text2: `Item has been removed from your selection.`,
            });
        } else {
            updatedSelectedItems = [...selectedItems, item];
            Toast.show({
                type: 'success',
                text1: 'Item Added',
                text2: `item has been added to your selection.`,
            });
        }
        console.log('Toast triggered');
        setSelectedItems(updatedSelectedItems);
        try {
            await AsyncStorage.setItem('selectedItems', JSON.stringify(updatedSelectedItems));
            setShowModal(false);
            setSelectedItem(null);
        } catch (error) {
            console.error('Error saving selected items:', error);
        }
    };

    const closeImagePreview = () => {
        setShowImagePreview(false);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleItemPress1 = (item) => {
        setSelectedItem(item);
        const isSelected = selectedItems.some(selected => selected._id === item._id);
        setAlredyinCart(isSelected);
        setShowModal(true);

    };

    // Function to handle scrolling and updating the image index
    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x; // X position of the scroll
        const imageWidth = width - 100; // Width of each image in the scroll view
        const index = Math.floor(contentOffsetX / imageWidth); // Calculate the index based on scroll position
        setImageIndex(index);
    };


    const renderItem = ({ item }) => {
        const isSelected = selectedItems.some(selected => selected._id === item._id);
        const images = item?.images || ["https://thumbs.dreamstime.com/b/no-image-available-icon-vector-illustration-flat-design-140476186.jpg"];
        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => { (utils.userType == 3 || utils.userType == 4) && handleItemPress1(item) }}
            >
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {/* Scrollable Image Gallery */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={handleScroll}>
                        {images.map((imageUri, index) => (
                            <TouchableOpacity key={index} onPress={() => handleImagePress(imageUri)}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {images?.length > 1 &&
                        <View style={styles.dotsContainer}>
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === imageIndex && styles.activeDot
                                    ]}
                                />
                            ))}
                        </View>
                    }
                </View>
                <View style={[styles.content, { flexDirection: "column" }]}>
                    <View style={styles.content}>
                        <Text numberOfLines={2} style={styles.name}>{item?.name}</Text>
                        <Text numberOfLines={2} style={styles.description}>{item?.discription}</Text>
                    </View>
                    <View style={[styles.content, { flexDirection: "row" }]}>
                        <View style={{ flex: 0.7 }}>
                            <Text style={styles.price}>₹{item?.price}</Text>
                            <Text style={styles.available}>{item.active ? 'In Stock' : 'Out of Stock'}</Text>
                        </View>
                        <View style={{ flex: 0.3 }}>
                            {(utils.userType == 3 || utils.userType == 4) && <View style={styles.iconContainer}>
                                {!isSelected ? (
                                    <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.iconButton}>
                                        <Icon name="cart-plus" size={20} color="#27ae60" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.iconButton}>
                                        <Icon name="cart-remove" size={20} color="#e74c3c" />
                                    </TouchableOpacity>
                                )}
                            </View>}
                        </View>
                    </View>
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
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                    }}>
                        <View style={{ marginHorizontal: 10 }}>
                            <Avatar bg="white" size="lg" source={require('../assets/image/logo.png')}></Avatar>
                        </View>
                        <View>
                            <Text style={{
                                fontSize: 19,
                                color: '#1230AE',
                                fontWeight: 'bold',
                                marginBottom: 4,
                            }}>
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
                        <>
                            <FlatList
                                data={items}
                                renderItem={renderItem}
                                contentContainerStyle={styles.listContainer}
                                onEndReached={() => { handleLoadMore }}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                            />
                            <Modal visible={showModal} transparent={true} animationType="slide" style={{ maxHeight: "90%" }}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        {(utils.userType == 1, utils.userType == 2) &&
                                            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
                                                <Text style={styles.closeIconText}>X</Text>
                                            </TouchableOpacity>
                                        }
                                        {/* <Image
                                            source={{
                                                uri: selectedItem?.images?.[0] || "https://thumbs.dreamstime.com/b/no-image-available-icon-vector-illustration-flat-design-140476186.jpg"
                                            }}
                                            style={styles.modalImage}
                                        /> */}
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={handleScroll}>
                                            {selectedItem?.images.map((imageUri, index) => (
                                                <TouchableOpacity key={index} onPress={() => handleImagePress(imageUri)}>
                                                    <Image
                                                        source={{ uri: imageUri }}
                                                        style={styles.image}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        {selectedItem?.images?.length > 1 &&
                                            <View style={styles.dotsContainer}>
                                                {selectedItem?.images.map((_, index) => (
                                                    <View
                                                        key={index}
                                                        style={[
                                                            styles.dot,
                                                            index === imageIndex && styles.activeDot
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        }
                                        <Text style={styles.modalName}>{selectedItem?.name}</Text>
                                        <ScrollView contentContainerStyle={styles.scrollContent} style={{ maxHeight: "40%" }}>
                                            <Text style={styles.modalDescription}>{selectedItem?.discription}</Text>
                                        </ScrollView>
                                        <Text style={styles.modalPrice}>Price:  ₹{selectedItem?.price}</Text>
                                        <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between" }}>
                                            {(utils.userType == 3 || utils.userType == 4) &&
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onPress={() => handleItemPress(selectedItem)}
                                                        width={'40%'}
                                                        style={[styles.closeButton, { borderRadius: 50, padding: 5 }]}
                                                        bg={alredyInCart ? '#e74c3c' : '#1230AE'}
                                                        _text={{ color: "white" }}

                                                    >
                                                        {alredyInCart ? 'Remove Item ' : 'Add to Cart'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        fontWeight="bold"
                                                        onPress={closeModal}
                                                        width={'40%'}
                                                        style={[styles.closeButton, { borderRadius: 50, padding: 5 }]}
                                                    >
                                                        Close
                                                    </Button>
                                                </>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </>
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

                    <GlobalAlert
                        visible={showAlert}
                        title={alertType}
                        message={alertMsg}
                        onConfirm={() => { setShowAlert(false) }}
                    />
                </View>
            </NativeBaseProvider>
        </SafeAreaProvider >
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
    modalContainer: {
        flex: 1,
        width: "95%",
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    modalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
        marginBottom: 20,
    },
    closeButton: {
        marginTop: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
    },
    iconButton: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        marginLeft: 10,
    },
    card: {
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#fff',
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#27ae60',
    },
    image: {
        width: 300, // Adjust the width of each image
        height: 200, // Adjust the height of each image
        borderRadius: 8,
        marginHorizontal: 5, // Spacing between images in scroll
    },
    content: {
        marginTop: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    available: {
        fontSize: 14,
        color: '#e74c3c',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        margin: 5,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'gray',
    },
    activeDot: {
        backgroundColor: 'blue',
    },

});

export default HomeScreen;
