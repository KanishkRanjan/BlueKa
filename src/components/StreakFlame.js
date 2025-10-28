import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function StreakFlame({ streak, active }) {
    if (streak === 0) return null;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather
                name="zap"
                size={20}
                color={active ? Colors.accent : Colors.textLight}
                strokeWidth={3}
            />
            <Text
                style={{
                    fontSize: 18,
                    fontFamily: 'PatrickHand_400Regular',
                    color: active ? Colors.accent : Colors.textLight,
                }}
            >
                {streak}
            </Text>
        </View>
    );
}
