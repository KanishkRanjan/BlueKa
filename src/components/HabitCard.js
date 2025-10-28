import React from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';
import StreakFlame from './StreakFlame';

export default function HabitCard({ title, habit_name, streak, completed, onPress }) {
    const rawTitle = title || habit_name || 'Untitled Habit';
    const displayTitle = typeof rawTitle === 'string' ? rawTitle : String(rawTitle);
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(scale, {
            toValue: 0.98,
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
            style={{ marginBottom: 16 }}
        >
            <Animated.View
                style={{
                    backgroundColor: completed ? Colors.success + '15' : Colors.surface,
                    padding: 24,
                    borderRadius: 32,
                    borderWidth: 2,
                    borderColor: completed ? Colors.success : Colors.border,
                    transform: [{ scale }],
                    shadowColor: Colors.shadow,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.6,
                    shadowRadius: 16,
                    elevation: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: 'SpaceGrotesk_700Bold',
                            color: Colors.text,
                            marginBottom: 4,
                            textDecorationLine: completed ? 'line-through' : 'none',
                            textDecorationStyle: 'solid',
                        }}
                    >
                        {displayTitle}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors.textLight,
                            fontFamily: 'PatrickHand_400Regular'
                        }}
                    >
                        {completed ? 'Crushed it! 🔥' : 'Let\'s get it done'}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <StreakFlame streak={streak} active={completed} />
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 16,
                            backgroundColor: completed ? Colors.success : Colors.background,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: completed ? Colors.success : Colors.border,
                        }}
                    >
                        {completed && (
                            <Feather name="check" size={24} color={Colors.surface} strokeWidth={4} />
                        )}
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    );
}
