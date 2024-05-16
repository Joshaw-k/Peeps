// Get the list of words to remove stop words from -
// These list of words or array of words is returned from the dummyData file.

/*
Process:
 - Sort posts by number of comments in descending order
 - Remove all stopwords
 - Check for hashtags
 - Return the posts with the most common words
*/

const { removeStopwords, eng, fra, heb, hin } = require("stopword");

class TrendingAlgorithm {
    // Example usage for stopWords
    // const words = ["apple", "banana", "apple", "orange", "banana", "apple"];
    // const mostCommon = mostCommonWords(words, 6);
    // console.log(mostCommon);

    trendingPostsList = [];

    constructor(postTexts) {
        // Remove all stopwords
        const nonStopWordList = this.customRemoveStopWords(postTexts);
        // Return the number of
        this.trendingPostsList.push(...this.mostCommonWords(nonStopWordList));
    }

    alltrendingPosts() {
        // console.log(this.trendingPostsList);
        return this.trendingPostsList;
    }

    customRemoveStopWords(wordsList) {
        const allWordsList = [];
        for (let eachPostText of wordsList) {
            // const oldString = 'a really Interesting string with some words'.split(' ')
            const oldString = eachPostText?.split(" ");
            const newStringList = removeStopwords(oldString, [...eng, fra, heb, hin]);
            allWordsList.push(...newStringList);
        }
        return allWordsList;
    }

    mostCommonWords(words, n = 10) {
        // Count occurrences of each word
        const wordCounts = words.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});

        // Sort words by their counts in descending order
        const sortedWords = Object.entries(wordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, n)
            .map((entry) => [entry[0], entry[1]]);

        // Return the most common words with their counts
        return sortedWords;
    }
}

// new TrendingAlgorithm().alltrendingPosts();

module.exports = TrendingAlgorithm;
