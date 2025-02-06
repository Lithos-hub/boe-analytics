import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';
import { Aspect } from '~/models/boe';

interface DeepSeekJSONResponse {
  aspects: Aspect[];
}

const prompt = (
  text: string,
) => `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar los aspectos principales del texto y clasificarlos en positivos, negativos y neutros.
        
        Debes devolver un array de objetos con las siguientes propiedades:
          - aspect: string (aspect name)
          - description: string (description of the aspect in a few sentences explaining why it is positive, negative or neutral)
          - type: string ("positive", "negative" or "neutral")

        Considera que los aspectos positivos son aquellos que tienen un efecto positivo en la sociedad, los aspectos negativos son aquellos que tienen un efecto negativo en la sociedad y los aspectos neutros son aquellos que no tienen un efecto claro en la sociedad.
        
        Debes devolver un JSON que contenga un array con los aspectos. Cada aspecto debe ser un objeto con las propiedades "aspect", "description" y "type". El JSON debe seguir la siguiente estructura:

        
        {
          "aspects":  [{"aspect": "aspect1", "description": "description1", "type": "positive"}, {"aspect": "aspect2", "description": "description2", "type": "negative"}, {"aspect": "aspect3", "description": "description3", "type": "neutral"}]
        }

        No incluyas comillas ni comentarios, simplemente devuelve el JSON empezando y acabando con { y }. Ten en cuenta que el resultado será procesado con un JSON.parse.
        
        Texto a analizar: ${text}`;

export const getAspects = async (text: string) => {
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
          console.error('DeepSeek API error in aspects => ', error);
          throw error;
        }
      });
    return results.map(({ aspects }) => aspects).flat();
  } catch (error) {
    console.error('Error getting aspects => ', error);
    throw error;
  }
};
