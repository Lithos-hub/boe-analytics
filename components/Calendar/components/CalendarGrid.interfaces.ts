export interface CalendarGridProps {
    monthDays: {
      days: number;
      firstDay: number;
      lastDay: number;
    };
    selectedMonth: number;
    selectedYear: number;
    boesAvailableByDates: string[];
  }