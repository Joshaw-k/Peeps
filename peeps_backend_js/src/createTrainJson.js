const fs = require('fs');
const path = require('path');
const readline = require('readline');

var Classifier = require('wink-naive-bayes-text-classifier');
// Instantiate
var nbc = Classifier();
// Load wink nlp and its model
const winkNLP = require('wink-nlp');
// Load language model
const model = require('wink-eng-lite-web-model');
const readFilesLineByLine = require('./loadTrainData');
const nlp = winkNLP(model);
const its = nlp.its;

const directoryPath = 'src/train-data';
let isDoneReading = false;

const prepTask = function (text) {
    const tokens = [];
    nlp.readDoc(text)
        .tokens()
        // Use only words ignoring punctuations etc and from them remove stop words
        .filter((t) => (t.out(its.type) === 'word' && !t.out(its.stopWordFlag)))
        // Handle negation and extract stem of the word
        .each((t) => tokens.push((t.out(its.negationFlag)) ? '!' + t.out(its.stem) : t.out(its.stem)));

    return tokens;
};
nbc.definePrepTasks([prepTask]);
// Configure behavior
nbc.defineConfig({ considerOnlyPresence: true, smoothingFactor: 0.5 });
// Train!


// Function to read all .txt files in a directory line by line
let catList = [];
let jsonData = {}

console.log("Open directory");

function createJSONFile(outputFilePath) {
    // function readFilesLineByLine(directoryPath, lineCallback, completionCallback) {
    // Read all files in the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        // Filter out only the .txt files
        const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');

        let filesRead = 0;
        const totalFiles = txtFiles.length;
        console.log(totalFiles);

        // Iterate through each .txt file
        txtFiles.forEach(txtFile => {
            const filePath = path.join(directoryPath, txtFile);
            const fileNameWithoutExt = txtFile.split(".txt")[0];
            const rl = readline.createInterface({
                input: fs.createReadStream(filePath),
                crlfDelay: Infinity
            });
            if (!catList.includes(fileNameWithoutExt)) {
                // console.log("insideherr");
                catList.push(fileNameWithoutExt);
            }
            jsonData[fileNameWithoutExt] = [];

            // Read each line from the file
            rl.on('line', (line) => {
                // lineCallback(line, catList[filesRead - 1]);
                // console.log(line, fileNameWithoutExt);
                jsonData[fileNameWithoutExt].push(line);
                // nbc.learn(line, fileNameWithoutExt);
                // if (filesRead === totalFiles) {
                //     isDoneReading = true;
                //     console.log("Done reading:", isDoneReading);
                // }
            });
            rl.prependListener('line', () => {

            });

            // Handle any errors while reading the file
            rl.on('error', (err) => {
                console.error(`Error reading file ${filePath}: ${err}`);
            });

            // Handle end of file
            rl.on('close', () => {
                // Increment the count of files read
                // filesRead++;

                // Check if all files have been read
                console.log("Reading:", filesRead, fileNameWithoutExt);
                if (filesRead === totalFiles && catList[catList.length - 1] === fileNameWithoutExt) {
                    // Call the completionCallback function
                    // completionCallback();
                    isDoneReading = true;
                    console.log("Done reading:", isDoneReading);
                    // nbc.consolidate();
                    fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), (err) => {
                        if (err) {
                            console.error(`Error writing JSON file: ${err}`);
                            return;
                        }
                        console.log('JSON file created successfully.');
                    });
                    // console.log("Prediction:", nbc.predict('Is microsoft a 3 trillion dollar company'));
                }
            });

            // Increment the count of files read
            filesRead++;
            console.log(filesRead);

            // Check if all files have been read
            // if (filesRead === totalFiles) {
            // if (isDoneReading) {
            //     nbc.consolidate();
            //     console.log(fileNameWithoutExt);
            //     // Call the completionCallback function
            //     // console.log(catList);
            //     console.log("I'm completed. I can run");
            //     // completionCallback();
            //     fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            //         if (err) {
            //             console.error(`Error writing JSON file: ${err}`);
            //             return;
            //         }
            //         console.log('JSON file created successfully.');
            //     });
            //     console.log("Prediction:", nbc.predict('Is microsoft a 3 trillion dollar company'));
            // }
        });
    });
    // }
}

// const outputFilePath = 'trainDataOutput.json';
// createJSONFile(outputFilePath);

module.exports = createJSONFile;