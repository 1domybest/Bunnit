import React from "react";
import {View, Dimensions, TouchableOpacity, Text} from "react-native";
import styled from "styled-components/native";

import Animated, { interpolate, useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import {DayCell} from "../utill/CalenderUtill.ts";
import {useTheme} from "../context/theme/ThemeContext.tsx";



const CELL = Math.floor((Dimensions.get("window").width - 30) / 7);

export default function MonthGridView({
    cells,
    selectedCell,
    activeIndex,
    progress,
    onSelectCell,
}: {
    cells: DayCell[];
    selectedCell: DayCell | null;
    activeIndex: number;
    progress: SharedValue<number>;
    onSelectCell?: (cell: DayCell) => void;
}) {

    const { colors } = useTheme();
    const rows: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    const totalRows = rows.length;
    const containerStyle = useAnimatedStyle(() => {
      const p = 1 - progress.value; // 0..1
      const monthH = totalRows * CELL;
      const weekH = CELL;
      return {
        height: interpolate(p, [0, 1], [monthH, weekH]),
      };
    });


    const rowAnimatedStyles = rows.map((_, rowIdx) =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useAnimatedStyle(() => {
            const p = 1 - progress.value; // 0..1 (뒤집지 말자: 헷갈림 줄이기)
            const isActive = rowIdx === (activeIndex);
            const h = isActive ? CELL : interpolate(p, [0, 1], [CELL, 0]);
            const o = isActive ? 1    : interpolate(p, [0, 1], [1, 0]);
            return { height: h, opacity: o };
        })
    );

    return (

      <Animated.View style={[{ width: Dimensions.get("window").width, overflow: 'hidden' }, containerStyle]}>
          { rows.map((week, rowIdx) => (
              <Animated.View
                  key={rowIdx}
                  style={[
                      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 },
                      rowAnimatedStyles[rowIdx]
                  ]}
              >
                  {week.map((c) => (
                      <TouchableOpacity
                          key={c.date.toISOString()}
                          activeOpacity={0.7}
                          onPress={() => {
                              if (c.isCurrentMonth) {
                                  onSelectCell?.(c)
                              }
                          }}
                      >
                          <Animated.View
                              style={[
                                  {
                                      width: CELL,
                                      height: CELL,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      overflow: 'hidden',
                                  }
                              ]}
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

                          </Animated.View>
                      </TouchableOpacity>
                  ))}
              </Animated.View>
          ))}
      </Animated.View>
    );
}
