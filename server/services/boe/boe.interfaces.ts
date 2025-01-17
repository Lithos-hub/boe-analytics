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

// POST interfaces
export interface CreateBoeParams {
  date: string;
  url: string;
}

export interface CreateBoeResponse {
  id: number;
  date: string;
  url: string;
}

export interface CreateSummaryParams {
  boe_id: number;
  summary: string;
}

export interface CreateSummaryResponse {
  id: number;
  summary: string;
}

export interface CreateAreaParams {
  boe_id: number;
  name: string;
  description: string;
}

export interface CreateAreasResponse {
  id: number;
  areas: Area[];
}

export interface CreateStatisticParams {
  boe_id: number;
  type: string;
  count: number;
}

export interface CreateStatisticsResponse {
  id: number;
  statistics: Statistic[];
}

export interface CreateMainPointParams {
  boe_id: number;
  main_points: MainPoint[];
}

export interface CreateMainPointResponse {
  id: number;
  main_points: MainPoint[];
}

// PUT interfaces
export interface UpdateBoeSummaryParams {
  id: number;
  summary: string;
}

export interface UpdateBoeAreaParams {
  id: number;
  name: string;
  description: string;
}

export interface UpdateBoeStatisticsParams {
  id: number;
  statistics: Statistic[];
}

export interface UpdateBoeMainPointParams {
  id: number;
  main_points: MainPoint[];
}

// DELETE interfaces
export interface DeleteBoeParams {
  boe_id: number;
}

export interface DeleteSummaryParams {
  id: number;
}

export interface DeleteAreaParams {
  id: number;
}

export interface DeleteStatisticParams {
  id: number;
}

export interface DeleteMainPointParams {
  id: number;
}
