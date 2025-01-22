export interface StatsProps {
    stats: {
      positive: number;
      negative: number;
      neutral: number;
    } | null;
  }