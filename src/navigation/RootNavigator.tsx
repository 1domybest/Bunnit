import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootTabs from './RootTabs';

// 예: 탭 외부에서 보여줄 추가 화면
import CalenderDetailView from "../components/CalenderDetailView.tsx";
import {useTheme} from "../context/theme/ThemeContext.tsx";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { colors } = useTheme()
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* 탭 전체를 Stack의 한 화면처럼 사용 */}
                <Stack.Screen name="RootTabs" component={RootTabs} options={{ headerShown: false, title: "캘린더" }} />

                {/* 탭과 별도로 Push할 수 있는 스크린들 */}
                <Stack.Screen name="CalendarDetail" component={CalenderDetailView} options={{
                    headerStyle: { backgroundColor: colors.background},
                    headerTitleStyle: { color: colors.textPrimary }, title: "협상 테이블"
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}