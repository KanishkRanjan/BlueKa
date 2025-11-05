import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: "WAKE UP.",
        description: "Stop sleepwalking through life. It's time to build habits that actually stick.",
        icon: "zap"
    },
    {
        id: '2',
        title: "GET ADDICTED.",
        description: "To progress. To growth. To becoming the person you know you can be.",
        icon: "trending-up"
    },
    {
        id: '3',
        title: "FIND YOUR TRIBE.",
        description: "Don't go it alone. Join a squad and push each other to the limit.",
        icon: "users"
    },
    {
        id: '4',
        title: "LET'S RAGE.",
        description: "Your new life starts right now. Are you ready to level up?",
        icon: "play-circle"
    }
];

export default function OnboardingScreen() {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0]?.index || 0);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.navigate('Register');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={SLIDES}
                    renderItem={({ item }) => (
                        <View style={{ width, alignItems: 'center', padding: 40, paddingTop: 80 }}>
                            <View
                                style={{
                                    width: 280,
                                    height: 280,
                                    backgroundColor: Colors.surface,
                                    borderRadius: 40,
                                    marginBottom: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 3,
                                    borderColor: Colors.text,
                                    transform: [{ rotate: '-3deg' }],
                                    shadowColor: Colors.shadow,
                                    shadowOffset: { width: 0, height: 12 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 20,
                                }}
                            >
                                <Feather name={item.icon} size={100} color={Colors.primary} strokeWidth={1.5} />
                            </View>
                            <Text style={{ fontSize: 40, fontFamily: 'SpaceGrotesk_700Bold', color: Colors.text, marginBottom: 16, textAlign: 'center', textTransform: 'uppercase' }}>
                                {item.title}
                            </Text>
                            <Text style={{ fontSize: 18, color: Colors.textLight, textAlign: 'center', lineHeight: 28, fontFamily: 'SpaceGrotesk_500Medium' }}>
                                {item.description}
                            </Text>
                        </View>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 40 }}>
                <View style={{ flexDirection: 'row', height: 64 }}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 30, 10],
                            extrapolate: 'clamp',
                        });
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={i.toString()}
                                style={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: Colors.primary,
                                    marginHorizontal: 8,
                                    width: dotWidth,
                                    opacity,
                                }}
                            />
                        );
                    })}
                </View>

                <PrimaryButton
                    title={currentIndex === SLIDES.length - 1 ? "LET'S GO" : "NEXT"}
                    onPress={handleNext}
                    style={{ width: '80%' }}
                />
            </View>
        </SafeAreaView>
    );
}
