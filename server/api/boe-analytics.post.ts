import OpenAI from 'openai';

/**
 * This API call is used to get the deepseek results from the given text.
 * In this case, the result is an exhaustive analysis of the text, returning the following elements:
 * - Summary in a series of points along with a brief explanation of each point.
 * - Keywords that identify the content of the text.
 * - Areas affected by the measures implemented in the bulletin (Education, Health, Social, Legal, etc).
 * - Positive, negative and neutral points.
 * - Final evaluation of the content of the text as a more concise summary.
 *
 */

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_APIKEY,
});

export default defineEventHandler(async (event) => {
  const { text } = await readBody(event);

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Se te proporcionará un texto relativo al Boletín Oficial del Estado de España. Necesito que analices el texto y devuelvas un análisis exhaustivo del mismo.

        Además, deberás devolver el resultado en formato HTML con el objetivo de ser incrustado en una etiqueta <div></div> usando la directiva v-html de Vue.js.

        Los elementos que debes incluir son, al menos los siguientes:

        - Resumen en una serie de puntos con una breve explicación de cada punto.
        - Palabras clave que identifican el contenido del texto.
        - Áreas afectadas por las medidas implementadas en el boletín (Educación, Salud, Social, Legal, etc).
        - Puntos positivos, negativos y neutros.
        - Evaluación final del contenido del texto como un resumen más conciso.

        Añade otros elementos que consideres relevantes para el análisis.

        Cuando especifiques los puntos positivos, negativos y neutros, emplea una clase específica en la etiqueta <li></li> para poder aplicarles un estilo diferente en el CSS. Por ejemplo:

        <ul class="BoeAnalytics__content--list">
            <li class="BoeAnalytics__content--list-item BoeAnalytics__content--list-item--positive">
                <strong>1. Nombre del primer punto: </strong> Descripción del primer punto.
            </li>
            <li class="BoeAnalytics__content--list-item BoeAnalytics__content--list-item--negative">
                <strong>2. Nombre del segundo punto: </strong> Descripción del segundo punto.
            </li>
            <li class="BoeAnalytics__content--list-item BoeAnalytics__content--list-item--neutral">
                <strong>3. Nombre del tercer punto: </strong> Descripción del tercer punto.
            </li>
        </ul>
        
        Emplea todas las etiquetas HTML que consideres necesarias para estructurar el contenido de manera adecuada, como párrafos, listas, tablas, etc.

        Devuelve el resultado en formato HTML sin comentarios ni comillas ni cualquier otro elemento que no sea HTML, ya que el objetivo es usarlo en una directiva v-html de Vue.js.

        Identifica cada sección con un identificador único para que se pueda aplicar un estilo diferente en el CSS. Por ejemplo:

        <div id="summary" >
        <h2>Principales puntos</h2>
            // contenido de la sección
        </div>

        <div id="keywords">
            <h2>Palabras clave</h2>
            // contenido de la sección
        </div>

        <div id="areas">
            <h2>Áreas afectadas</h2>
            // contenido de la sección
        </div>

        <div id="positive-points">
            <h2>Puntos positivos</h2>
            // contenido de la sección
        </div>

        <div id="negative-points">
            <h2>Puntos negativos</h2>
            // contenido de la sección
        </div>

        <div id="neutral-points">
            <h2>Puntos neutros</h2>
            // contenido de la sección
        </div>

        El texto es el siguiente:
        ${text}`,
      },
    ],
    model: 'deepseek-chat',
  });

  return response.choices[0].message.content;
});
