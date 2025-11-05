import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import SquadScreen from '../screens/SquadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IdentityListScreen from '../screens/IdentityListScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopWidth: 2,
                    borderTopColor: Colors.border,
                    height: Platform.OS === 'ios' ? 90 : 70,
                    paddingTop: 10,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    elevation: 0,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textLight,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name="home" size={24} color={color} strokeWidth={focused ? 3 : 2} />
                            {focused && (
                                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 4 }} />
                            )}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Identities"
                component={IdentityListScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Squads"
                component={SquadScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name="users" size={24} color={color} strokeWidth={focused ? 3 : 2} />
                            {focused && (
                                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 4 }} />
                            )}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name="user" size={24} color={color} strokeWidth={focused ? 3 : 2} />
                            {focused && (
                                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 4 }} />
                            )}
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
