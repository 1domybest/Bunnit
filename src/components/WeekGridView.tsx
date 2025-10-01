import React from "react";
import {View, Dimensions, TouchableOpacity, Text} from "react-native";
import styled from "styled-components/native";

import {DayCell} from "../utill/CalenderUtill.ts";
import {useTheme} from "../context/theme/ThemeContext.tsx";


const CELL = Math.floor((Dimensions.get("window").width - 30) / 7);

export default function WeekGridView({ cells, selectedCell, onSelectCell }:
                                     { cells: DayCell[]; selectedCell: DayCell | null; onSelectCell: (cell: DayCell) => void; }) {

    const { colors } = useTheme();

    return (
        <View style={[{ width: Dimensions.get("window").width, overflow: 'hidden', flexDirection: "row", paddingHorizontal: 15, justifyContent:"space-between" }]}>
            {cells.map((c) => (
                <TouchableOpacity
                    key={c.date.toISOString()}
                    style={[
                        {
                            width: CELL,
                            height: CELL,
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: 'hidden'
                        }
                    ]}
                    onPress={() => {
                        if (c.isCurrentMonth) {
                            onSelectCell?.(c)
                        }
                    }}
                >
                    <View
                        style={{
                            width: CELL - 15,
                            height: CELL - 15,
                            borderRadius: 30,
                            borderColor: colors.danger,
                            borderWidth: c.isToday ? 1 : 0,
                            backgroundColor: selectedCell?.id === c.id ? colors.brandBlue : "clear",
                            justifyContent: "center"
                        }}
                    >
                        <Text
                            style={{
                                opacity: c.isCurrentMonth ? 1 : 0.4,
                                textAlign: "center",
                                fontSize: 17,
                                color: selectedCell?.id === c.id ? colors.brandTextPrimary : colors.textPrimary
                        }}>
                            {c.date.getDate()}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}
