import { openai } from '@/server/services/openai';
import { TextChunkManager } from '@/services/deepseek';

const prompt = (
  text: string,
) => `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Por favor, proporciona un resumen claro y conciso del siguiente documento. Divide el resumen en dos o tres párrafos como máximo. Cada párrafo debe estar claramente separado por un salto de línea <br> para asegurar una correcta presentación en HTML. El resumen final será renderizado a través de HTML en una página Nuxt 3 y Vue 3.

        Es muy importante que uses un lenguaje claro y que sea entendible para la mayoría de la población sin necesidad de conocimientos técnicos.

        Utiliza aproximadamente entre 200 y 250 palabras en total.

        Ejemplo de salida:

        "Este es el párrafo 1.<br><br>Este es el párrafo 2.<br><br>Este es el párrafo 3."
          
          El texto es el siguiente:
          ${text}`;

export const getSummary = async (text: string) => {
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
      });
      return response.choices[0].message.content;
    },
  );

  return results.join('');
};
