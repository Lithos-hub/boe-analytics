import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';

const prompt = (
  text: string,
) => `Se te va a proporcionar un texto relativo al Boletín Oficial del Estado de España. Debes identificar las áreas afectadas por las medidas del texto. 
        
        Debes devolver un array de objetos con las siguientes propiedades en formato JSON:
          - name: string (nombre de la área afectada. Por ejemplo: "Educación", "Trabajo", "Salud", "Transporte", etc.)
          - description: string (descripción breve de cómo afecta la medida al área)

        Ejemplo de salida: [{"name": "Educación", "description": "Descripción de la medida"}, {"name": "Trabajo", "description": "Descripción de la medida"}]

        Llama al objeto "areas" y devuelve un array de objetos con las áreas afectadas por las medidas del texto.
          
        Texto a analizar: ${text}`;

export const getAreas = async (text: string) => {
  const textChunkManager = new TextChunkManager();

  const results = await textChunkManager.processLargeText(
    text,
    async (chunk) => {
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
      console.log('JSON AREAS => ', response.choices[0].message.content);
      const stringify = JSON.stringify(
        response.choices[0].message.content,
        null,
        2,
      );
      const parsed = JSON.parse(stringify);
      return parsed.areas;
    },
  );

  return results.flat();
};
