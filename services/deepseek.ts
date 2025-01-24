import { TextChunkService } from "./textChunk";

export class TextChunkManager {
  private textChunkService: TextChunkService;

  constructor() {
    this.textChunkService = new TextChunkService();
  }

  async processLargeText(text: string, processor: (chunk: string) => Promise<any>): Promise<any[]> {
    const chunks = this.textChunkService.splitIntoChunks(text);
    const results = await Promise.all(chunks.map(processor));
    return this.mergeResults(results);
  }

  private mergeResults(results: any[]): any[] {
    return results.flat();
  }
}