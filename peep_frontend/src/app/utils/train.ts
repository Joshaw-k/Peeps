// Load Naive Bayes Text Classifier
const Classifier = require('wink-naive-bayes-text-classifier');
// Instantiate
var nbc = Classifier();
// Load wink nlp and its model
const winkNLP = require('wink-nlp');
// Load language model
const model = require('wink-eng-lite-web-model');
const readFilesLineByLine = require('./loadTrainData');
const nlp = winkNLP(model);
const its = nlp.its;

export const postClassifier = () => {

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
    const trainArray = [];
    const directoryPath = 'train-data';
    readFilesLineByLine(
        directoryPath,
        (line, name) => {
            // console.log(`Line from file: ${line} - ${name}`);
            // console.log(line, name);
            nbc.learn(line, name);
            // nbc.consolidate();
            // trainArray.push([line, name]);
        },
        () => {
            // console.log(trainArray.length);
            // trainArray.map((eachTrainData, index) => {
            //     if (index === trainArray.length - 1) console.log("done looping traindata");
            //     nbc.learn(eachTrainData[0], eachTrainData[1]);
            // });
            console.log("printing");
            nbc.consolidate();

            console.log(nbc.predict('Is microsoft a 3 trillion dollar company'));
            console.log(nbc.predict('What is the current value of Apples stock?'));
        }
    );
}
