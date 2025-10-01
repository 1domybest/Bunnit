import {Text, View} from "react-native";
import {useTheme} from "../../context/theme/ThemeContext.tsx";


export default function LibraryScreen() {
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
                라이브러리
            </Text>
        </View>
    )
}