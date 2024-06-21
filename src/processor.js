const fs = require("fs").promises;
const path = require("path");
const { loadAndExtractFromHTML } = require("./extractor.js");

const processFile = async (inputPath, outputPath) => {
  try {
    const htmlContent = await fs.readFile(inputPath, "utf8");
    const extractedInfo = await loadAndExtractFromHTML(htmlContent);
    const writePath = path.join(
      outputPath,
      path.basename(inputPath, ".html") + ".json"
    );

    await fs.writeFile(
      writePath,
      JSON.stringify(extractedInfo, null, 2),
      "utf8"
    );
    console.log("JSON file created for:", path.basename(inputPath));
  } catch (error) {
    console.error("Error processing file:", path.basename(inputPath), error);
  }
};

const processDirectory = async (inputDirectoryPath, outputDirectoryPath) => {
  try {
    const files = await fs.readdir(inputDirectoryPath, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile() && file.name.endsWith(".html")) {
        const filepath = path.join(inputDirectoryPath, file.name);
        await processFile(filepath, outputDirectoryPath);
      }
    }
  } catch (error) {
    console.error("Error processing directory:", inputDirectoryPath, error);
  }
};

module.exports = { processDirectory };
