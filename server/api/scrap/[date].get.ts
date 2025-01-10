import { chromium } from 'playwright';

/**
 * Scrapping API call using playwright.
 * This method scrap the https://boe.es/boe/dias/YYYY/MM/DD/ URL, giving the date as parameter
 *
 */

export default defineEventHandler(async (event) => {
  //   First we get the date given as parameter.
  // If it is not present, we throw an error
  // If the format is not YYYY/MM/DD, we throw an error
  const date = getRouterParam(event, 'date');

  if (!date) {
    throw createError({ statusCode: 400, statusMessage: 'Date is required' });
  }

  const formattedDate = date.replaceAll('-', '/');

  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(formattedDate)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid date format',
    });
  }

  const url = `https://boe.es/boe/dias/${formattedDate}/`;

  // We create a browser instance
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // We navigate to the URL
  await page.goto(url);

  //   First we get the <li class="dispo"> element
  const disposicionesGenerales = await page.$('.dispo');

  if (!disposicionesGenerales) {
    throw createError({
      statusCode: 400,
      statusMessage: 'disposicionesGenerales element not found',
    });
  }

  // Inside the disposicionesGenerales element, we get the <li class="puntoHTML"> element
  const otrosFormatosElement = await disposicionesGenerales.$('.puntoHTML');

  if (!otrosFormatosElement) {
    throw createError({
      statusCode: 400,
      statusMessage: 'otrosFormatosElement element not found',
    });
  }

  //   Finally, we get the <a> element inside the otrosFormatosElement
  const linkElement = await otrosFormatosElement.$('a');

  if (!linkElement) {
    throw createError({
      statusCode: 400,
      statusMessage: 'linkElement element not found',
    });
  }

  //   We navigate to the href of the link, that should be something similar to href="/diario_boe/txt.php?id=BOE-A-2025-410"
  const href = await linkElement.getAttribute('href');

  // We build the URL
  const docUrl = `https://boe.es${href}`;

  // We navigate to the docUrl
  await page.goto(docUrl);

  //   In that page, we need to get the id="DOdocText" element
  const docTextElement = await page.$('#DOdocText');

  if (!docTextElement) {
    throw createError({
      statusCode: 400,
      statusMessage: 'docTextElement element not found',
    });
  }

  //   We get the text content of the element
  const text = await docTextElement.innerText();

  // We close the browser
  await browser.close();

  // We return the text
  return text;
});
