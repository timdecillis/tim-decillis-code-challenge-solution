const cheerio = require("cheerio");
const { loadHTML } = require("./loader.js");
const { extractHTMLInfo } = require("./extractor.js");

const loadAndExtractFromHTML = async (htmlContent) => {
  const placeholderSrcs = [];
  const $ = cheerio.load(htmlContent);
  // find the placeholder img src's to compare with ones that are not updated after loading
  $("img").each((index, element) => {
    const src = $(element).attr("src");
    if (src && !placeholderSrcs.includes(src)) {
      placeholderSrcs.push(src);
    }
  });
  try {
    const loadedHTML = await loadHTML(htmlContent);
    return extractHTMLInfo(loadedHTML, placeholderSrcs);
  } catch (error) {
    console.error("Error during loading and extracting:", error);
    throw error;
  }
};

module.exports = { loadAndExtractFromHTML };
