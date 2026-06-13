/**
 * @file Weighted Word Mapping LeetCode problem solution.
 * @summary Calculates the weight of each word based on character weights,
 *          maps the modulo 26 result to a character in reverse alphabetical order,
 *          and concatenates these characters to form the final string.
 * @link https://leetcode.com/problems/weighted-word-mapping/
 *
 * @approach
 * 1. Initialize an empty string `result` to store the concatenated mapped characters.
 * 2. Iterate through each `word` in the `words` array.
 * 3. For each `word`, calculate its total `wordWeight`.
 *    - Initialize `wordWeight` to 0.
 *    - Iterate through each `char` in the `word`.
 *    - Determine the index of the character in the alphabet (e.g., 'a' is 0, 'b' is 1).
 *      This can be done using `char.charCodeAt(0) - 'a'.charCodeAt(0)`.
 *    - Add the corresponding weight from the `weights` array to `wordWeight`.
 * 4. Calculate the mapped index: `mappedIndex = wordWeight % 26`.
 * 5. Convert the `mappedIndex` to its corresponding character using reverse alphabetical order.
 *    - The index for 'a' is 25, 'b' is 24, ..., 'z' is 0.
 *    - The character can be found using `String.fromCharCode('a'.charCodeAt(0) + 25 - mappedIndex)`.
 * 6. Append the mapped character to the `result` string.
 * 7. After iterating through all words, return the `result` string.
 *
 * @time_complexity
 * Let N be the number of words and L be the maximum length of a word.
 * The time complexity is O(N * L) because we iterate through each word and then through each character of that word.
 *
 * @space_complexity
 * The space complexity is O(N) in the worst case for storing the `result` string,
 * where N is the number of words. The `weights` array is of constant size (26).
 */
var weightedWordMapping = function(words, weights) {
    // Initialize an empty string to store the final mapped characters.
    let result = "";

    // Iterate through each word in the input array 'words'.
    for (const word of words) {
        // Initialize the weight for the current word to 0.
        let wordWeight = 0;

        // Iterate through each character of the current word.
        for (const char of word) {
            // Calculate the index of the character in the alphabet (0 for 'a', 1 for 'b', ..., 25 for 'z').
            const charIndex = char.charCodeAt(0) - 'a'.charCodeAt(0);
            // Add the weight of the character to the total word weight.
            wordWeight += weights[charIndex];
        }

        // Calculate the mapped index by taking the word weight modulo 26.
        const mappedIndex = wordWeight % 26;

        // Convert the mapped index to its corresponding character using reverse alphabetical order.
        // 'a' + 25 - 0 maps to 'z'
        // 'a' + 25 - 1 maps to 'y'
        // ...
        // 'a' + 25 - 25 maps to 'a'
        const mappedChar = String.fromCharCode('a'.charCodeAt(0) + 25 - mappedIndex);

        // Append the mapped character to the result string.
        result += mappedChar;
    }

    // Return the concatenated string of mapped characters.
    return result;
};
```