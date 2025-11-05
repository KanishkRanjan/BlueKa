import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import BackButton from '../components/BackButton';

import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return;
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (!result.success) {
            alert(result.error);
        }
        // Navigation is handled by AppNavigator based on user state
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

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 40, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                        WELCOME BACK.
                    </Text>
                    <Text style={{ fontSize: 20, color: Colors.textLight, marginBottom: 40, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        Ready to crush it?
                    </Text>

                    <View style={{ gap: 24 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                                EMAIL
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
                                placeholder="hello@blueka.app"
                                placeholderTextColor={Colors.textLight + '80'}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text style={{ fontSize: 16, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8, marginLeft: 4 }}>
                                PASSWORD
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
                                placeholder="••••••••"
                                placeholderTextColor={Colors.textLight + '80'}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <PrimaryButton title="SIGN IN" onPress={handleLogin} style={{ marginTop: 20 }} />
                    </View>

                    <Pressable onPress={() => navigation.navigate('Register')} style={{ marginTop: 32, alignItems: 'center' }}>
                        <Text style={{ color: Colors.textLight, fontSize: 16, fontFamily: 'SpaceGrotesk_500Medium' }}>
                            New here? <Text style={{ color: Colors.primary, fontFamily: 'SpaceGrotesk_700Bold' }}>Create an account</Text>
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
