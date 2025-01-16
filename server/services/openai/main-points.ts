import { openai } from '@/server/services/openai';

export const getMainPoints = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar los puntos principales del texto.
        
        Debes devolver un array de objetos con las siguientes propiedades:
          - point: string (punto principal)

        Devuelve solo el array, no incluyas comillas ni comentarios, simplemente devuelve el array empezando y acabando con [ y ].
        
        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
