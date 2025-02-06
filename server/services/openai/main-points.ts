import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';
import { MainPoint } from '~/models/boe';

interface DeepSeekJSONResponse {
  main_points: MainPoint[];
}

const prompt = (
  text: string,
) => `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar los puntos principales del texto. Debes devolver un JSON que contenga un array con los puntos principales del texto. Cada punto debe ser un string. El JSON debe seguir la siguiente estructura:

{
  "main_points": [{ "point": "Explicación breve del primer punto" }, { "point": "Explicación breve del segundo punto" }, { "point": "Explicación breve del tercer punto" }]
}

No incluyas comillas ni comentarios, simplemente devuelve el JSON empezando y acabando con { y }. Ten en cuenta que el resultado será procesado con un JSON.parse.

Texto a analizar: ${text}`;

export const getMainPoints = async (text: string) => {
  const textChunkManager = new TextChunkManager();

  try {
    const results: DeepSeekJSONResponse[] =
      await textChunkManager.processLargeText(text, async (chunk) => {
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
          return JSON.parse(response.choices[0].message.content as string);
        } catch (error) {
          console.error('DeepSeek API error in main points => ', error);
          throw error;
        }
      });
    return results.map(({ main_points }) => main_points).flat();
  } catch (error) {
    console.error('Error getting main points => ', error);
    throw error;
  }
};
