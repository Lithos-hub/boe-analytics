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

export interface CreateAreasParams {
  boe_id: number;
  areas: Area[];
}

export interface CreateAreasResponse {
  id: number;
  areas: Area[];
}

export interface CreateStatisticsParams {
  boe_id: number;
  statistics: Statistic[];
}

export interface CreateStatisticsResponse {
  id: number;
  statistics: Statistic[];
}

export interface CreateMainPointsParams {
  boe_id: number;
  main_points: MainPoint[];
}

export interface CreateMainPointsResponse {
  id: number;
  main_points: MainPoint[];
}

// PUT interfaces
export interface UpdateBoeSummaryParams {
  id: number;
  summary: string;
}

export interface UpdateBoeAreasParams {
  id: number;
  areas: Area[];
}

export interface UpdateBoeStatisticsParams {
  id: number;
  statistics: Statistic[];
}

export interface UpdateBoeMainPointsParams {
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

export interface DeleteAreasParams {
  id: number;
}

export interface DeleteStatisticsParams {
  id: number;
}

export interface DeleteMainPointsParams {
  id: number;
}
