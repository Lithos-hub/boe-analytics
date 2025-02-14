import { chromium } from 'playwright';

/**
 * Scrapping API call using playwright.
 * This method scrap the https://boe.es/boe/dias/YYYY/MM/DD/ URL, giving the date as parameter
 *
 */

/** HTML Example for reference
 * <div class="sumario">
  <h3 id="sec241">I. Disposiciones generales</h3>
  <h4>MINISTERIO DE TRANSPORTES Y MOVILIDAD SOSTENIBLE</h4>
  <h5>Transporte de mercancías por carretera</h5>
  <ul>
    <li class="dispo">
      <p>Orden TRM/59/2025, de 16 de enero, por la que se regula el certificado de conductor para la realización de la actividad de transporte público internacional de mercancías por carretera.</p>
      <div class="enlacesDoc">
        <ul>
          <li class="puntoPDF">
            <a href="/boe/dias/2025/01/28/pdfs/BOE-A-2025-1478.pdf" title="PDF firmado BOE-A-2025-1478">PDF (BOE-A-2025-1478 - 4 <abbr title="páginas">págs.</abbr> - 208 <abbr title="kilobytes">KB</abbr>)</a>
          </li>
          <li class="puntoHTML">
            <a href="/diario_boe/txt.php?id=BOE-A-2025-1478" title="Versión HTML BOE-A-2025-1478">Otros formatos</a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
  <h4>COMUNIDAD AUTÓNOMA DE LA RIOJA</h4>
  <h5>Presupuestos</h5>
  <ul>
    <li class="dispo">
      <p>Ley 5/2024, de 27 de diciembre, de Presupuestos Generales de la Comunidad Autónoma de La Rioja para el año 2025.</p>
      <div class="enlacesDoc">
        <ul>
          <li class="puntoPDF">
            <a href="/boe/dias/2025/01/28/pdfs/BOE-A-2025-1479.pdf" title="PDF firmado BOE-A-2025-1479">PDF (BOE-A-2025-1479 - 300 <abbr title="páginas">págs.</abbr> - 43.253 <abbr title="kilobytes">KB</abbr>)</a>
          </li>
          <li class="puntoHTML">
            <a href="/diario_boe/txt.php?id=BOE-A-2025-1479" title="Versión HTML BOE-A-2025-1479">Otros formatos</a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
  <h5>Medidas fiscales y administrativas</h5>
  <ul>
    <li class="dispo">
      <p>Ley 6/2024, de 27 de diciembre, de Medidas Fiscales y Administrativas para el año 2025.</p>
      <div class="enlacesDoc">
        <ul>
          <li class="puntoPDF">
            <a href="/boe/dias/2025/01/28/pdfs/BOE-A-2025-1480.pdf" title="PDF firmado BOE-A-2025-1480">PDF (BOE-A-2025-1480 - 49 <abbr title="páginas">págs.</abbr> - 630 <abbr title="kilobytes">KB</abbr>)</a>
          </li>
          <li class="puntoHTML">
            <a href="/diario_boe/txt.php?id=BOE-A-2025-1480" title="Versión HTML BOE-A-2025-1480">Otros formatos</a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
  <p class="linkSubir">
    <a href="#top">subir</a>
  </p>
  <h3 id="sec242A">II. Autoridades y personal. - A. Nombramientos, situaciones e incidencias</h3>
  <h4>MINISTERIO DE DEFENSA</h4>
  <h5>Nombramientos</h5>
  <ul>
    <li class="dispo">
      <p>Resolución 400/38015/2025, de 16 de enero, de la Subsecretaría, por la que se nombra personal estatutario fijo en la categoría de Enfermero/a, en la Red Hospitalaria de la Defensa.</p>
      <div class="enlacesDoc">
        <ul>
          <li class="puntoPDF">
            <a href="/boe/dias/2025/01/28/pdfs/BOE-A-2025-1481.pdf" title="PDF firmado BOE-A-2025-1481">PDF (BOE-A-2025-1481 - 2 <abbr title="páginas">págs.</abbr> - 197 <abbr title="kilobytes">KB</abbr>)</a>
          </li>
          <li class="puntoHTML">
            <a href="/diario_boe/txt.php?id=BOE-A-2025-1481" title="Versión HTML BOE-A-2025-1481">Otros formatos</a>
          </li>
        </ul>
      </div>
    </li>
    etc
    etc
    etc
 */

interface OutputData {
  [key: string]: {
    url: string;
    text?: string;
    title: string;
    subtitle: string;
  };
}
export default defineEventHandler(async (event) => {
  try {
    //   First we get the date given as parameter.
    // If it is not present, we throw an error
    // If the format is not YYYY/MM/DD (when scraping from the website), we throw an error
    const date = getRouterParam(event, 'date');

    if (!date) {
      throw createError({ statusCode: 400, statusMessage: 'Date is required' });
    }

    const formattedDate = date.replaceAll('-', '/');

    // Check if the date is in the correct format (YYYY/MM/DD)
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(formattedDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid date format. Please use YYYY/MM/DD format.',
      });
    }

    // Only I. Disposiciones generales section is needed, so we add /index.php?s=1 to the URL
    const url = `https://boe.es/boe/dias/${formattedDate}/index.php?s=1`;

    // We create a browser instance
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // We navigate to the URL
    await page.goto(url);

    // We locate "I. Disposiciones generales"
    const section = await page.locator('.sumario');

    // If the BOE is not available for this date, the message "Error 404: La página que solicita no existe" will be displayed in a <h2></h2> element
    const error404Message = await page.locator('h2').innerText();

    if (error404Message === 'Error 404: La página que solicita no existe') {
      throw createError({
        statusCode: 404,
        statusMessage: `BOE document not available for this date ${date}`,
      });
    }

    // We get all the h4 elements that follow the h3 element
    const h4Elements = await section.locator('h4').all();

    // We create an object to store the data
    const result: OutputData = {};

    // We iterate over each h4 element
    for (const h4 of h4Elements) {
      const title = await h4.innerText();

      // We get all the h5 elements that follow the h4 element
      const h5Elements = await h4.locator('xpath=following-sibling::h5').all();

      // We iterate over each h5 element
      for (const h5 of h5Elements) {
        const subtitle = await h5.innerText();

        // We get all the "puntoHTML" elements that follow the h5 element
        const puntoHTMLElements = await h5
          .locator(
            'xpath=following-sibling::ul//li[contains(@class, "puntoHTML")]',
          )
          .all();

        // We iterate over each "puntoHTML" element
        for (const element of puntoHTMLElements) {
          const link = (await element
            .locator('a')
            .getAttribute('href')) as string;

          // We navigate to the link to extract the content
          const fullUrl = `https://boe.es${link}`;
          await page.goto(fullUrl);

          const boeId = link.split('=')[1];

          // We get the text of the element
          const document = await page.$('#DOdocText');

          const text = await document?.innerText();

          // We store the data in the result object
          result[boeId] = {
            url: fullUrl,
            text,
            title: title,
            subtitle: subtitle,
          };

          // We go back to the previous page
          await page.goBack();
        }
      }
    }

    // We close the browser
    await browser.close();

    return result;
  } catch (error: unknown) {
    throw createError({
      statusCode: (error as { statusCode: number }).statusCode,
      statusMessage: (error as { statusMessage: string }).statusMessage,
    });
  }
});
