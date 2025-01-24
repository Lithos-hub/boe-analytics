export class TextChunkService {
    private readonly MAX_TOKENS = 35000;
    private readonly AVERAGE_CHARS_PER_TOKEN = 4;
    private readonly CHUNK_OVERLAP = 100; // Solapamiento para mantener contexto
  
    splitIntoChunks(text: string): string[] {
      const maxChunkLength = this.MAX_TOKENS * this.AVERAGE_CHARS_PER_TOKEN;
      const chunks: string[] = [];
      let startIndex = 0;
  
      while (startIndex < text.length) {
        let endIndex = startIndex + maxChunkLength;
        
        // Ajustar el final del chunk al último punto o salto de línea
        if (endIndex < text.length) {
          const lastPeriod = text.lastIndexOf('.', endIndex);
          const lastNewline = text.lastIndexOf('\n', endIndex);
          endIndex = Math.max(lastPeriod, lastNewline);
        }
  
        chunks.push(text.slice(startIndex, endIndex));
        startIndex = endIndex - this.CHUNK_OVERLAP;
      }
  
      return chunks;
    }
  }