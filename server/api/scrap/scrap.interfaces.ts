export interface ScrapData {
  url: string;
  title: string;
  subtitle: string;
  text: string;
}

export interface ScrapResponse {
  [key: string]: ScrapData;
}
