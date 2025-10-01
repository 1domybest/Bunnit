# Bunnit 과제

<aside>
💡

**참고로 안드로이드 기기가 없는 관계로** 

아이폰 에서만 개발 및 테스트를 진행하였으니 참고 부탁드립니다.

**IOS** 빌드 부탁드립니다.

</aside>

해당 과제를 하면서

어떤 문제가있었고

어떤 생각의 흐름으로 개발했는지 공유하려합니다.

---

## 1. 탭 내에서 새로운 View Push시 바텀탭 Hide 실패

1. 네비게이션 컨테이너안에 탭을 제작
2. 캘린더 Screen 내에서 추가 페이지 push 기능 실행

→ **바텀 탭이 없어지지않음**

### 해결 방안

네비게이션 안쪽 가장 상단에 스택을 배치한후

탭과 추가 별도 컴포넌트 분리

```jsx
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
```

---

## 2. 월 캘린더 ↔ 주 캘린더 변환 UI 구조 변환

1. 한개의 FlatList를 사용하여 구조를 변경시키는 구조로 시도
2. 월캘린더 → 주캘린더 로 변환은 문제없이 성공

→ 단 반대방향으로 주캘린더 → 월캘린더 로 변경하려면 애초에 데이터 구조를
변경해야한다는 사실을 깨닳음

### 해결 방안

1. 2개의 FlatList를 사용하고 **postion**은 **“absolute”**로 사용하여 서로 겹치도록 제작
2. 드레그 제스처를 통해 progress를 계산하고 해당 progress가 0이면 주캘린더 그게아니면 월 캘린더로 판단후 **didFolded** 변수를 토글
3. didFolded변수를 통하여 opacity를 이용하여 보여줄 FlatList결정

```jsx
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
```

---

## 3. 월 캘린더와 주 캘린더의 구조 불일치

1. 오늘을 기준으로 과거 5년 미래 5년 을 계산하여 월 캘린더를 제작

→ 렌더링 된 달력의 과거나 미래까지 보여줘야했기에 같은형식의 데이터 구조로 주 캘린더와 일치시키기 실패

### 해결 방안

주 캘린더 전용 데이터 구조를 제작하여 렌더링

```jsx
export type DayCell = {
    id: string;
    date: Date;
    day: number;              // 1..31
    isCurrentMonth: boolean;
    isToday: boolean;
};

export class CalenderScreenVM {
  // ....
  
  // 월 캘린더 데이터
  monthGrid: DayCell[][];
  // 주 캘린더 데이터
  weekGrid: DayCell[][];
  
  // ....
 }
```

---

## 추가로 고민했던 흔적들

### 1. 월 캘린더 → 주 캘린더 변환시 몇번째 줄을 변환시킬것인가?

해당 기능은

우선순위를

1. 선택한 날짜
2. 오늘
3. 인덱스 기준으로 1번

으로 지정하여 개발하였습니다.

---

### 2. FlatList api 고민  (`onMomentumScrollEnd` VS  `onViewableItemsChanged`)

두개의 API다 스크롤했을시 스크롤이 끝났을때, 화면의 렌더링되는 아이템의 변경이 생겼을떄
즉 두개다 비슷한 성격을 가지고있는 api라 어떤걸 사용해야할지 고민하였습니다.

`onMomentumScrollEnd`  <<< 승

`onMomentumScrollEnd` 를 사용한 이유는
`onViewableItemsChanged` 같은경우 화면의 2개의 아이템이 동시에 노출될경우
리스트로 2개의 아이템이 반환되기에 불필요한 계산과 직접 인덱스를 0을 넣어야한다는 찝찝함 때문에

현재 스크롤뷰의 `contentOffset` 을 기준으로 작업하는게 더 안전하고 정확할거라고 판단하였기때문에 해당 api를 사용하였습니다.

```jsx
                      onMomentumScrollEnd={e => {
                          const x = e.nativeEvent.contentOffset.x;
                          const page = Math.round(x / vm.SCREEN_WIDTH);
                          runInAction(() => {
                              vm.currentWeekGridIndex = page
                              if (!vm.didFolded) { return }
                              setActiveRowForWeek(vm.weekGrid[page]);
                          })
                      }}
```

---

### 3.  렌더링 최적화

### mobX 최적화

기본적으로 VM에서는 mobx를 사용하고 불변하는 값들에 대해서는 

관찰을 false로 비활성화 시켜 성능을 높였습니다

```jsx
    makeAutoObservable(
        this,
        {
          today: false,
          SCREEN_WIDTH: false
        },
        { autoBind: true }
    );
```

### 드레그 렌더링 최적화

드레그 관련된 변수는 렌더링 이슈가 있을것으로 예상되어
useSharedValue를 사용하여 사용하고있는 관련된 View에 대해서만 작용하도록
작업하였습니다.

```jsx
  /// 드레그 제스처 변수
  const progress = useSharedValue(1);
  const startProgress = useSharedValue(1);
  const startY = useSharedValue(0);
```

---

### 4.  다크모드, 라이트모드

해당 기능은

`ThemeContext` 를 사용하고
컬러관련 파일을 따로 제작후 사용하였습니다.

IOS 설정에서 모드 변경시 실시간으로 변경되도록 설정되어있습니다.

```jsx
export const LightColors = {
    // Brand
    brandBlue: '#445EFF',
    brandTextPrimary: 'white',

    // Backgrounds
    background: '#EBEBEB',

    // Surfaces / Cards
    surface: '#C5C5C7',

    // Text
    textPrimary: 'rgba(0,0,0,0.87)',
    textSecondary: 'rgba(0,0,0,0.6)',

    // Border / Separator
    border: 'rgba(0,0,0,0.12)',

    // Status
    success: '#2E7D32',
    warning: '#F9A825',
    danger: '#D32F2F',
}

export const DarkColors = {
    // Brand
    brandBlue: '#445EFF',
    brandTextPrimary: 'white',
    // Backgrounds
    background: '#101010',

    // Surfaces / Cards
    surface: '#515153',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.7)',

    // Border / Separator
    border: 'rgba(255,255,255,0.16)',

    // Status
    success: '#66BB6A',
    warning: '#FDD835',
    danger: '#EF5350',

    // Extra
    lightDark: '#2a2a2b',
}

export type ThemeColors = typeof LightColors
```
