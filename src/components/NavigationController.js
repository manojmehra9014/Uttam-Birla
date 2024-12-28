import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HStack, Box, NativeBaseProvider, Pressable, Center, Icon } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './HomeScreen';
import CouponScreen from './CouponScreen';
import CartScreen from './CartScreen';
import SettingsScreen from './SettingScreen';
import utils from '../services/utils';
import { useTranslation } from 'react-i18next';
const NavigationController = () => {
    const [selected, setSelected] = useState(0);
    const [userType, setUserType] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        const fetchUserType = () => {
            setUserType(utils.userType || 2);
        };
        fetchUserType();
    }, []);

    return (
        <NativeBaseProvider>
            <Box flex={1} bg="white" safeAreaTop width="100%" alignSelf="center">
                <View style={{ width: '100%', height: '92%' }}>
                    {selected === 0 && <HomeScreen />}
                    {selected === 1 && <CartScreen />}
                    {selected === 2 && <CouponScreen />}
                    {selected === 3 && <SettingsScreen />}
                </View>

                <HStack bg="#1230AE" alignItems="center" height="8%" safeAreaBottom shadow={6}>
                    <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
                        <Center>
                            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="lg" />
                            <Text style={{ color: '#fff', fontSize: 16 }}>{t("Home")}</Text>
                        </Center>
                    </Pressable>
                    {(userType === 3 || userType === 4) && (
                        <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(1)}>
                            <Center>
                                <Icon mb="1" as={<MaterialCommunityIcons name={selected === 1 ? 'cart' : 'cart-outline'} />} color="white" size="lg" />
                                <Text style={{ color: '#fff', fontSize: 16 }}>{t("Cart")}</Text>
                            </Center>
                        </Pressable>
                    )}
                    <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
                        <Center>
                            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? 'cards' : 'cards-outline'} />} color="white" size="lg" />
                            <Text style={{ color: '#fff', fontSize: 16 }}>{t("Coupon")}</Text>
                        </Center>
                    </Pressable>
                    <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
                        <Center>
                            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} color="white" size="lg" />
                            <Text style={{ color: '#fff', fontSize: 16 }}>{t("Setting")}</Text>
                        </Center>
                    </Pressable>
                </HStack>
            </Box>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { fontSize: 24, marginBottom: 16, textAlign: 'center', color: 'black' },
});

export default NavigationController;
