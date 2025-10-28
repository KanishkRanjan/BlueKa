import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../constants/Colors';

export default function SquadAvatarStack({ users = [] }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 8 }}>
            {users.slice(0, 3).map((user, index) => (
                <View
                    key={index}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8, // Polaroid style square-ish
                        backgroundColor: Colors.surface,
                        borderWidth: 2,
                        borderColor: Colors.text,
                        marginLeft: -12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3 - index,
                        transform: [{ rotate: `${(index % 2 === 0 ? 1 : -1) * 6}deg` }],
                        shadowColor: Colors.shadow,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                    }}
                >
                    <Text style={{ fontSize: 12, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                        {user.initials || user.name?.substring(0, 2).toUpperCase() || '??'}
                    </Text>
                </View>
            ))}
            {users.length > 3 && (
                <View
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: Colors.accent,
                        borderWidth: 2,
                        borderColor: Colors.text,
                        marginLeft: -12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 0,
                        transform: [{ rotate: '4deg' }],
                    }}
                >
                    <Text style={{ fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                        +{users.length - 3}
                    </Text>
                </View>
            )}
        </View>
    );
}
