// Load Naive Bayes Text Classifier
const Classifier = require('wink-naive-bayes-text-classifier');
// Instantiate
const nbc = Classifier();
// Load wink nlp and its model
const winkNLP = require('wink-nlp');
// Load language model
const model = require('wink-eng-lite-web-model');
const readFilesLineByLine = require('./train');
const nlp = winkNLP(model);
const its = nlp.its;

// function classifyText(text) {
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
nbc.defineConfig({considerOnlyPresence: true, smoothingFactor: 0.5});
// Train!

// Example usage:
const directoryPath = '../train-data';
readFilesLineByLine(
    directoryPath,
    (line, name) => {
        nbc.learn(line, name);
    },
    () => {
        nbc.consolidate();

        console.log(nbc.predict('Is microsoft a 3 trillion dollar company'));
        console.log(nbc.predict('What is the current value of Apples stock?'));
    }
);
// }

// module.exports = classifyText;