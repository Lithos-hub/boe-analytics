import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';

export const getAnalysisPoints = async (text: string) => {
  const textChunkManager = new TextChunkManager();

  const results = await textChunkManager.processLargeText(
    text,
    async (chunk) => {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar los aspectos principales del texto y clasificarlos en positivos, negativos y neutros.
        
        Debes devolver un array de objetos con las siguientes propiedades:
          - aspect: string (aspect description)
          - description: string (description of the aspect in a few sentences explaining why it is positive, negative or neutral)
          - type: string ("positive", "negative" or "neutral")

        Considera que los aspectos positivos son aquellos que tienen un efecto positivo en la sociedad, los aspectos negativos son aquellos que tienen un efecto negativo en la sociedad y los aspectos neutros son aquellos que no tienen un efecto claro en la sociedad.
        
        Devuelve solo el array, no incluyas comillas ni comentarios, simplemente devuelve el array empezando y acabando con [ y ].

        Ten en cuenta que el resultado será procesado con un JSON.parse, por lo que no incluyas comillas en el array.

        Ejemplo de salida: [{"aspect": "aspect1", "description": "description1", "type": "positive"}, {"aspect": "aspect2", "description": "description2", "type": "negative"}, {"aspect": "aspect3", "description": "description3", "type": "neutral"}]
        
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
