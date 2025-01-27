export interface GenerateTask {
  condition: boolean;
  generate: () => Promise<any>;
  post: (data: any) => Promise<void>;
  loadingState: () => void;
}
