// AppTabs.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {useTheme} from "../context/theme/ThemeContext.tsx";

import HomeScreen from "../screens/home/HomeScreen.tsx";
import CalenderScreen from "../screens/calender/View/CalenderScreen.tsx";
import LibraryScreen from "../screens/library/LibraryScreen.tsx";
import MyPageScreen from "../screens/myPage/MyPageScreen.tsx";


const Tab = createBottomTabNavigator();

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <MyTabBar {...props} />}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'HOME' }} />
            <Tab.Screen name="Calender" component={CalenderScreen} options={{ tabBarLabel: 'CALENDER' }} />
            <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: 'LIBRARY' }} />
            <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: 'MY PAGE' }} />
        </Tab.Navigator>
    );
}

function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme()
    return (
        <View style={[{
            height: 90,
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.textSecondary,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom
        }]}>
            {state.routes.map((route, idx) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === idx;
                const label = options.tabBarLabel;

                const iconName =
                    route.name === 'Home'    ? 'home-outline' :
                    route.name === 'Calender'? 'calendar-outline' :
                    route.name === 'Library'  ? 'barbell-outline' :
                    route.name === 'MyPage'  ? 'person-outline' :
                    'ellipse-outline';

                const onPress = () => {
                    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                    if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as never);
                };

                return (
                    <Pressable
                        key={route.key}
                        onPress={onPress}
                        android_ripple={undefined}
                        style={{
                            flex: 1, height: 90, alignItems: 'center', justifyContent: 'center', gap: 4
                        }}
                        hitSlop={10}
                        accessibilityRole="tab"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={typeof label === 'string' ? label : undefined}
                    >
                        <Ionicons
                            name={iconName}
                            size={22}
                            color={isFocused ? colors.brandBlue : colors.textPrimary}
                        />

                        <Text style={{
                            fontSize: 11,
                            fontWeight: '600',
                            color: isFocused ? colors.brandBlue : colors.textPrimary
                        }}
                              numberOfLines={1}>
                            {String(label)}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}