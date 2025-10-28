import React from 'react';
import { Text, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';

export default function PrimaryButton({ title, onPress, style }) {
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(scale, {
            toValue: 0.95,
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
            style={style}
        >
            <Animated.View style={{ transform: [{ scale }] }}>
                <LinearGradient
                    colors={[Colors.primary, Colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        paddingVertical: 18,
                        paddingHorizontal: 32,
                        borderRadius: 32,
                        shadowColor: Colors.primary,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.4,
                        shadowRadius: 16,
                        elevation: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: Colors.surface,
                            fontSize: 18,
                            fontFamily: 'SpaceGrotesk_700Bold',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                        }}
                    >
                        {title}
                    </Text>
                </LinearGradient>
            </Animated.View>
        </Pressable>
    );
}
