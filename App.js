import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_700Bold, SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk';
import { PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import { registerRootComponent } from 'expo';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import Colors from './src/constants/Colors';
import "./global.css"

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        SpaceGrotesk_700Bold,
        SpaceGrotesk_500Medium,
        PatrickHand_400Regular,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <SafeAreaProvider>
                <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                    <NavigationContainer>
                        <StatusBar style="dark" backgroundColor={Colors.background} />
                        <AppNavigator />
                    </NavigationContainer>
                </View>
            </SafeAreaProvider>
        </AuthProvider>
    );
}

registerRootComponent(App);
