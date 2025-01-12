import { openai } from '../openai';

export const getMainPoints = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Analiza el siguiente texto y extrae los puntos principales en formato HTML con una lista ordenada. 
        Usa la siguiente estructura:
          <ol class="BoeAnalytics__content--list">
            <li class="BoeAnalytics__content--list-item">
              <strong>Título del punto:</strong> Descripción detallada
            </li>
          </ol>
          
          No incluyas comillas ni comentarios, simplemente devuelve el texto en HTML empezando y acabando con etiquetas <ol></ol>.
        
        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
