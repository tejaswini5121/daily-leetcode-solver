// Problem: Number of Strings That Appear as Substrings in Word
// Given an array of strings patterns and a string word, return the number of strings in patterns that exist as a substring in word.
// Link: https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word/
//
// Approach:
// We iterate through each string in the 'patterns' array. For each pattern, we check if it exists as a substring within the 'word' string.
// JavaScript's `includes()` method efficiently checks for substring presence.
// We maintain a counter that increments every time a pattern is found as a substring in 'word'.
// Finally, we return the total count.
//
// Time Complexity:
// Let N be the number of strings in 'patterns' and M be the length of 'word'.
// Let K be the maximum length of a string in 'patterns'.
// The `includes()` method in JavaScript can take up to O(M * K) in the worst case for each pattern check if not optimized.
// However, common implementations of string searching algorithms like KMP can achieve O(M + K) on average.
// Assuming a typical optimized `includes` implementation, checking each of the N patterns takes approximately O(M + K).
// Therefore, the overall time complexity is O(N * (M + K)).
// Given the constraints (N, M, K <= 100), this is approximately O(100 * (100 + 100)) = O(20000) operations, which is very efficient.
//
// Space Complexity:
// O(1) - We only use a constant amount of extra space for the counter variable.

/**
 * @param {string[]} patterns
 * @param {string} word
 * @return {number}
 */
var numOfStrings = function(patterns, word) {
    // Initialize a counter to store the number of patterns found as substrings.
    let count = 0;

    // Iterate through each pattern in the 'patterns' array.
    for (const pattern of patterns) {
        // Check if the current 'pattern' exists as a substring within the 'word'.
        // The `includes()` method returns true if the substring is found, and false otherwise.
        if (word.includes(pattern)) {
            // If the pattern is found, increment the counter.
            count++;
        }
    }

    // Return the total count of patterns that appeared as substrings in 'word'.
    return count;
};
```