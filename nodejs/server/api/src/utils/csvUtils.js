const fs = require('fs');

/**
 * Appends an item to a CSV file.
 * @param {string} csvFilePath - The path to the CSV file.
 * @param {Array<string>} row - The row to append as an array of strings.
 */
function appendToCsv(csvFilePath, row) {
    // Convert the row array to a CSV string
    const csvRow = row.join(',') + '\n';

    // Append the CSV string to the file
    fs.appendFile(csvFilePath, csvRow, (err) => {
        if (err) {
            console.error('Error appending to CSV file:', err);
        } else {
            console.log('Row appended successfully.');
        }
    });
}

module.exports = { appendToCsv };
