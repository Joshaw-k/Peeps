const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Function to read all .txt files in a directory line by line
let catList: string[] = [];
let isDoneReading = false;

export function readFilesLineByLine(directoryPath: string, lineCallback: Function, completionCallback: Function) {
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

            // Read each line from the file
            rl.on('line', (line) => {
                // lineCallback(line, catList[filesRead - 1]);
                lineCallback(line, fileNameWithoutExt);
                // console.log(line, fileNameWithoutExt);
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
                    isDoneReading = true;
                    console.log("Done reading:", isDoneReading);
                    completionCallback();
                    // nbc.consolidate();
                    // console.log("Prediction:", nbc.predict('Is microsoft a 3 trillion dollar company'));
                }
            });

            // Increment the count of files read
            filesRead++;
            console.log(filesRead);

            // Check if all files have been read
            // if (filesRead === totalFiles) {
            if (isDoneReading) {
                // nbc.consolidate();
                // console.log(fileNameWithoutExt);
                // Call the completionCallback function
                // console.log(catList);
                console.log("I'm completed. I can run");
                // console.log("Prediction:", nbc.predict('Is microsoft a 3 trillion dollar company'));
                completionCallback();
            }
        });
    });
}

// module.exports = readFilesLineByLine;