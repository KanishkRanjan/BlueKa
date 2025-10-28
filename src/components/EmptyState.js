import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function EmptyState({ icon, message, subMessage }) {
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                opacity: 0.9,
            }}
        >
            <View
                style={{
                    width: 88,
                    height: 88,
                    borderRadius: 32,
                    backgroundColor: Colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    transform: [{ rotate: '-6deg' }],
                    borderWidth: 2,
                    borderColor: Colors.border,
                    shadowColor: Colors.shadow,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                }}
            >
                <Feather name={icon} size={40} color={Colors.primary} strokeWidth={2.5} />
            </View>
            <Text
                style={{
                    fontSize: 20,
                    fontFamily: 'SpaceGrotesk_700Bold',
                    color: Colors.text,
                    textAlign: 'center',
                    marginBottom: 8,
                }}
            >
                {message}
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    color: Colors.textLight,
                    textAlign: 'center',
                    lineHeight: 24,
                    fontFamily: 'PatrickHand_400Regular',
                }}
            >
                {subMessage}
            </Text>
        </View>
    );
}
