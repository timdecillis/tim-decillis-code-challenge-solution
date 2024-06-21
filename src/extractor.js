const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const extractHTMLInfo = async (htmlContent, placeholderSrcs) => {
  const $ = cheerio.load(htmlContent);
  const extractedInfo = [];

  let targetElement = $(
    ":has(div > a:has(img)), :has(a:has(img)), g-scrolling-carousel"
  )
    .filter(
      (index, element) =>
        $(element).children("div").children("a:has(img)").length > 1 ||
        $(element).children("a:has(img)").length > 1
    )
    .first();

  if (!targetElement) {
    return [];
  }

  targetElement.find("a").each((index, anchor) => {
    const data = extractDataFromAnchor($(anchor), placeholderSrcs);
    if (data) extractedInfo.push(data);
  });

  return extractedInfo;
};

const extractDataFromAnchor = (anchor, placeholderSrcs) => {
  const textArray = anchor
    .find("div")
    .not(":has(img)")
    .map((index, div) => {
      const $div = cheerio.load(div);
      return $div.text().replace(/\n|\t/g, " ").replace(/\s+/g, " ").trim();
    })
    .get();

  const [name, extensions] = textArray.slice(1);
  const link = `https://www.google.com${anchor.attr("href")}`;
  let image = anchor.find("img").attr("src") || null;

  if (image && placeholderSrcs.includes(image)) {
    image = null;
  }
  const data = { name, extensions: [extensions], link, image };
  if (!data.extensions[0]) delete data.extensions;

  return data;
};

const loadAndExtractFromHTML = async (htmlContent) => {
  const placeholderSrcs = [];
  const $ = cheerio.load(htmlContent);

  $("img").each((index, element) => {
    const src = $(element).attr("src");
    if (src && !placeholderSrcs.includes(src)) {
      placeholderSrcs.push(src);
    }
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const updatedHtml = await page.content();
    return await extractHTMLInfo(updatedHtml, placeholderSrcs);
  } catch (error) {
    console.error("Error during HTML processing:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = {
  loadAndExtractFromHTML,
};
