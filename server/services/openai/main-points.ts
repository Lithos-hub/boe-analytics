import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';
import { MainPoint } from '~/models/boe';

interface OutputData {
  main_points: MainPoint[];
}

const prompt = (
  text: string,
) => `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar los puntos principales del texto. Debes devolver un JSON que contenga un array con los puntos clave del texto. Cada punto debe ser un string. El JSON debe seguir la siguiente estructura:

["Explicación breve del primer punto.", "Explicación breve del segundo punto.", "Explicación breve del tercer punto.", ...]

Texto a analizar: ${text}`;

export const getMainPoints = async (text: string) => {
  const textChunkManager = new TextChunkManager();
  const results = await textChunkManager.processLargeText(
    text,
    async (chunk) => {
      try {
        const response = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: prompt(chunk),
            },
          ],
          model: 'deepseek-chat',
          response_format: {
            type: 'json_object',
          },
        });

        return response;
      } catch (error) {
        console.error('ERROR GETTING MAIN POINTS => ', error);
        return [];
      }
    },
  );

  console.error('MAIN POINTS RESULTS => ', results);

  return results;
};
