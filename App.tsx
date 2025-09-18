import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-blue-600 mb-4">
        Hello Sir! ✋🏽
      </Text>
      <Text className="text-base text-gray-700 text-center px-6">
        I have worked on backend for now 
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
