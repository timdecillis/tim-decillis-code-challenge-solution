const path = require("path");
const fs = require("fs").promises;
const { loadAndExtractFromHTML } = require("./src/index.js");

const inputDirectoryPath = path.join(__dirname, "./input-html-files");
const outputPath = path.join(__dirname, "./output-array-files");

async function main() {
  try {
    // read files from directory
    const files = await fs.readdir(inputDirectoryPath, {
      withFileTypes: true,
    });
    // for each file
    for (const file of files) {
      // construct the file path
      const filepath = path.join(inputDirectoryPath, file.name);
      // read the file
      const htmlContent = await fs.readFile(filepath, "utf8");
      // use the extractor
      const extractedInfo = await loadAndExtractFromHTML(htmlContent);
      // construct write path
      const writePath = path.join(
        outputPath,
        path.basename(filepath, ".html") + ".json"
      );
      // write file to output directory
      await fs.writeFile(
        writePath,
        JSON.stringify(extractedInfo, null, 2),
        "utf8"
      );
      console.log("JSON file created for:", path.basename(filepath));
    }
    console.log("Processing completed successfully.");
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

main();
