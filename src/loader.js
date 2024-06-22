const puppeteer = require("puppeteer");

const loadHTML = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    const updatedHtml = await page.content();
    return updatedHtml;
  } catch (error) {
    console.error("Error during HTML loading:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { loadHTML };
