import type { Area, Aspect, Keyword, MainPoint } from "~/models/boe";

type ApiEndpoint = 'summary' | 'main-points' | 'keywords' | 'areas' | 'analysis-points';
type ApiResponse<T> = T extends 'summary' ? string : T extends 'main-points' ? MainPoint[] : T extends 'keywords' ? Keyword[] : T extends 'areas' ? Area[] : Aspect[];

const makeApiRequest = async <T extends ApiEndpoint>(
  endpoint: T,
  text: string | null
): Promise<ApiResponse<T> | undefined> => {
  if (!text) return undefined;

  try {
    return await $fetch<ApiResponse<T>>(`/api/openai/${endpoint}`, {
      method: 'POST',
      body: { text },
    });
  } catch (error) {
    console.error(`Error in ${endpoint} request:`, error);
    throw error;
  }
};

const generateSummary = (text: string | null) => 
  makeApiRequest('summary', text);

const generateMainPoints = (text: string) => 
  makeApiRequest('main-points', text);

const generateKeywords = (text: string | null) => 
  makeApiRequest('keywords', text);

const generateAreas = (text: string | null) => 
  makeApiRequest('areas', text);

const generateAspects = (text: string | null) => 
  makeApiRequest('analysis-points', text);

export { 
  generateSummary, 
  generateMainPoints, 
  generateKeywords, 
  generateAreas, 
  generateAspects 
};