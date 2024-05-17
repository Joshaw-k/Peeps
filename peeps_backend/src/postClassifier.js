// Load Naive Bayes Text Classifier
const Classifier = require('wink-naive-bayes-text-classifier');
// Instantiate
const nbc = Classifier();
// Load wink nlp and its model
const winkNLP = require('wink-nlp');
// Load language model
const model = require('wink-eng-lite-web-model');
const readFilesLineByLine = require('./loadTrainData');
const nlp = winkNLP(model);
const its = nlp.its;

function trainClassifier() {
    let jsonResult = {};
    try {
        jsonResult = require("./trainDataOutput.json");
    } catch (e) {
        jsonResult = {}
    }
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

    // Example usage:
    const directoryPath = 'src/train-data';
    console.log("Before read line by line")
    console.log(Object.keys(jsonResult));
    Object.keys(jsonResult).map((eachClassifier, index) => {
        // console.log("Loop learning", jsonResult[eachClassifier]);
        jsonResult[eachClassifier].map((eachClassifierText, index) => {
            // console.log("Loop learning nested", eachClassifierText);
            nbc.learn(eachClassifierText, eachClassifier);
            // console.log("after Loop learning nested", nbc);
        });
        // console.log("After learning results.")
    });
    console.log("Done reading jsonResult");
    nbc.consolidate();
    console.log("Test prediction 1", nbc.predict('Is microsoft a 3 trillion dollar company'));
    console.log("Test prediction 2", nbc.predict('What is the current value of Apples stock?'));
    // console.log(nbc.predict(inputText));

    // readFilesLineByLine(
    //     directoryPath,
    //     function (line, name) {
    //         console.log("Before learn")
    //         nbc.learn(line, name);
    //         console.log("After learn")
    //     },
    //     () => {
    //         console.log("Before consolidate")
    //         nbc.consolidate();
    //         console.log("After consolidate")
    //
    //         console.log(nbc.predict('Is microsoft a 3 trillion dollar company'));
    //         console.log(nbc.predict('What is the current value of Apples stock?'));
    //         // return nbc;
    //     }
    // );
    console.log("Time to predict text")
    // return nbc.predict(inputText)
    return nbc;
}

module.exports = trainClassifier;