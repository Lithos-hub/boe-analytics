import { openai } from '../openai';

export const getAnalysisPoints = async (text: string) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Analiza el siguiente texto y clasifica los puntos en positivos, negativos y neutros. Preséntalos en formato HTML.
        Usa la siguiente estructura:
          <div id="positive-points">
            <h2>Puntos positivos</h2>
            <ul class="BoeAnalytics__content--list">
              <li class="BoeAnalytics__content--list-item BoeAnalytics__content--list-item--positive">
                <strong>Título:</strong> Descripción
              </li>
            </ul>
          </div>
          <div id="negative-points">
            <h2>Puntos negativos</h2>
            <ul class="BoeAnalytics__content--list">
              <li class="BoeAnalytics__content--list-item BoeAnalytics__content--list-item--negative">
                <strong>Título:</strong> Descripción
              </li>
            </ul>
          </div>
          <div id="neutral-points">
            <h2>Puntos neutros</h2>
            <ul class="BoeAnalytics__content--list">
              <li class="BoeAnalytics__content--list-item BoeAnalytics__content--list-item--neutral">
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
