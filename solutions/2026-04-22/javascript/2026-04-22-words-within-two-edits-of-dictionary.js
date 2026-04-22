// Problem: Words Within Two Edits of Dictionary
// Problem Summary: Find words from `queries` that can be transformed into words in `dictionary` with at most two character edits.
// Link: https://leetcode.com/problems/words-within-two-edits-of-dictionary/
// Approach Explanation:
// The problem requires us to check each query word against every dictionary word to see if they are within two edits (differences) of each other.
// Since the constraints are relatively small (up to 100 words, each up to 100 characters), a brute-force approach will be efficient enough.
// For each query word, we iterate through all dictionary words. For each pair, we calculate the number of differing characters (Hamming distance for strings of equal length).
// If the number of differences is less than or equal to 2, we consider the query word a match and add it to our result list.
//
// Time Complexity Analysis:
// Let Q be the number of words in `queries`, D be the number of words in `dictionary`, and N be the length of each word.
// For each of the Q query words, we iterate through all D dictionary words.
// For each pair of words, we compare them character by character, which takes O(N) time.
// Therefore, the total time complexity is O(Q * D * N).
// Given the constraints (Q, D <= 100, N <= 100), the maximum operations would be around 100 * 100 * 100 = 1,000,000, which is well within typical time limits.
//
// Space Complexity Analysis:
// The space complexity is dominated by the storage required for the result list. In the worst case, all query words might match.
// Therefore, the space complexity is O(Q), where Q is the number of query words.
// If we consider the input storage, it would be O(Q*N + D*N), but we usually refer to auxiliary space complexity.

/**
 * @param {string[]} queries
 * @param {string[]} dictionary
 * @return {string[]}
 */
var twoEditWords = function(queries, dictionary) {
    // This array will store the queries that match the criteria.
    const result = [];

    // Iterate through each word in the queries array.
    for (const queryWord of queries) {
        // Flag to check if the current queryWord has found a match in the dictionary.
        let foundMatch = false;

        // Iterate through each word in the dictionary array.
        for (const dictWord of dictionary) {
            // Calculate the number of differing characters between queryWord and dictWord.
            let diffCount = 0;
            // All words have the same length, so we can iterate up to that length.
            for (let i = 0; i < queryWord.length; i++) {
                // If characters at the same position are different, increment the difference count.
                if (queryWord[i] !== dictWord[i]) {
                    diffCount++;
                }
            }

            // If the number of differences is 2 or less, this queryWord is a match.
            if (diffCount <= 2) {
                // Mark that a match has been found for this queryWord.
                foundMatch = true;
                // Since we only need to know *if* it matches *any* dictionary word,
                // we can break out of the inner loop once a match is found.
                break;
            }
        }

        // If a match was found for the current queryWord, add it to the result list.
        if (foundMatch) {
            result.push(queryWord);
        }
    }

    // Return the list of query words that matched with at most two edits.
    return result;
};
```