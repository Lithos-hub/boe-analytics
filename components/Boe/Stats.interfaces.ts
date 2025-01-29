export interface StatsProps {
  isLoadingStats: boolean;
    stats: {
      positive: number;
      negative: number;
      neutral: number;
    } | null;
  }