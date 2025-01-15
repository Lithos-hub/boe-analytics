export interface ProcessedBoeStats {
  positive: number;
  negative: number;
  neutral: number;
}

export interface BoeSummaryResponse {
  briefSummary: string;
  stats?: ProcessedBoeStats;
}

export interface BoeScrapingResponse {
  text: string;
  link: string;
}

export interface BoeAnalyticsResponse {
  analysisHTML: string;
  analysisJSON: string;
}
