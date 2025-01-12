import { openai } from '../openai';

export const getKeywords = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Extrae las palabras clave más relevantes del siguiente texto y preséntalas en formato HTML.
        Usa la siguiente estructura:
          <ul class="BoeAnalytics__keywords-list">
            <li class="BoeAnalytics__keywords-item">palabra clave</li>
          </ul>
          
          No incluyas comillas ni comentarios, simplemente devuelve el texto en HTML empezando y acabando con etiquetas <ul></ul>.
        
        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
