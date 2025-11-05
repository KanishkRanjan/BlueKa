import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import BackButton from '../components/BackButton';
import { useIdentities } from '../hooks/useIdentities';

export default function CreateIdentityScreen({ navigation, route }) {
    const existingIdentity = route.params?.identity;
    const { createIdentity, updateIdentity, deleteIdentity } = useIdentities();

    const [name, setName] = useState(existingIdentity?.identity_name || '');
    const [vision, setVision] = useState(existingIdentity?.vision_statement || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;
        setLoading(true);

        let result;
        if (existingIdentity) {
            result = await updateIdentity(existingIdentity.id, {
                identity_name: name,
                vision_statement: vision
            });
        } else {
            result = await createIdentity({
                identity_name: name,
                vision_statement: vision
            });
        }

        setLoading(false);
        if (result.success) {
            navigation.goBack();
        } else {
            alert(result.error);
        }
    };

    const handleDelete = async () => {
        if (!existingIdentity) return;
        setLoading(true);
        const result = await deleteIdentity(existingIdentity.id);
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
                style={{ flex: 1 }}
            >
                <View style={{ padding: 24, paddingBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BackButton />
                    {existingIdentity && (
                        <Pressable onPress={handleDelete} style={{ padding: 8 }}>
                            <Feather name="trash-2" size={24} color={Colors.accent} />
                        </Pressable>
                    )}
                </View>

                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <Text style={{ fontSize: 36, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                        {existingIdentity ? 'EDIT IDENTITY' : 'NEW IDENTITY'}
                    </Text>
                    <Text style={{ fontSize: 18, color: Colors.textLight, marginBottom: 32, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        I am a...
                    </Text>

                    <View style={{ gap: 24 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                                IDENTITY NAME
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: Colors.surface,
                                    padding: 20,
                                    borderRadius: 20,
                                    fontSize: 20,
                                    fontFamily: 'SpaceGrotesk_500Medium',
                                    borderWidth: 2,
                                    borderColor: Colors.border,
                                    color: Colors.text,
                                }}
                                placeholder="e.g. Runner, Writer, Father"
                                placeholderTextColor={Colors.textLight + '80'}
                                value={name}
                                onChangeText={setName}
                                autoFocus={!existingIdentity}
                            />
                        </View>

                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                                VISION STATEMENT (OPTIONAL)
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: Colors.surface,
                                    padding: 20,
                                    borderRadius: 20,
                                    fontSize: 18,
                                    fontFamily: 'PatrickHand_400Regular',
                                    borderWidth: 2,
                                    borderColor: Colors.border,
                                    color: Colors.text,
                                    minHeight: 100,
                                    textAlignVertical: 'top',
                                }}
                                placeholder="I run to feel alive and explore the world."
                                placeholderTextColor={Colors.textLight + '80'}
                                value={vision}
                                onChangeText={setVision}
                                multiline
                            />
                        </View>

                        <PrimaryButton
                            title={loading ? "SAVING..." : "SAVE IDENTITY"}
                            onPress={handleSave}
                            style={{ marginTop: 24 }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
