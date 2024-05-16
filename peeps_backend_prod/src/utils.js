function classifyText(input) {
    // Load Naive Bayes Text Classifier
    var Classifier = require('wink-naive-bayes-text-classifier');
    // Instantiate
    var nbc = Classifier();
    // Load wink nlp and its model
    const winkNLP = require('wink-nlp');
    // Load language model
    const model = require('wink-eng-lite-web-model');
    const nlp = winkNLP(model);
    const its = nlp.its;

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
}

function subtractArrays(array1, array2) {
    const maxLength = Math.max(array1.length, array2.length);

    // Pad the shorter array with zeroes to match the length of the longer array
    const paddedArray1 = array1.concat(Array(maxLength - array1.length).fill(0));
    const paddedArray2 = array2.concat(Array(maxLength - array2.length).fill(0));

    // Perform subtraction
    const result = [];
    for (let i = 0; i < maxLength; i++) {
        result.push(paddedArray1[i] - paddedArray2[i]);
    }

    return result;
}

module.exports = subtractArrays;


function arrayDifference(array1, array2) {
    // Filter elements in array1 that are not present in array2
    const difference = array1.filter(element => !array2.includes(element));
    return difference;
}
module.exports = arrayDifference;

function symmetricDifference(array1, array2) {
    // Get elements from array1 not in array2
    const difference1 = arrayDifference(array1, array2);
    // Get elements from array2 not in array1
    const difference2 = arrayDifference(array2, array1);
    // Combine the differences
    const symmetricDiff = difference1.concat(difference2);
    return symmetricDiff;
}
module.exports = symmetricDifference;


function postArrayDifference(array1, array2) {
    // Filter elements in array1 that are not present in array2
    return array1.filter(post1 => !array2.some(post2 => post1.post_content === post2.post_content));
}
module.exports = postArrayDifference;

function uniqueFromArray(arr) {
    return Array.from(new Set(arr));
}
module.exports = uniqueFromArray;