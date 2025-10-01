export type DayCell = {
    id: string;
    date: Date;
    day: number;              // 1..31
    isCurrentMonth: boolean;
    isToday: boolean;
};

// ---------- 날짜 유틸(순수 함수) ----------

export const startOfMonth = (d: Date) => {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}


export const endOfMonth = (d: Date) => {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}


export const addDays = (d: Date, n: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
};

// ---------- 범위 계산 ----------
export const rangeStartFrom = (now: Date, years = 5) => {
    return new Date(now.getFullYear() - years, now.getMonth(), now.getDate());
}

export const rangeEndFrom = (now: Date, years = 5) => {
    return new Date(now.getFullYear() + years, now.getMonth(), now.getDate());
}

export const listMonthsBetween = (start: Date, end: Date): Date[] => {
    const months: Date[] = [];
    const cursor = startOfMonth(start);
    const stop = startOfMonth(end);
    while (cursor <= stop) {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
    }
    return months;
};