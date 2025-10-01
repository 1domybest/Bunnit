import {Text, View} from "react-native";
import {useTheme} from "../../context/theme/ThemeContext.tsx";


export default function MyPageScreen() {
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
                마이페이지
            </Text>
        </View>
    )
}