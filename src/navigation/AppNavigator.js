/* BLUEKA DESIGN MANIFESTO – Designed by Mateo Cruz
1. Warm & slightly desaturated palette with one bold coral/orange accent
2. Everything feels hand-touched: mixed corner radii (12, 20, 32), uneven padding on purpose
3. Never perfectly centered – always a little breathing room or playful offset
4. Typography: One display font (bold, rounded) + one clean sans. Never more than 3 sizes per screen
5. Micro-interactions everywhere – springs, delays, scale on press
6. Empty states are funny and make you smile
7. Onboarding speaks like a real friend who cares about you
8. Nothing looks like Notion or generic SaaS – this must feel like an indie game from 2019
*/

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import CreateIdentityScreen from '../screens/CreateIdentityScreen';
import SquadDetailScreen from '../screens/SquadDetailScreen';
import CreateSquadScreen from '../screens/CreateSquadScreen';
import SquadSearchScreen from '../screens/SquadSearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                // Auth Stack
                <>
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : (
                // Main Stack
                <>
                    <Stack.Screen name="Main" component={TabNavigator} />
                    <Stack.Screen
                        name="CreateHabit"
                        component={CreateHabitScreen}
                        options={{ presentation: 'modal' }}
                    />
                    <Stack.Screen
                        name="CreateSquad"
                        component={CreateSquadScreen}
                        options={{ presentation: 'modal' }}
                    />
                    <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
                    <Stack.Screen
                        name="CreateIdentity"
                        component={CreateIdentityScreen}
                        options={{ presentation: 'modal' }}
                    />
                    <Stack.Screen name="SquadDetail" component={SquadDetailScreen} />
                    <Stack.Screen name="SquadSearch" component={SquadSearchScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}
