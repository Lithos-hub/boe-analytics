import { openai } from '@/server/services/openai';

export const getKeywords = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar las palabras clave más relevantes del texto.
        
        Debes devolver un array de objetos con las siguientes propiedades:
          - keyword: string (palabra clave)

        Devuelve solo el array, no incluyas comillas ni comentarios, simplemente devuelve el array empezando y acabando con [ y ].
        Ten en cuenta que el resultado será procesado con un JSON.parse, por lo que no incluyas comillas en el array.

        Ejemplo de salida: ["palabra1", "palabra2", "palabra3"]

        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
