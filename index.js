/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.healthComplete = async (message, context) => {
  const puppeteer = require('puppeteer');

  let healthComplete = async () => {
    const url = 'https://tdsb.service-now.com/tswp';
    const cookiesString = `PASTE COOKIES HERE`;
    const cookies = JSON.parse(cookiesString);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    try {// Login with cookies
      await page.setCookie(...cookies);
      await page.goto(url);

      // Click Health Self-Assessment
      await page.waitForSelector('a[href="?id=sc_cat_item&sys_id=6c8c4df0dbf218d8a613fe052c9619da"]');
      await page.click('a[href="?id=sc_cat_item&sys_id=6c8c4df0dbf218d8a613fe052c9619da"]');
      // Wait for assessment page load
      await page.waitForSelector('input[name="radio_button_across_12365d8bdbab50d8fe47c59b13961907_6c8c4df0dbf218d8a613fe052c9619da"]');
      // Click all no options
      await page.click('input[name="radio_button_across_12365d8bdbab50d8fe47c59b13961907_6c8c4df0dbf218d8a613fe052c9619da"][value="no"]'); // Fever
      await page.click('input[name="radio_button_across_53461503dbab50d8fe47c59b1396194f_6c8c4df0dbf218d8a613fe052c9619da"][value="no"]'); // Cough
      await page.click('input[name="radio_button_across_37a79d47db2f50d8fe47c59b139619a1_6c8c4df0dbf218d8a613fe052c9619da"][value="no"]'); // Difficulty breathing
      await page.click('input[name="radio_button_across_c7961983dbeb50d8fe47c59b13961963_6c8c4df0dbf218d8a613fe052c9619da"][value="no"]'); // Loss of smell
      await page.click('input[name="radio_button_across_6ff65d0fdbeb50d8fe47c59b1396195e_6c8c4df0dbf218d8a613fe052c9619da"][value="no"]'); // Nausea
      await page.click('input[name="radio_button_across_990d559e1bb42890b8be41d3b24bcbcf_6c8c4df0dbf218d8a613fe052c9619da"][value="no"]'); // Anyone else have above
      await page.click('input[name="radio_button_across_198c4d34dbf218d8a613fe052c961902_6c8c4df0dbf218d8a613fe052c9619da"][value="no"]'); // Close contact
      await page.click('input[name="radio_button_across_91506ab51b92f4185526b91f034bcbed_6c8c4df0dbf218d8a613fe052c9619da"][value="No"]'); // Travelled outside Canada
      await page.click('input[name="radio_button_across_de9d19b41b6e34985526b91f034bcbe2_6c8c4df0dbf218d8a613fe052c9619da"][value="No"]'); // Positive on test
      const button = await page.$('button[name="submit"]'); // Submit
      await button.evaluate(b => b.click());
      await page.waitForSelector('#qrcode');

      await browser.close();
    } catch {
      throw 'Failure';
    }
  }

  await healthComplete().then(() => console.log('Success')).catch(error => console.log(error));
};