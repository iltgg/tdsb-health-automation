const puppeteer = require("puppeteer");
const fs = require("fs").promises;

let getLoginCookies = async () => {
  const url = "https://tdsb.service-now.com/tswp";
  const email = "";
  const password = "";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Login and get cookies

  await page.goto(url);
  // Email input
  await page.waitForSelector("#i0116");
  await page.type("#i0116", email);
  await page.click("#idSIButton9");
  // Password input
  await page.waitForSelector("#idSIButton9");
  await page.waitForTimeout(1000);
  await page.type("#i0118", password);
  await page.click("#idSIButton9");
  // Keep me signed in
  await page.waitForNavigation();
  await page.waitForSelector("#idSIButton9");
  await page.click("#idSIButton9");
  // Get microsoft login cookies
  await page.waitForNavigation();
  await page.waitForTimeout(1000);
  const cookies = await page.cookies("https://login.microsoftonline.com");
  await fs.writeFile("./cookies.json", JSON.stringify(cookies, null, 2));
};

getLoginCookies();
