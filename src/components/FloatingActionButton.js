import React, { useEffect } from 'react';
import { Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';

export default function FloatingActionButton({ onPress }) {
    const scale = React.useRef(new Animated.Value(1)).current;
    const pulse = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.spring(scale, {
            toValue: 0.9,
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
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{
                position: 'absolute',
                bottom: 32,
                right: 24,
            }}
        >
            <Animated.View style={{ transform: [{ scale }, { scale: pulse }] }}>
                <LinearGradient
                    colors={[Colors.primary, Colors.accent]}
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: Colors.primary,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.5,
                        shadowRadius: 16,
                        elevation: 10,
                        borderWidth: 2,
                        borderColor: Colors.surface,
                    }}
                >
                    <Feather name="plus" size={32} color={Colors.surface} strokeWidth={3} />
                </LinearGradient>
            </Animated.View>
        </Pressable>
    );
}
