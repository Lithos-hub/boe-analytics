import type { Area, Aspect, Keyword, MainPoint } from '~/models/boe';

type ApiEndpoint =
  | 'summary'
  | 'main-points'
  | 'keywords'
  | 'areas'
  | 'analysis-points';
type ApiResponse<T> = T extends 'summary'
  ? string
  : T extends 'main-points'
    ? MainPoint[]
    : T extends 'keywords'
      ? Keyword[]
      : T extends 'areas'
        ? Area[]
        : Aspect[];

const makeApiRequest = async <T extends ApiEndpoint>(
  endpoint: T,
  text: string | null,
  signal?: AbortSignal,
): Promise<ApiResponse<T> | undefined> => {
  if (!text) return undefined;

  try {
    return await $fetch<ApiResponse<T>>(`/api/openai/${endpoint}`, {
      method: 'POST',
      signal,
      body: { text },
    });
  } catch (error) {
    console.error(`Error in ${endpoint} request:`, error);
    throw error;
  }
};

const generateSummary = (text: string | null, signal?: AbortSignal) =>
  makeApiRequest('summary', text, signal);

const generateMainPoints = (text: string, signal?: AbortSignal) =>
  makeApiRequest('main-points', text, signal);

const generateKeywords = (text: string | null, signal?: AbortSignal) =>
  makeApiRequest('keywords', text, signal);

const generateAreas = (text: string | null, signal?: AbortSignal) =>
  makeApiRequest('areas', text, signal);

const generateAspects = (text: string | null, signal?: AbortSignal) =>
  makeApiRequest('analysis-points', text, signal);

export {
  generateSummary,
  generateMainPoints,
  generateKeywords,
  generateAreas,
  generateAspects,
};
