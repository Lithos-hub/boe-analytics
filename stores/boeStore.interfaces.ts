export interface GenerateTask {
  condition: boolean;
  generate: () => Promise<any>;
}

const regenerateSections = [
  'summary',
  'main_points',
  'keywords',
  'areas',
  'aspects',
] as const;
export type RegenerateSection = (typeof regenerateSections)[number];

export type SectionToReGenerate = {
  [key in RegenerateSection]: () => Promise<any>;
};

export interface AvailableScrapedBoe {
  title: string;
  subtitle: string;
  text: string;
  id: string;
  date: string;
  has_all_data: boolean;
}
