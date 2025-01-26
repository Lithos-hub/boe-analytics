import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';

export const getMainPoints = async (text: string) => {
  const textChunkManager = new TextChunkManager();
  const results = await textChunkManager.processLargeText(
    text,
    async (chunk) => {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar los puntos principales del texto.
        
            Debes devolver una cadena de texto con los puntos claves separados por tres guiones.

        Ejemplo de salida: "punto clave 1--- punto clave 2--- punto clave 3--- punto clave 4"
        
        Texto a analizar: ${chunk}`,
          },
        ],
        model: 'deepseek-chat',
      });
      return response.choices[0].message.content?.split('---').map((point) => {
        return {
          point: point.trim().replace(/"/g, ''),
        };
      });
    },
  );

  debugger;

  const uniquePoints = [...new Set(results.flat())];
  return JSON.stringify(uniquePoints);
};
