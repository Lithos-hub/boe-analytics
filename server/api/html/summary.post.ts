import OpenAI from 'openai';
import { missingPropertyHandler } from '~/validators/errorHandlers';

/**
 * This API call is used to get the deepseek results from the given text.
 *
 */

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_APIKEY,
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const text = missingPropertyHandler('text', body);

    // First call to get the brief summary
    const briefSummary = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Necesito que resumas los principales puntos que aparecen en él. Si el texto es muy largo, intenta resumirlo en 6 puntos. Si el texto es muy corto, simplemente devuelve un resumen breve explicando qué aplica ese boletín en uno o más párrafos.
          
          Además, deberás devolver el resultado en formato HTML con el objetivo de ser incrustado en una etiqueta <div></div> usando la directiva v-html de Vue.js.

          Estos son los dos casos que se pueden dar:

          // Caso 1: El texto es muy largo
          <div class="BOE__summary">
            <p>El Boletín Oficial del Estado de España se resume en los siguientes puntos:</p>  
            <ul class="BOE__summary-list">
                <li class="BOE__summary-list-item">
                    <strong>1. Nombre del primer punto: </strong> Descripción del primer punto.
                </li>
            </ul>
          </div>

          // Caso 2: El texto es muy corto
          <div class="BOE__summary">
            <p>Resume aquí el texto del boletín en uno o más párrafos.</p>  
            <p>...</p>
          </div>

          No incluyas comillas ni comentarios, simplemente devuelve el texto en HTML empezando y acabando con etiquetas <div></div>.
          
          El texto es el siguiente:
          ${text}`,
        },
      ],
      model: 'deepseek-chat',
    });

    // Second call to get the stats
    const statsAnalysis = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Analiza el siguiente texto del Boletín Oficial del Estado de España y clasifica los puntos principales en tres categorías: positivos, negativos y neutrales.
          
          El resultado a devolver debe ser exactamente la siguiente cadena de texto, que en realidad es un objeto JSON:

          { "positive": número_de_puntos_positivos (número entero), "negative": número_de_puntos_negativos (número entero), "neutral": número_de_puntos_neutrales (número entero) }

          No especifiques el tipo de código mediante comillas ni comentarios, simplemente devuelve la cadena de texto empezando y acabando con llaves.

          Considera como positivos aquellos puntos que beneficien a la ciudadanía o mejoren algún aspecto de la sociedad.
          Como negativos, aquellos que impongan restricciones, sanciones o tengan un impacto desfavorable.
          Como neutrales, aquellos que sean informativos o no tengan un impacto claro positivo o negativo.

          El texto es el siguiente:
          ${text}`,
        },
      ],
      model: 'deepseek-chat',
    });

    let stats = { positive: 0, negative: 0, neutral: 0 };
    try {
      stats = JSON.parse(statsAnalysis.choices[0].message.content ?? '{}');
    } catch (e) {
      console.error('Error parsing stats JSON:', e);
    }

    return {
      briefSummary: briefSummary.choices[0].message.content ?? '',
      stats,
    };
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return {
      briefSummary: '',
      stats: { positive: 0, negative: 0, neutral: 0 },
    };
  }
});
