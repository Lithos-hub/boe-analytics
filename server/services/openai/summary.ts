import { openai } from '@/server/services/openai';

export const getSummary = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Necesito que elabores un resumen del texto en formato de texto. En caso de devolver varios párrafos, separa cada párrafo con un salto de línea.
          
          El texto es el siguiente:
          ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
