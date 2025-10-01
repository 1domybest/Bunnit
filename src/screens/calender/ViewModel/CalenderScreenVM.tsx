import { makeAutoObservable } from 'mobx';
import {
  addDays,
  DayCell, endOfMonth,
  listMonthsBetween,
  rangeEndFrom,
  rangeStartFrom, startOfMonth
} from "../../../utill/CalenderUtill.ts";
import {Dimensions} from "react-native";

export class CalenderScreenVM {
  // 오늘
  readonly today: Date;

  // 월 캘린더 데이터
  monthGrid: DayCell[][];
  // 주 캘린더 데이터
  weekGrid: DayCell[][];

  // MonthGrid 안에서 row 의 index
  currentMonthGridRowIndex: number = 0

  // MonthGrid[][] 안의 index
  currentMonthGridIndex: number = 0
  // weekGrid[][] 안의 index
  currentWeekGridIndex: number = 0
  
  // true = 접힘
  didFolded: boolean = false

  // 오늘 cell
  currentDayCell: DayCell | null = null;

  // 선택한 DayCell
  selectedCell: DayCell | null = null;

  // 화면 가로 크기
  SCREEN_WIDTH = Dimensions.get('window').width;
  CELL_HEIGHT = Math.floor(this.SCREEN_WIDTH - 30) / 7;
  constructor() {
    this.today = new Date()
    makeAutoObservable(
        this,
        {
          today: false,
          SCREEN_WIDTH: false
        },
        { autoBind: true }
    );

    const grids = this.monthGrids;
    this.monthGrid = grids.month;
    this.weekGrid = grids.week;
  }


  // 주,월 캘린더 그리드 계산
  get monthGrids(): { month:DayCell[][], week: DayCell[][] } {
    const bases = listMonthsBetween(rangeStartFrom(this.today, 5), rangeEndFrom(this.today, 5));
    const monthDayCell: DayCell[][] = [];
    const weekDayCell: DayCell[] = [];
    bases.forEach((base, index) => {
      let result = this.calculateCalender(base, index)

      monthDayCell.push(result.month)

      result.week.forEach((week) => {
        weekDayCell.push(week)
      })

    })

    const rows: DayCell[][] = [];
    for (let i = 0; i < weekDayCell.length; i += 7) {
      rows.push(weekDayCell.slice(i, i + 7))
    }
    return { month:monthDayCell, week:rows };
  }

  // 각 월마다 계산
  calculateCalender = (
      base: Date,
      index: number
  ): { month: DayCell[], week: DayCell[]} => {

    const monthStart = startOfMonth(base);
    const monthEnd = endOfMonth(base);

    const leading = monthStart.getDay();          // 일=0..토=6
    const daysInMonth = monthEnd.getDate();
    const total = leading + daysInMonth;

    let trailing = total % 7 === 0 ? 0 : 7 - (total % 7);

    const monthDayCell: DayCell[] = [];
    const weekDayCell: DayCell[] = [];

    // 이전 월
    const prevMonthEnd = endOfMonth(addDays(monthStart, -1));
    
    for (let i = leading - 1; i >= 0; i--) {
      const d = addDays(prevMonthEnd, -i);
      let isToday: boolean = false;
      if (
          this.today.getFullYear() === d.getFullYear() &&
          this.today.getMonth() === d.getMonth() &&
          this.today.getDate() === d.getDate()
      ) {
        isToday = true;
      }

      monthDayCell.push({
        id: "" + d.getFullYear() + (d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth()) + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()),
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: isToday,
      });

      if (index === 0) {
        weekDayCell.push({
          id: "" + d.getFullYear() + (d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth()) + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()),
          date: d,
          day: d.getDate(),
          isCurrentMonth: false,
          isToday: false,
        });
      }
    }

    // 본월
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(base.getFullYear(), base.getMonth(), day);
      let isToday: boolean = false;
      if (
        this.today.getFullYear() === d.getFullYear() &&
        this.today.getMonth() === d.getMonth() &&
        this.today.getDate() === d.getDate()
      ) {
        isToday = true;
      }

      const cell:DayCell = {
        id: "" + d.getFullYear() + (d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth()) + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()),
        date: d,
        day,
        isCurrentMonth: true,
        isToday: isToday
      }
      monthDayCell.push(cell);

      weekDayCell.push(cell)


      if (isToday) {
        this.currentMonthGridIndex = index
        this.currentDayCell = cell
      }

    }

    // 다음 월
    const nextMonthStart = addDays(monthEnd, 1);
    for (let i = 0; i < trailing; i++) {
      const d = addDays(nextMonthStart, i);

      let isToday: boolean = false;
      if (
          this.today.getFullYear() === d.getFullYear() &&
          this.today.getMonth() === d.getMonth() &&
          this.today.getDate() === d.getDate()
      ) {
        isToday = true;
      }
      monthDayCell.push({
        id: "" + d.getFullYear() + (d.getMonth() < 10 ? "0" + d.getMonth() : d.getMonth()) + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()),
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: isToday,
      });
    }
    return { month: monthDayCell, week: weekDayCell };
  };
}