/**
 * This endpoint scrapes each day of the month and returns the number of documents for each day.
 * The format of the date is YYYY-MM.
 */

import { chromium, Browser } from 'playwright';

const CONCURRENT_REQUESTS = 5; // Number of concurrent requests

async function scrapDay(browser: Browser, date: string): Promise<number> {
  const page = await browser.newPage();
  try {
    const url = `https://boe.es/boe/dias/${date}/index.php?s=1`;
    await page.goto(url);

    const section = await page.locator('.sumario');
    const error404Message = await page.locator('h2').innerText();

    if (error404Message === 'Error 404: La página que solicita no existe') {
      return 0;
    }

    const h4Elements = await section.locator('.puntoHTML').all();
    return h4Elements.length;
  } finally {
    await page.close();
  }
}

async function processBatch(
  browser: Browser,
  dates: string[],
): Promise<Record<string, number>> {
  const results = await Promise.all(
    dates.map((date) => scrapDay(browser, date)),
  );

  return Object.fromEntries(dates.map((date, index) => [date, results[index]]));
}

export default defineEventHandler(async (event) => {
  console.time('Scraping month');
  try {
    const date = event.context.params?.date;

    if (!date) {
      throw createError({ statusCode: 400, statusMessage: 'Date is required' });
    }

    const formattedDate = date.replaceAll('-', '/');

    if (!formattedDate || !/^\d{4}\/\d{2}$/.test(formattedDate)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid month format. It must be YYYY-MM',
      });
    }

    const [year, month] = formattedDate.split('/');
    const lastDay = new Date(Number(year), Number(month), 0).getDate();

    // We create all the dates of the month
    const dates = Array.from({ length: lastDay }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      const paddedMonth = String(Number(month)).padStart(2, '0');
      return `${year}/${paddedMonth}/${day}`;
    });

    // We start the browser with optimized configuration
    const browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const documentsPerDay: Record<string, number> = {};

    // We process the dates in batches
    for (let i = 0; i < dates.length; i += CONCURRENT_REQUESTS) {
      const batch = dates.slice(i, i + CONCURRENT_REQUESTS);
      const batchResults = await processBatch(browser, batch);
      Object.assign(documentsPerDay, batchResults);

      // Small pause between batches to avoid overloading
      if (i + CONCURRENT_REQUESTS < dates.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    await browser.close();

    return {
      documentsPerDay,
    };
  } catch (error) {
    console.error('Error in month scraping:', error);
    throw createError({
      statusCode: 500,
      message: 'Error getting the month documents',
    });
  } finally {
    console.timeEnd('Scraping month');
  }
});
