import { openai } from '@/server/services/openai';

export const getSummary = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Necesito que elabores un resumen del mismo en dos o tres párrafos. Separa cada párrafo con un salto de línea, en cuenta que el texto será mostrado en una web con HTML. Necesito que uses un lenguaje claro y que sea entendible para la mayoría de la población sin necesidad de conocimientos técnicos.

        Ejemplo de salida:

        "Este es el párrafo 1.\n\nEste es el párrafo 2.\n\nEste es el párrafo 3."
          
          El texto es el siguiente:
          ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
