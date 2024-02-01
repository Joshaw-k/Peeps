const fs = require('fs');
const csv = require('csv-parser');

// Array containing Ethereum addresses
const ethereumAddresses = [
    '0x1234567890ABCDEF111111111111111111111111',
    '0x9876543210ABCDEF222222222222222222222222',
    '0xFEDCBA0987654321333333333333333333333333'
];

// Function to randomly select an Ethereum address
function getRandomEthereumAddress() {
    const randomIndex = Math.floor(Math.random() * ethereumAddresses.length);
    return ethereumAddresses[randomIndex];
}

// Usage: Call the function to get a random Ethereum address
// const randomAddress = getRandomEthereumAddress();
// console.log('Random Ethereum Address:', randomAddress);


// Function to read the CSV file and construct the desired data format
function createPostCSV(filePath) {
    const results = { post: [] };
    const postTexts = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            if (results.post.length < 10) { // Read only the first 100 lines
                const post = {
                    id: data.Id, // Assuming 'id' is a column in the CSV file
                    username: data.User.trim(),
                    address: getRandomEthereumAddress(),
                    content: {
                        message: data.Text.trim(),
                        upload: ""
                    }, // Assuming 'message' is a column in the CSV file
                    comments: [],
                    likes: [],
                    reposts: [],
                    date_posted: data.Timestamp,
                };
                results.post.push(post);
                postTexts.push(post);
            }
        })
        .on('end', () => {
            console.log(results); // Output the constructed data
        });

    return { results, postTexts };
}

// Usage: Call the function with the path to the CSV file
// const filePath = './sentimentdataset.csv';
// createPostCSV(filePath);
module.exports = createPostCSV;