# Tim DeCillis Code Challenge Submission

I had a lot of fun completing this challenge, which required evaluating several potential solutions. The primary challenge was to develop a solution flexible enough to handle various HTML layouts, including those with carousels and expandable grids.

While using CSS class names to target specific elements would have been a quick hack to get a solution for a specific file, I aimed for a more flexible solution. Ultimately, I came up with a heuristic approach that searches for different structures within the HTML to locate the target image gallery.Though this approach isn't entirely fault-tolerant (as it depends on the HTML structure of the page, which is subject to change), I believe it is a solid solution given the time constraints, which produces the intended results from extracting information from both the included html file, as well as the html files which I collected from current Google search results.

I am eager to discuss the assessment further and welcome any feedback you may have!

## Getting Started

* Node.js is required to run the app.
* Clone the repository to your local machine.
* From the root directory of the repo, first install dependencies using
```
npm install
```
## Usage

The app uses `index.js` as its entry point, and from there reads the `input-html-files directory` and uses the code in `src` to extract the data from each file. It then writes the extracted data to a json file in the `output-array-files directory`. To run the program use the following command:
```
npm start
```
## Testing
The `tests` directory contains two test files:

1. `extractor.test.js`: This file tests the functionality of `extractor.js` by verifying the extracted results against three different HTML files to ensure the extractor works correctly across various layouts.
2. `expected-array.test.js`: This file tests the result of using the extractor on the included `van-gogh-paintings.html` file, comparing the output to the expected results stored in `expected-array.json`.

To run the tests, use the following command:
```
npm test
```