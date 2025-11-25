import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import BackButton from '../components/BackButton';
import { useSquads } from '../hooks/useData';

export default function CreateSquadScreen({ navigation }) {
    const [name, setName] = useState('');
    const { createSquad } = useSquads();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        const result = await createSquad(name);
        setLoading(false);

        if (result.success) {
            navigation.goBack();
        } else {
            alert(result.error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, padding: 24 }}
            >
                <View style={{ marginTop: 20 }}>
                    <BackButton />
                </View>

                <View style={{ marginTop: 40 }}>
                    <Text style={{ fontSize: 40, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                        NEW SQUAD.
                    </Text>
                    <Text style={{ fontSize: 20, color: Colors.textLight, marginBottom: 40, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        Gather your people.
                    </Text>

                    <View style={{ gap: 24 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                                SQUAD NAME
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: Colors.surface,
                                    padding: 20,
                                    borderRadius: 20,
                                    fontSize: 18,
                                    borderWidth: 2,
                                    borderColor: Colors.border,
                                    color: Colors.text,
                                    fontFamily: 'SpaceGrotesk_500Medium',
                                }}
                                placeholder="The Early Birds"
                                placeholderTextColor={Colors.textLight + '80'}
                                value={name}
                                onChangeText={setName}
                                autoFocus
                            />
                        </View>

                        <PrimaryButton
                            title={loading ? "CREATING..." : "CREATE SQUAD"}
                            onPress={handleCreate}
                            style={{ marginTop: 20 }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
