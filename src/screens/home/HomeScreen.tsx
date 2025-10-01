import {Text, View} from "react-native";
import {useTheme} from "../../context/theme/ThemeContext.tsx";


export default function HomeScreen() {
    const { colors } = useTheme()
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text
                style={{ color: colors.textPrimary}}
            >
                홈
            </Text>
        </View>
    )
}