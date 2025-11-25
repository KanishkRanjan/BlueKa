import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { useIdentities } from '../hooks/useIdentities';

export default function IdentityListScreen({ navigation }) {
    const { identities, loading, fetchIdentities } = useIdentities();

    useFocusEffect(
        useCallback(() => {
            fetchIdentities();
        }, [])
    );

    const renderItem = ({ item, index }) => (
        <Pressable
            onPress={() => navigation.navigate('CreateIdentity', { identity: item })}
            style={{
                backgroundColor: item.color_theme || Colors.surface,
                padding: 24,
                borderRadius: 32,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: Colors.border,
                transform: [{ rotate: index % 2 === 0 ? '-1deg' : '1deg' }],
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                        {item.identity_name}
                    </Text>
                    {item.vision_statement && (
                        <Text style={{ fontSize: 16, fontFamily: 'PatrickHand_400Regular', color: Colors.text, marginTop: 4 }}>
                            "{item.vision_statement}"
                        </Text>
                    )}
                </View>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                    <Feather name={item.icon || 'user'} size={20} color={Colors.text} />
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ padding: 24, paddingBottom: 0 }}>
                <Text style={{ fontSize: 36, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                    WHO ARE YOU?
                </Text>
                <Text style={{ fontSize: 18, color: Colors.textLight, marginBottom: 24, fontFamily: 'SpaceGrotesk_500Medium' }}>
                    Define your identities. Build habits around them.
                </Text>
            </View>

            <FlatList
                data={identities}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 24 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchIdentities} tintColor={Colors.primary} />}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', color: Colors.textLight, textAlign: 'center' }}>
                            You haven't defined any identities yet.{'\n'}Are you a Runner? A Writer? A Friend?
                        </Text>
                    </View>
                }
            />

            <Pressable
                onPress={() => navigation.navigate('CreateIdentity')}
                style={{
                    position: 'absolute',
                    bottom: 32,
                    right: 32,
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: Colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: Colors.text,
                    shadowColor: Colors.shadow,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                }}
            >
                <Feather name="plus" size={32} color="#FFF" />
            </Pressable>
        </SafeAreaView>
    );
}
