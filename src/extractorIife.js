const cheerio = require("cheerio");

const extractElementInfo = (htmlContent, iifeObjects) => {
  const $ = cheerio.load(htmlContent);
  const extractedInfo = [];
  let count = 1;

  const div = $(".wDYxhc").first();
  $(div)
    .find("a")
    .each((index, element) => {
      const name = $(element).find(".pgNMRc").text();
      const year = $(element).find(".cxzHyb").text();
      const link = `https://www.google.com${$(element).attr("href")}`;
      let image = null;
      const extensions = [year];

      const id = $(element).find("img").attr("id");

      for (let i = 0; i < iifeObjects.length; i++) {
        const current = iifeObjects[i];
        if (current.ii === id) {
          image = current.s;
          break;
        }
      }

      let object = { name, extensions, link, image };
      extractedInfo.push(object);
    });

  return extractedInfo;
};

const extractIifeObjects = (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  const iifeObjects = [];

  const iifePattern =
    /\(function\(\)\{var s='([^']+)';var ii=\[([^\]]+)\];_setImagesSrc\(ii,s\);\}\)\(\);/g;

  $("script").each((index, element) => {
    const scriptContent = $(element).html();
    let match;
    while ((match = iifePattern.exec(scriptContent)) !== null) {
      const s = match[1];
      const ii = match[2].split(",");

      const cleanedIi = ii.map((item) => item.trim().replace(/'/g, ""));
      iifeObjects.push({ s, ii: cleanedIi[0] });
    }
  });

  return iifeObjects;
};

module.exports = {
  extractInformationFromHTML: async(htmlContent) => {
    const iifeObjects = extractIifeObjects(htmlContent);
    return extractElementInfo(htmlContent, iifeObjects);
  },
};
