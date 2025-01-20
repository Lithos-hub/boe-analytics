import type { Aspect } from '~/models/boe';

export interface BoeAspectsProps {
  type: 'positive' | 'negative' | 'neutral';
  aspects: Aspect[];
  isLoadingAspects: boolean;
}
