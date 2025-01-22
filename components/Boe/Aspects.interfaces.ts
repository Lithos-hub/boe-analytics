import type { Aspect } from '~/models/boe';

export interface AspectsProps {
  type: 'positive' | 'negative' | 'neutral';
  aspects: Aspect[];
  isLoadingAspects: boolean;
}
