import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { HStack, Box, NativeBaseProvider, Pressable, Center, Icon } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const NavigationController = () => {
    const [selected, setSelected] = useState(0);
    return (
        <NativeBaseProvider>
            <Box flex={1} bg="white" safeAreaTop width="100%" alignSelf="center">
                <View style={{ width: "100%", height: "92%" }}>
                    <Text style={styles.title}>Welcome to Home Screen</Text>
                </View>

                <HStack bg="indigo.600" alignItems="center" height={"8%"} safeAreaBottom shadow={6}>
                    <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
                        <Center>
                            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="lg" />
                            <Text color="white" fontSize="16">
                                Home
                            </Text>
                        </Center>
                    </Pressable>
                    <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(1)}>
                        <Center>
                            <Icon mb="1" as={<MaterialIcons name="search" />} color="white" size="lg" />
                            <Text color="white" fontSize="16">
                                Search
                            </Text>
                        </Center>
                    </Pressable>
                    <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
                        <Center>
                            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? 'cart' : 'cart-outline'} />} color="white" size="lg" />
                            <Text color="white" fontSize="16">
                                Cart
                            </Text>
                        </Center>
                    </Pressable>
                    <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
                        <Center>
                            <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} color="white" size="lg" />
                            <Text color="white" fontSize="16">
                                Account
                            </Text>
                        </Center>
                    </Pressable>
                </HStack>
            </Box>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { fontSize: 24, marginBottom: 16, textAlign: 'center', color: "black" },
});

export default NavigationController;
