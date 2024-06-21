const path = require("path");

const { processDirectory } = require("./src/processor.js");

const inputPath = path.join(__dirname, "./input-html-files");
const outputPath = path.join(__dirname, "./output-array-files");

async function main() {
  try {
    await processDirectory(inputPath, outputPath);
    console.log("Processing completed successfully.");
  } catch (error) {
    console.error("Error processing directory:", error);
  }
}

main();