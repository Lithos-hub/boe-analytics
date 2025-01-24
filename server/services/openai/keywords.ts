import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';

export const getKeywords = async (text: string) => {
  const textChunkManager = new TextChunkManager();

  const results = await textChunkManager.processLargeText(
    text,
    async (chunk) => {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar las palabras clave más relevantes del texto.

            Debes devolver una cadena de texto con las palabras clave separadas por comas.

        Ejemplo de salida: "palabra1, palabra2, palabra3, palabra4"

        Texto a analizar: ${chunk}`,
          },
        ],
        model: 'deepseek-chat',
      });
      return response.choices[0].message.content?.split(',').map((word) => {
        return {
          keyword: word.trim().replace(/"/g, ''),
        };
      });
    },
  );

  const uniqueKeywords = [...new Set(results.flat())];
  return JSON.stringify(uniqueKeywords);
};
