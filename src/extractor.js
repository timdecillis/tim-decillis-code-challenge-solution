const cheerio = require("cheerio");

const extractHTMLInfo = (htmlContent, placeholderSrcs) => {
  const $ = cheerio.load(htmlContent);
  const extractedInfo = [];

  // target the first element that is a scrolling carousel, or contains html structure with multiple img's
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

  // iterate through and extract the data from each anchor element
  targetElement.find("a").each((index, anchor) => {
    const data = extractDataFromAnchor($(anchor), placeholderSrcs);
    if (data) extractedInfo.push(data);
  });

  return extractedInfo;
};

const extractDataFromAnchor = (anchor, placeholderSrcs) => {
  // collect the text from child divs to find the name and extensions
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

  // set the image value to null if the placeholder src was not replaced
  if (image && placeholderSrcs.includes(image)) {
    image = null;
  }

  const data = { name, extensions: [extensions], link, image };
  if (!data.extensions[0]) delete data.extensions;

  return data;
};

module.exports = {
  extractHTMLInfo,
};
