import { openai } from '@/server/services/openai';

export const getAreas = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te va a proporcionar un texto relativo al Boletín Oficial del Estado de España. Debes identificar las áreas afectadas por las medidas del texto. 
        
        Debes devolver un array de objetos con las siguientes propiedades:
          - name: string (nombre de la área afectada. Por ejemplo: "Educación", "Trabajo", "Salud", "Transporte", etc.)
          - description: string (descripción breve de cómo afecta la medida al área)

        Devuelve solo el array, no incluyas comillas ni comentarios, simplemente devuelve el array empezando y acabando con [ y ].

        Ten en cuenta que el resultado será procesado con un JSON.parse, por lo que no incluyas comillas en el array.

        Ejemplo de salida: [{"name": "Educación", "description": "La medida afecta a la educación"}, {"name": "Trabajo", "description": "La medida afecta al trabajo"}]
          
        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
