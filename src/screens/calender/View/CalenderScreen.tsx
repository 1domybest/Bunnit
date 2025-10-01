import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from '../../../context/theme/ThemeContext.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { CalenderScreenVM } from '../ViewModel/CalenderScreenVM.tsx';
import React, { useMemo, useRef } from 'react';
import MonthGridView from '../../../components/MonthGridView.tsx';
import { observer } from 'mobx-react-lite';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import WeekGridView from '../../../components/WeekGridView.tsx';
import { runInAction } from 'mobx';
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import {DayCell} from "../../../utill/CalenderUtill.ts";

type CalenderStackParamList = {
  CalendarMain: undefined;
  CalendarDetail: undefined;
};

type Nav = NativeStackNavigationProp<CalenderStackParamList, 'CalendarMain'>;

function CalenderScreen() {
  const { colors } = useTheme();

  const navigation = useNavigation<Nav>();

  const vm = useMemo(() => new CalenderScreenVM(), []);

  /// 드레그 제스처 변수
  const progress = useSharedValue(1);
  const startProgress = useSharedValue(1);
  const startY = useSharedValue(0);
  const THRESHOLD = 50 * 6;

  /// 스크롤뷰 ref
  const monthFlatRef = useRef<FlatList<DayCell[]>>(null);
  const weekFlatRef = useRef<FlatList<DayCell[]>>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDidFolded = (didFolded:boolean) => {
      runInAction(() => {
          vm.didFolded = didFolded;
      });
  }

  const pan = useMemo(
    () =>
      Gesture.Pan()
          .runOnJS(true)
        .activeOffsetY([-15, 15])
        .onBegin(e => {
          // 스와이프 시작 시 현재 상태를 기준점으로 고정
          startProgress.value = progress.value;
          startY.value = e.translationY;
        })
        .onUpdate(e => {
          const dy = e.translationY - startY.value; // 시작 대비 변화량
          const delta = dy / THRESHOLD; // 위로 스와이프하면 음수
          progress.value = Math.min(
            Math.max(startProgress.value + delta, 0),
            1,
          );
            runOnJS(setDidFolded)(false);
        })
        .onEnd(() => {
          const target = progress.value < 0.5 ? 0 : 1;
          progress.value = withTiming(target, { duration: 220 }, finished => {
            if (finished) {
                runOnJS(setDidFolded)(target === 0);
            }
          })
          ;
        }),
    [THRESHOLD, progress, setDidFolded, startProgress, startY],
  );

    const setActiveRowForWeek = React.useCallback(
        (monthCells: DayCell[]) => {
            const currentWeek = monthCells[0]
            const currentWeekDayCellId = currentWeek.id

            const monthIndex = vm.monthGrid.findIndex(month =>
                month.some(row => row.isCurrentMonth && row.id === currentWeekDayCellId)
            );

            if (monthIndex !== -1) {
                const rowIndex = vm.monthGrid[monthIndex].findIndex(
                    row => row.isCurrentMonth && row.id === currentWeekDayCellId
                );

                if (rowIndex !== -1) {
                    runInAction(() => {
                        vm.currentDayCell = currentWeek
                        vm.currentMonthGridRowIndex = Math.floor(rowIndex / 7)
                        monthFlatRef.current?.scrollToIndex({
                            index: monthIndex,
                            animated: false,
                        });
                    })
                }
            }
        },
        [vm],
    );

    const setActiveRowForMonth = React.useCallback(
        (monthCells: DayCell[]) => {
            // 선택한 날짜 인덱스
            const selIdx = vm.selectedCell ? monthCells.findIndex(c => c.date.getTime() === vm.selectedCell!.date.getTime(),) : -1;

            // 오늘 날짜 인덱스
            const todayIdx = monthCells.findIndex(c => c.isToday);

            // 우선순위: 선택한 날 > 오늘 > 디폴트(2번째 줄, index=14)
            const pickIdx = selIdx >= 0 ? selIdx : todayIdx >= 0 ? todayIdx : 14;

            // 현재 월 내 row 인덱스
            const monthGridActiveWeekIndex = Math.floor(pickIdx / 7);



            // 주간 Grid에서 해당 날짜가 포함된 row index 찾기
            const pickRow = monthCells[pickIdx];
            const weekGridActiveWeekIndex = vm.weekGrid.findIndex(cells =>
                cells.some(cell => cell.id === pickRow.id),
            );



            runInAction(() => {
                vm.currentDayCell = pickRow
                vm.currentMonthGridRowIndex = monthGridActiveWeekIndex;

                // 스크롤 이동
                if (weekGridActiveWeekIndex >= 0) {
                    weekFlatRef.current?.scrollToIndex({
                        index: weekGridActiveWeekIndex,
                        animated: false,
                    });
                }
            });

        },
        [vm],
    );

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          backgroundColor: colors.background,
          flexDirection: 'column',
          gap: 20,
        }}
      >

        <View style={{ flexDirection: 'row', paddingHorizontal: 30, justifyContent: "space-between" }}>
            <TouchableOpacity
                onPress={() => {
                    if (vm.didFolded) {
                        console.log(vm.currentWeekGridIndex, vm.weekGrid.length - 1)
                        if (vm.currentWeekGridIndex > 0) {
                            weekFlatRef.current?.scrollToIndex({index: vm.currentWeekGridIndex -  1, animated: true})
                        }
                    } else {
                        if (vm.currentMonthGridIndex > 0) {
                            monthFlatRef.current?.scrollToIndex({index: vm.currentMonthGridIndex -  1, animated: true})
                        }
                    }
                }}
            >
                <Ionicons
                    name={"chevron-back-outline"}
                    size={26}
                    color={colors.brandBlue}
                />
            </TouchableOpacity>


          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 20,
            }}
          >
            {vm.currentDayCell?.date.getFullYear()}년{' '}
            {(vm.currentDayCell?.date.getMonth() ?? 0) + 1}월
          </Text>

            <TouchableOpacity
                onPress={() => {
                    console.log(vm.currentWeekGridIndex, vm.weekGrid.length - 1)
                    if (vm.didFolded) {
                        weekFlatRef.current?.scrollToIndex({index: vm.currentWeekGridIndex +  1, animated: true})
                    } else {
                        if (vm.currentMonthGridIndex + 1 < vm.monthGrid.length - 1) {
                            monthFlatRef.current?.scrollToIndex({index: vm.currentMonthGridIndex +  1, animated: true})
                        }
                    }
                }}
            >
                <Ionicons
                    name={"chevron-forward-outline"}
                    size={26}
                    color={colors.brandBlue}
                />
            </TouchableOpacity>

        </View>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: 15,
        }}>
          <DateText>일</DateText>
          <DateText>월</DateText>
          <DateText>화</DateText>
          <DateText>수</DateText>
          <DateText>목</DateText>
          <DateText>금</DateText>
          <DateText>토</DateText>
        </View>

          <GestureDetector gesture={pan}>
              <View style={{ height: vm.CELL_HEIGHT * 6}}>
                  <FlatList
                      style={{ position: 'absolute', opacity: vm.didFolded ? 1 : 0 }}
                      ref={weekFlatRef}
                      data={vm.weekGrid}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={cells => {
                          return cells[0].id;
                      }}
                      initialScrollIndex={0}
                      getItemLayout={(_, index) => ({
                          length: vm.SCREEN_WIDTH,
                          offset: vm.SCREEN_WIDTH * index,
                          index,
                      })}
                      onScrollToIndexFailed={({ index }) => {
                          weekFlatRef.current?.scrollToIndex({ index, animated: false });
                      }}
                      onMomentumScrollEnd={e => {
                          const x = e.nativeEvent.contentOffset.x;
                          const page = Math.round(x / vm.SCREEN_WIDTH);
                          runInAction(() => {
                              vm.currentWeekGridIndex = page
                              if (!vm.didFolded) { return }
                              setActiveRowForWeek(vm.weekGrid[page]);
                          })
                      }}
                      renderItem={({ item }) => (
                          <WeekGridView
                              cells={item}
                              selectedCell={vm.selectedCell}
                              onSelectCell={cell => {
                                  runInAction(() => {
                                      vm.selectedCell = cell;
                                  });
                              }}
                          />
                      )}
                      initialNumToRender={1}
                      windowSize={3}
                      removeClippedSubviews
                  />

                  <FlatList
                      style={{ position: 'absolute', opacity: vm.didFolded ? 0 : 1 }}
                      ref={monthFlatRef}
                      data={vm.monthGrid}
                      extraData={[vm.selectedCell]}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={cells => {
                          return cells[0].id;
                      }}
                      initialScrollIndex={vm.currentMonthGridIndex}
                      getItemLayout={(_, index) => ({
                          length: vm.SCREEN_WIDTH,
                          offset: vm.SCREEN_WIDTH * index,
                          index,
                      })}
                      onMomentumScrollEnd={e => {
                          const x = e.nativeEvent.contentOffset.x;
                          const page = Math.round(x / vm.SCREEN_WIDTH);
                          runInAction(() => {
                              vm.currentMonthGridIndex = page
                              if (vm.didFolded) { return }
                              setActiveRowForMonth(vm.monthGrid[page]);
                          })
                      }}
                      onScrollToIndexFailed={({ index }) => {
                          monthFlatRef.current?.scrollToIndex({ index, animated: false });
                      }}
                      renderItem={({ item }) => (
                          // 여기에서 조건문으로 다시렌더링
                          <MonthGridView
                              cells={item}
                              selectedCell={vm.selectedCell}
                              activeIndex={vm.currentMonthGridRowIndex}
                              progress={progress}
                              onSelectCell={cell => {
                                  const rowIdx = item.findIndex(c => {
                                      return c.id === cell.id;
                                  });

                                  vm.currentMonthGridRowIndex = Math.floor(rowIdx / 7);
                                  vm.selectedCell = cell;
                                  setActiveRowForMonth(item)
                              }}
                          />
                      )}
                      initialNumToRender={1}
                      windowSize={3}
                      removeClippedSubviews
                  />
              </View>
          </GestureDetector>

          <View
              style={{flexDirection: "row", paddingHorizontal: 15}}
          >
              <TouchableOpacity
                  onPress={() => {
                      navigation.push("CalendarDetail")
                  }}
                  style={{
                      flex: 1,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      borderRadius: 10,
                      backgroundColor: colors.brandBlue,
                      alignItems: "center"
              }}
              >
                  <Text style={{ color: colors.brandTextPrimary, fontSize: 17}}>
                      이 개발자의 희망연봉 보러가기
                  </Text>
              </TouchableOpacity>
          </View>

      </View>
    </SafeAreaView>
  );
}

const DateText = styled.Text`
  color: ${({ theme }) => theme.textPrimary};
  font-size: 17px;
`;

export default observer(CalenderScreen);
