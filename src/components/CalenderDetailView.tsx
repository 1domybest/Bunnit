import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import {useTheme} from "../context/theme/ThemeContext.tsx";
import {color} from "ansi-fragments";
import {SafeAreaView} from "react-native-safe-area-context";
import styled from "styled-components/native";
import {useNavigation} from "@react-navigation/core";
import {useState} from "react";

export default function CalenderDetailView() {
    const { colors } = useTheme()
    const navigation = useNavigation();
    const [salary, setSalary] = useState<number>(5000)
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.background }}
        >
            <View style={{
                flex: 1,
                backgroundColor: colors.background,
                flexDirection: "column",
                justifyContent: 'space-between',
                paddingHorizontal: 20,
            }}>
                <View style={{ flexDirection: "column", gap: 40}}>
                    {/* 히더 */}
                    <View style={{ flexDirection: "row", justifyContent: "center"}}>
                        <Image
                            style={{ width: 100, height: 100, aspectRatio: 1, borderRadius: 50, borderWidth: 1, borderColor: colors.textPrimary}}
                            source={{ uri: "https://spinback-uploads.s3.ap-southeast-2.amazonaws.com/IMG_3529.JPG"}}
                        />
                    </View>

                    <View style={{ flexDirection: "column", gap: 20}}>
                        <ContentRow style={{ flexDirection: "row", gap: 15}}>
                            <Title>
                                이름
                            </Title>
                            <ContentView>
                                온석태
                            </ContentView>
                        </ContentRow>


                        <ContentRow style={{ flexDirection: "row", gap: 15}}>
                            <Title>
                                생년월일
                            </Title>
                            <ContentView>
                                1996.04.18 (만 29세)
                            </ContentView>
                        </ContentRow>

                        <View></View>

                        <ContentRow style={{ flexDirection: "row", gap: 15}}>
                            <Title>
                                장점1
                            </Title>
                            <ContentView>
                                일주면 좋아함
                            </ContentView>
                        </ContentRow>

                        <ContentRow style={{ flexDirection: "row", gap: 15}}>
                            <Title>
                                장점2
                            </Title>
                            <ContentView>
                                영어 잘함
                            </ContentView>
                        </ContentRow>

                        <View></View>

                        <ContentRow style={{ flexDirection: "row", gap: 15}}>
                            <Title style={{ fontSize: 7}}>
                                이전 직장 연봉
                            </Title>
                            <ContentView style={{ fontSize: 7}}>
                                4300만원
                            </ContentView>
                        </ContentRow>

                        <ContentRow style={{ flexDirection: "row", gap: 15}}>
                            <Title>
                                희망연봉
                            </Title>
                            <ContentView style={{ color: "red", fontSize: 20}}>
                                {salary} 만원
                            </ContentView>
                        </ContentRow>

                        <ContentRow style={{ flexDirection: "row", gap: 15}}>
                            <Title style={{ fontSize: 7 }}>
                                최소 희망연봉
                            </Title>
                            <ContentView style={{ fontSize: 7}}>
                                {" 4500만원 이상"}
                            </ContentView>
                        </ContentRow>
                    </View>
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: colors.brandBlue, borderRadius: 10 }}
                    onPress={() => {
                        Alert.alert(
                            '요청',
                            '속는셈 치고 요청해보기',
                            [
                                {text: '희망연봉대로 맞춰주기',
                                    onPress: () => {
                                        Alert.alert("휴~")
                                    },
                                    style: 'destructive'
                                },
                                {text: '협상 요청하기',
                                    onPress: () => {
                                        const newPrice:number = salary + 500
                                        setSalary(newPrice)
                                        Alert.alert("ㅋ.ㅋ 협상완료")
                                    },
                                    style: 'cancel',
                                },
                            ],
                        );

                    }}
                >
                    <Text style={{
                        color: colors.brandTextPrimary,
                        paddingVertical: 15,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 15,
                    }}>
                        희망연봉 협상해보기
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const CustomText = styled.Text`
    color: ${({ theme }) => theme.textPrimary};
`

const Title = styled.Text`
    color: ${({ theme }) => theme.textPrimary};
    font-size: 20;
    align-self: center;
    font-weight: bold;
`
const ContentView = styled.Text`
    color: ${({ theme }) => theme.textPrimary};
    font-size: 15px;
    align-self: center;
    flex: 1;
    background-color: ${({ theme }) => theme.textPrimary};
    border-radius: 5px;
    align-self: center;
    padding: 10px;
    color: ${({ theme }) => theme.background};
`

const ContentRow = styled.View`
  flex-direction: row;
    gap: 15px;
`

