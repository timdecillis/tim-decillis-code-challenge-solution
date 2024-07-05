const fs = require("fs");
const path = require("path");

const { loadAndExtractFromHTML } = require("../src/index.js");

describe("extractor methods", () => {
  test("handles error", () => {});
});

describe("extracting from different html files", () => {
  const inputFiles = [
    "basquiat-paintings.html",
    "pollock-paintings.html",
    "van-gogh-paintings.html",
  ];

  inputFiles.forEach((inputFile) => {
    const fileName = path.basename(inputFile, ".html");

    beforeAll(async () => {
      const inputHTMLPath = path.resolve(
        __dirname,
        `../input-html-files/${inputFile}`
      );
      const inputHTML = fs.readFileSync(inputHTMLPath, "utf8");

      actualArray = await loadAndExtractFromHTML(inputHTML);
    }, 15000);

    test(`${fileName} has all required properties`, () => {
      const propertiesToCheck = ["name", "link", "image"];

      actualArray.forEach((item) => {
        propertiesToCheck.forEach((property) => {
          expect(item).toHaveProperty(property);
        });
      });
    });
    test("name value is not null", () => {
      actualArray.forEach((item) => {
        expect(item.name).toBeTruthy();
      });
    });
    test("extension value, when it exists, is an array, and is not empty", () => {
      actualArray.forEach((item) => {
        if (item.extensions) {
          expect(item.extensions.length).toBeGreaterThan(0);
          expect(Array.isArray(item.extensions)).toBe(true);
        }
      });
    });
    test("link value has the correct heading", () => {
      const validHeading = "https://www.google.com/search";
      actualArray.forEach((item) => {
        expect(item.link.startsWith(validHeading)).toBe(true);
      });
    });
    test("image value has the correct heading, or is null", () => {
      const validHeading = "data:image/jpeg";
      actualArray.forEach((item) => {
        expect(item.image === null || item.image.startsWith(validHeading)).toBe(
          true
        );
      });
    });
  });
});
