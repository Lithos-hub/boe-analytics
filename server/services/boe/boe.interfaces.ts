import { Area, MainPoint, Statistic } from '~/models/boe';

// GET interfaces
export interface GetBoeParams {
  date: string;
}

export interface GetBoeResponse {
  id: string;
  date: string;
  url: string;
  summary?: string;
  areas?: Area[];
  statistics?: Statistic[];
  main_points?: MainPoint[];
}
