const fs = require("fs").promises;
const path = require("path");
const { extractInformationFromHTML } = require("./extractorIife.js");

module.exports = {
  processFiles: async (inputDirectoryPath, outputDirectoryPath) => {
    try {
      const files = await fs.readdir(inputDirectoryPath);
      for (const file of files) {
        const filepath = path.join(inputDirectoryPath, file);

        const htmlContent = await fs.readFile(filepath, "utf8");
        const extractedInfo = await extractInformationFromHTML(htmlContent);

        const writePath = path.join(
          outputDirectoryPath,
          path.basename(file, ".html") + ".json"
        );

        await fs.writeFile(
          writePath,
          JSON.stringify(extractedInfo, null, 2),
          "utf8"
        );
        console.log("JSON file created.");
      }
    } catch (error) {
      console.error("Error processing files:", error);
    }
  },
};
