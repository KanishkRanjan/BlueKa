import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import BackButton from '../components/BackButton';

export default function SettingsScreen() {
    const [notifications, setNotifications] = React.useState(true);
    const [haptics, setHaptics] = React.useState(true);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ padding: 24, paddingBottom: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                    <BackButton />
                    <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginLeft: 16 }}>
                        SETTINGS
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View style={{ marginBottom: 32 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.textLight, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Preferences
                    </Text>

                    <View
                        style={{
                            backgroundColor: Colors.surface,
                            borderRadius: 24,
                            borderWidth: 2,
                            borderColor: Colors.border,
                            overflow: 'hidden'
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 2, borderBottomColor: Colors.border }}>
                            <Text style={{ fontSize: 18, fontFamily: 'SpaceGrotesk_500Medium', color: Colors.text }}>Notifications</Text>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: Colors.border, true: Colors.success }}
                                thumbColor={Colors.surface}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                            <Text style={{ fontSize: 18, fontFamily: 'SpaceGrotesk_500Medium', color: Colors.text }}>Haptics</Text>
                            <Switch
                                value={haptics}
                                onValueChange={setHaptics}
                                trackColor={{ false: Colors.border, true: Colors.success }}
                                thumbColor={Colors.surface}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <Text style={{ fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 8 }}>
                        BlueKa
                    </Text>
                    <Text style={{ fontSize: 16, color: Colors.textLight, fontFamily: 'SpaceGrotesk_500Medium' }}>
                        Version 1.0.0 (Electric Edition)
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.textLight, marginTop: 8, fontFamily: 'PatrickHand_400Regular' }}>
                        Made with ⚡️ by Mateo
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
