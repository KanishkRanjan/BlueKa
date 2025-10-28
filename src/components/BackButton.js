import React from 'react';
import { Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';

export default function BackButton() {
    const navigation = useNavigation();
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(scale, {
            toValue: 0.8,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    return (
        <Pressable
            onPress={() => navigation.goBack()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{
                marginLeft: 8,
                padding: 8,
            }}
        >
            <Animated.View
                style={{
                    backgroundColor: Colors.surface,
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ scale }],
                    shadowColor: Colors.shadow,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 1,
                    shadowRadius: 12,
                    elevation: 4,
                    borderWidth: 2,
                    borderColor: Colors.border,
                }}
            >
                <Feather name="arrow-left" size={24} color={Colors.text} strokeWidth={3} />
            </Animated.View>
        </Pressable>
    );
}
