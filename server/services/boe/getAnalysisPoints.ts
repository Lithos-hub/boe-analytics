import { openai } from '@/server/services/openai';

export const getAnalysisPoints = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Analiza el siguiente texto y clasifica los puntos en positivos, negativos y neutros. Preséntalos en formato HTML.
        Usa la siguiente estructura:
          <div class="BoeAnalytics__section--points--positive">
            <h2>Puntos positivos</h2>
            <ul class="BoeAnalytics__section--points--list">
              <li class="BoeAnalytics__section--points--list-item BoeAnalytics__section--points--list-item--positive">
                <strong>Título:</strong> Descripción
              </li>
            </ul>
          </div>
          <div class="BoeAnalytics__section--points--negative">
            <h2>Puntos negativos</h2>
            <ul class="BoeAnalytics__section--points--list">
              <li class="BoeAnalytics__section--points--list-item BoeAnalytics__section--points--list-item--negative">
                <strong>Título:</strong> Descripción
              </li>
            </ul>
          </div>
          <div class="BoeAnalytics__section--points--neutral">
            <h2>Puntos neutros</h2>
            <ul class="BoeAnalytics__section--points--list">
              <li class="BoeAnalytics__section--points--list-item BoeAnalytics__section--points--list-item--neutral">
                <strong>Título:</strong> Descripción
              </li>
            </ul>
          </div>

          
          No incluyas comillas ni comentarios, simplemente devuelve el texto en HTML empezando y acabando con etiquetas <div></div>.
        
        Texto a analizar: ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });
  return response.choices[0].message.content;
};
