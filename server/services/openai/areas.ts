import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';
import { Area } from '~/models/boe';

interface DeepSeekJSONResponse {
  areas: Area[];
}

const prompt = (
  text: string,
) => `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar las areas de la sociedad a las que afecta el documento, por ejemplo: tecnología, educación, justicia, economía, etc. Cada área debe contener una descripción explicando brevemente por qué afecta a ese área en concreto. Debes devolver un JSON que contenga un array con las areas. Cada área debe ser un objeto con las propiedades "name" y "description". El JSON debe seguir la siguiente estructura:

{
  "areas": [{"name": "Educación", "description": "Descripción de la medida"}, {"name": "Trabajo", "description": "Descripción de la medida"}]
}

No incluyas comillas ni comentarios, simplemente devuelve el JSON empezando y acabando con { y }. Ten en cuenta que el resultado será procesado con un JSON.parse.

Texto a analizar: ${text}`;

export const getAreas = async (text: string) => {
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
          console.error('DeepSeek API error in areas => ', error);
          throw error;
        }
      });
    return results.map(({ areas }) => areas).flat();
  } catch (error) {
    console.error('Error getting areas => ', error);
    throw error;
  }
};
