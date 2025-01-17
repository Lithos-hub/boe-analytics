import { openai } from '@/server/services/openai';

export const getAnalysisPoints = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Debes identificar los aspectos principales del texto y clasificarlos en positivos, negativos y neutros.
        
        Debes devolver un array de objetos con las siguientes propiedades:
          - aspect: string (aspect description)
          - type: string ("positive", "negative" or "neutral")

        Considera que los aspectos positivos son aquellos que tienen un efecto positivo en la sociedad, los aspectos negativos son aquellos que tienen un efecto negativo en la sociedad y los aspectos neutros son aquellos que no tienen un efecto claro en la sociedad.
        
        Devuelve solo el array, no incluyas comillas ni comentarios, simplemente devuelve el array empezando y acabando con [ y ].
        
        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
