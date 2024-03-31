const fs = require("fs");
const cheerio = require("cheerio");

const findImageSrc = (rawHTML, id) => {
  // iterate through the data
};

function extractInformationFromHTML(htmlContent) {
  try {
    const $ = cheerio.load(htmlContent);

    const extractedInfo = [];

    // $('span.kxbc').each((index, element) => {
    //   heading = $(element).attr('data-elabel')

    //   if (heading) console.log('header:', heading)
    // });
    $("script").each((index, element) => {
      let count = 1;
      const scriptContent = $(element).text();
      const regex = /_setImagesSrc\([^\)]+\)/g;
      let match;
      while ((match = regex.exec(scriptContent)) !== null) {
        console.log(`Found _setImagesSrc call number ${count}:`);
        count ++;
      }
    });

    // $(".klitem").each((index, element) => {
    //   const name = $(element).attr("aria-label");
    //   const title = $(element).attr("title");
    //   const extensions = [];
    //   const link = $(element).attr("href");
    //   const firstChild = $(element).find("div.klzc");
    //   const secondChild = $(firstChild).find("div.klic");
    //   const thirdChild = $(secondChild).find("g-img");
    //   const image = $(thirdChild).find("img").attr("id");

    //   const matches = title.match(/\((\d{4})\)/);
    //   if (matches) {
    //     extensions.push(matches[1]);
    //   }
    //   let object = {
    //     name,
    //     link,
    //     image,
    //   };
    //   if (extensions.length) {
    //     object.extensions = extensions;
    //   }
    //   extractedInfo.push(object);
    // });

    // return extractedInfo;
  } catch (error) {
    console.error("Error extracting information:", error);
    return [];
  }
}

const filename = "files/van-gogh-paintings.html";
fs.readFile(filename, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const extractedInfo = extractInformationFromHTML(data);
  console.log(extractedInfo);
});
