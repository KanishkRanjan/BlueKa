import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import BackButton from '../components/BackButton';
import SquadAvatarStack from '../components/SquadAvatarStack';
import SquadInviteModal from '../components/SquadInviteModal';
import { useSquadDetails } from '../hooks/useData';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';

export default function SquadDetailScreen({ route, navigation }) {
    const { squadId } = route.params;
    const { squad, members, loading, fetchSquadDetails } = useSquadDetails(squadId);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const { user } = useAuth();

    const handleLeaveSquad = async () => {
        try {
            await api.post(`/squads/${squadId}/leave`);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to leave squad');
        }
    };

    const handleDeleteSquad = async () => {
        try {
            await api.delete(`/squads/${squadId}`);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to delete squad');
        }
    };

    const handleSettings = () => {
        const isOwner = squad.owner_id === user.id;

        if (isOwner) {
            Alert.alert(
                'Squad Settings',
                'Manage your squad',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete Squad',
                        style: 'destructive',
                        onPress: () => Alert.alert(
                            'Are you sure?',
                            'This action cannot be undone.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: handleDeleteSquad }
                            ]
                        )
                    }
                ]
            );
        } else {
            Alert.alert(
                'Squad Settings',
                'Manage your membership',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Leave Squad',
                        style: 'destructive',
                        onPress: () => Alert.alert(
                            'Leave Squad?',
                            'Are you sure you want to leave?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Leave', style: 'destructive', onPress: handleLeaveSquad }
                            ]
                        )
                    }
                ]
            );
        }
    };

    if (loading || !squad) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', color: Colors.textLight }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ padding: 24, paddingBottom: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <BackButton />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <Pressable
                            onPress={() => setInviteModalVisible(true)}
                            style={{ padding: 8, backgroundColor: Colors.primary + '20', borderRadius: 12, borderWidth: 2, borderColor: Colors.primary }}
                        >
                            <Feather name="user-plus" size={20} color={Colors.primary} />
                        </Pressable>
                        <Pressable
                            onPress={handleSettings}
                            style={{ padding: 8, backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 2, borderColor: Colors.border }}
                        >
                            <Feather name="settings" size={20} color={Colors.text} />
                        </Pressable>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text style={{ fontSize: 40, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                    {squad.squad_name}
                </Text>
                <Text style={{ fontSize: 18, color: Colors.textLight, marginBottom: 32, fontFamily: 'SpaceGrotesk_500Medium' }}>
                    {members.length} members • Active since {new Date(squad.created_at).toLocaleDateString()}
                </Text>

                {squad.invite_code && (
                    <Pressable
                        onPress={async () => {
                            await Clipboard.setStringAsync(squad.invite_code);
                            Alert.alert('Copied!', 'Invite code copied to clipboard.');
                        }}
                        style={{
                            backgroundColor: Colors.surface,
                            padding: 16,
                            borderRadius: 20,
                            marginBottom: 24,
                            borderWidth: 2,
                            borderColor: Colors.accent,
                            borderStyle: 'dashed',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            <Text style={{ fontSize: 12, color: Colors.textLight, fontFamily: 'SpaceGrotesk_700Bold', textTransform: 'uppercase' }}>
                                Invite Code
                            </Text>
                            <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.accent, letterSpacing: 2 }}>
                                {squad.invite_code}
                            </Text>
                        </View>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.accent + '20', alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name="copy" size={20} color={Colors.accent} />
                        </View>
                    </Pressable>
                )}

                <View
                    style={{
                        backgroundColor: Colors.surface,
                        padding: 24,
                        borderRadius: 32,
                        marginBottom: 24,
                        borderWidth: 2,
                        borderColor: Colors.border,
                        shadowColor: Colors.shadow,
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                            Members
                        </Text>
                        <Pressable onPress={() => setInviteModalVisible(true)}>
                            <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.primary }}>
                                + INVITE
                            </Text>
                        </Pressable>
                    </View>

                    {members.map((user, index) => (
                        <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={{ width: 24, fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold', color: index === 0 ? Colors.accent : Colors.textLight }}>
                                {index + 1}
                            </Text>
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    backgroundColor: Colors.background,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                    borderWidth: 2,
                                    borderColor: Colors.border,
                                    transform: [{ rotate: `${(index % 2 === 0 ? 1 : -1) * 3}deg` }]
                                }}
                            >
                                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text }}>
                                    {(user.full_name || user.username || '?').charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <Text style={{ flex: 1, fontSize: 18, fontFamily: 'SpaceGrotesk_500Medium', color: Colors.text }}>
                                {user.full_name || user.username || 'Unknown'}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <SquadInviteModal
                visible={inviteModalVisible}
                onClose={() => setInviteModalVisible(false)}
                squadId={squadId}
                onInviteSent={() => setInviteModalVisible(false)}
            />
        </SafeAreaView>
    );
}
