import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { HStack, Box, NativeBaseProvider, Pressable, Center, Icon } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import HomeScreen from './HomeScreen';
import CouponScreen from './CouponScreen';
import CartScreen from './CartScreen';
import SettingsScreen from './SettingScreen';
import utils from '../services/utils';
import { useTranslation } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import i18n from '../services/i18n';

const NavigationController = () => {
    const [selected, setSelected] = useState(0);
    const { t } = useTranslation();

    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <Box flex={1} bg="white" safeAreaTop width="100%" alignSelf="center">
                    <View style={{ width: '100%', height: '92%' }}>
                        {selected === 0 && <HomeScreen />}
                        {selected === 1 && <CartScreen />}
                        {selected === 2 && <CouponScreen />}
                        {selected === 3 && <SettingsScreen />}
                    </View>
                    <LinearGradient
                        colors={['#01BAE8', '#010CE8']}
                        style={{ height: '8%', flexDirection: 'row', alignItems: 'center' }}
                    >
                        <HStack alignItems="center" justifyContent="space-around" flex={1}>
                            <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
                                <Center>
                                    <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="lg" />
                                    <Text style={{ color: '#fff', fontSize: 16 }}>{t("Home")}</Text>
                                </Center>
                            </Pressable>
                            {(utils.userType === 3 || utils.userType === 4) && (
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
                    </LinearGradient>
                </Box>
            </NativeBaseProvider>
        </SafeAreaProvider>
    );
};

export default NavigationController;
