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
        
        Debes devolver un array de objetos con las siguientes propiedades:
          - point: string (punto principal)

        Devuelve solo el array, no incluyas comillas ni comentarios, simplemente devuelve el array empezando y acabando con [ y ].
        Ten en cuenta que el resultado será procesado con un JSON.parse, por lo que no incluyas comillas en el array.

        Ejemplo de salida: ["punto1", "punto2", "punto3"]
        
        Texto a analizar: ${chunk}`,
          },
        ],
        model: 'deepseek-chat',
      });
      return JSON.parse(response.choices[0].message.content || '[]');
    },
  );

  return [...new Set(results.flat())].join('');
};
