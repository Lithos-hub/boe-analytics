import { TextChunkService } from './textChunk';

export class TextChunkManager {
  private textChunkService: TextChunkService;

  constructor() {
    this.textChunkService = new TextChunkService();
  }

  async processLargeText(
    text: string,
    processor: (chunk: string) => Promise<any>,
  ): Promise<any[]> {
    const chunks = this.textChunkService.splitIntoChunks(text);
    const results = await Promise.all(chunks.map(processor));
    console.error('Results in TextChunkManager:', results);
    return this.mergeResults(results);
    // return results;
  }

  private mergeResults(results: any[]): any[] {
    return results.flat();
  }
}
