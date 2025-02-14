export type AvailableBoe = {
  date: string;
  doc_id: string;
  has_all_data: boolean;
};

export interface CalendarProps {
  boesList: AvailableBoe[];
}
