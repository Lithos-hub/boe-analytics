export interface GenerateTask {
  condition: boolean;
  generate: () => Promise<any>;
}

const regenerateSections = ['summary', 'main_points', 'keywords', 'areas', 'aspects'] as const;
export type RegenerateSection = typeof regenerateSections[number];

export type SectionToReGenerate = {
  [key in RegenerateSection]: () => Promise<any>;
}

export interface AvailableScrapedBoe {
  url: string;
  title: string;
  subtitle: string;
  text: string;
  id: string;
}