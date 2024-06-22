const fs = require("fs");
const path = require("path");

const { loadAndExtractFromHTML } = require("../src/extractor.js");

describe("comparing expected array to output array for van gogh paintings", () => {
  const expectedArrayPath = path.join(
    __dirname,
    "../files/expected-array.json"
  );
  const inputHTMLPath = path.join(
    __dirname,
    `../input-html-files/van-gogh-paintings.html`
  );
  let expectedArray;
  let actualArray;

  beforeAll(async () => {
    expectedArray = JSON.parse(fs.readFileSync(expectedArrayPath, "utf8"));
    const inputHTML = fs.readFileSync(inputHTMLPath, "utf8");
    actualArray = await loadAndExtractFromHTML(inputHTML);
  }, 15000);

  test("arrays are the same length", () => {
    expect(actualArray.length).toEqual(expectedArray.length);
  });

  test("array items contain the same name value", () => {
    actualArray.forEach((item, index) => {
      expect(item.name).toBe(expectedArray[index].name);
    });
  });
  test("array items contain the same extensions value", () => {
    actualArray.forEach((item, index) => {
      if (actualArray[index].extensions) {
        expect(item.extensions).toEqual(expectedArray[index].extensions);
      }
    });
  });
  test("array items contain the same link value", () => {
    actualArray.forEach((item, index) => {
      expect(item.link).toBe(expectedArray[index].link);
    });
  });
  test("array items contain the same image value", () => {
    actualArray.forEach((item, index) => {
      if (item.image) {
        const imageSlice = item.image.slice(0, 4000);
        expect(imageSlice).toBe(expectedArray[index].image.slice(0, 4000));
      }
    });
  });
});
