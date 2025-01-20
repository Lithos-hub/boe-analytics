import { openai } from '@/server/services/openai';

export const getSummary = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Necesito que elabores un resumen del mismo en formato de texto en un par de párrafos. Separa cada párrafo con un salto de línea. Necesito que uses un lenguaje claro y que sea entendible para la mayoría de la población sin necesidad de conocimientos técnicos.
          
          El texto es el siguiente:
          ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
