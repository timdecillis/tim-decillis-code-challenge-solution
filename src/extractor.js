const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const extractElementInfo = async (htmlContent, initialSrc) => {
  const $ = cheerio.load(htmlContent);
  const extractedInfo = [];

  const div = $(".wDYxhc").first();
  $(div)
    .find("a")
    .each((index, element) => {
      const name = $(element).find(".pgNMRc").text();
      const year = $(element).find(".cxzHyb").text();
      const link = `https://www.google.com${$(element).attr("href")}`;
      let imgElement = $(element).find("img");
      let image =
        imgElement.attr("src") === initialSrc ? null : imgElement.attr("src");

      const extensions = [year];
      let object = { name, extensions, link, image };
      extractedInfo.push(object);
    });

  return extractedInfo;
};

const extractInitialSrc = (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  const initialSrc = $(".wDYxhc").first().find("a").find("img").attr("src");

  return initialSrc;
};

module.exports = {
  extractInformationFromHTML: async (htmlContent) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const initialSrc = extractInitialSrc(htmlContent);
    await page.waitForSelector('img[src]:not([src=""])');

    const updatedHtml = await page.content();

    const extractedInfo = await extractElementInfo(updatedHtml, initialSrc);

    await browser.close();

    return extractedInfo;
  },
};
