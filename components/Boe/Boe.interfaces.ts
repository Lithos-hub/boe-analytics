export interface ProcessedBoeStats {
  positive: number;
  negative: number;
  neutral: number;
}

export interface ProcessedBoeText {
  briefSummary: string;
  stats: ProcessedBoeStats;
}

export interface BoeData {
  text: string;
  link: string;
}
