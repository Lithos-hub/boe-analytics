export interface BoeColumn {
  id?: number;
  boe_id?: number;
}

export interface Boe {
  id: number;
  date: string;
  url: string;
  summary: string;
}

export type BoePostData = Omit<Boe, 'id'>;

export interface Area extends BoeColumn {
  name: string;
  description: string;
}

export interface Statistic extends BoeColumn {
  type: string;
  count: number;
}

export interface MainPoint extends BoeColumn {
  point: string;
}

export interface Keyword extends BoeColumn {
  keyword: string;
}

export interface Summary extends BoeColumn {
  summary: string;
}

export interface Aspect extends BoeColumn {
  type: string;
  aspect: string;
  description: string;
}

export interface BoeResponse {
  id: number;
  date: string;
  url: string;
  summary: string;
  main_points: MainPoint[];
  keywords: Keyword[];
  aspects: Aspect[];
  areas: Area[];
}
