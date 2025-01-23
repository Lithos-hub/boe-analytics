import type { AvailableBoe } from "../Calendar.interfaces";

export interface CalendarGridProps {
  monthDays: {
    days: number;
      firstDay: number;
      lastDay: number;
  };
  selectedMonth: number;
  selectedYear: number;
  availableBoesList: AvailableBoe[];
}
