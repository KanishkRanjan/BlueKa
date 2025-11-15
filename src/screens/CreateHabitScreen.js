import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import BackButton from '../components/BackButton';

import { useHabits } from '../hooks/useData';

export default function CreateHabitScreen() {
    const navigation = useNavigation();
    const { createHabit } = useHabits();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title) return;
        setLoading(true);
        const result = await createHabit({ habit_name: title, description });
        setLoading(false);

        if (result.success) {
            navigation.goBack();
        } else {
            Alert.alert('Error', result.error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={{ padding: 24, paddingBottom: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                        <BackButton />
                        <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginLeft: 16 }}>
                            NEW RITUAL
                        </Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <Text style={{ fontSize: 36, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                        WHAT'S THE GOAL?
                    </Text>
                    <Text style={{ fontSize: 18, color: Colors.textLight, marginBottom: 32, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        Dream big. Start now.
                    </Text>

                    <View style={{ gap: 24 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                                NAME IT
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
                                placeholder="e.g. Morning Walk"
                                placeholderTextColor={Colors.textLight + '80'}
                                value={title}
                                onChangeText={setTitle}
                                autoFocus
                            />
                        </View>

                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                                WHY DOES IT MATTER? (OPTIONAL)
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: Colors.surface,
                                    padding: 20,
                                    borderRadius: 20,
                                    fontSize: 18,
                                    fontFamily: 'SpaceGrotesk_500Medium',
                                    borderWidth: 2,
                                    borderColor: Colors.border,
                                    color: Colors.text,
                                    minHeight: 120,
                                    textAlignVertical: 'top',
                                }}
                                placeholder="To clear my head..."
                                placeholderTextColor={Colors.textLight + '80'}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        <PrimaryButton title="START HABIT" onPress={handleCreate} style={{ marginTop: 24 }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
