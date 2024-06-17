const fs = require("fs").promises;
const path = require("path");
const {processFiles} = require('./src/processor.js');

const inputPath = path.join(__dirname, "./input-html-files");
const outputPath = path.join(__dirname, "./output-array-files");

processFiles(inputPath, outputPath);

