import { openai } from '@/server/services/openai';

export const getAreas = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Identifica las áreas afectadas por las medidas del texto y preséntalas en formato HTML.
        Usa la siguiente estructura:
          <ul class="BoeAnalytics__areas-list">
          <li>
          <article class="BoeAnalytics__area-item-card">
          <strong class="BoeAnalytics__area-item--title">NOMBRE DEL AREA EN MAYÚSCULAS</strong>
          <p class="BoeAnalytics__area-item--description">Descripción del impacto</p>
          </article>
          </li>
          </ul>
          
          No incluyas comillas ni comentarios, simplemente devuelve el texto en HTML empezando y acabando con etiquetas <ul></ul>.
        
        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
