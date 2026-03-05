// Problem: Minimum Changes To Make Alternating Binary String
// Link: https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string/
//
// Approach:
// An alternating binary string can only have two forms:
// 1. Starts with '0': "010101..."
// 2. Starts with '1': "101010..."
//
// We can iterate through the input string `s` and count the number of characters that
// do not match the expected character for each of these two alternating patterns.
//
// For the pattern starting with '0' (e.g., "010101..."):
// At even indices (0, 2, 4, ...), the character should be '0'.
// At odd indices (1, 3, 5, ...), the character should be '1'.
// We count how many characters in `s` deviate from this pattern. Let this be `changesForZeroStart`.
//
// For the pattern starting with '1' (e.g., "101010..."):
// At even indices (0, 2, 4, ...), the character should be '1'.
// At odd indices (1, 3, 5, ...), the character should be '0'.
// We count how many characters in `s` deviate from this pattern. Let this be `changesForOneStart`.
//
// The minimum number of operations will be the minimum of `changesForZeroStart` and `changesForOneStart`.
//
// Time Complexity: O(n), where n is the length of the string `s`. We iterate through the string once.
// Space Complexity: O(1). We only use a few variables to store counts.

/**
 * @param {string} s
 * @return {number}
 */
const minChanges = (s) => {
    // Initialize counts for deviations from two possible alternating patterns.
    // changesForZeroStart: counts deviations if the target string starts with '0' (e.g., "0101...")
    // changesForOneStart: counts deviations if the target string starts with '1' (e.g., "1010...")
    let changesForZeroStart = 0;
    let changesForOneStart = 0;

    // Iterate through the input string `s` using its index `i`.
    for (let i = 0; i < s.length; i++) {
        // Check for the pattern starting with '0'.
        // If the index `i` is even, the expected character is '0'.
        // If the index `i` is odd, the expected character is '1'.
        if (i % 2 === 0) {
            // At an even index, if the character is '1', it deviates from the '0' start pattern.
            if (s[i] === '1') {
                changesForZeroStart++;
            }
        } else {
            // At an odd index, if the character is '0', it deviates from the '0' start pattern.
            if (s[i] === '0') {
                changesForZeroStart++;
            }
        }

        // Check for the pattern starting with '1'.
        // If the index `i` is even, the expected character is '1'.
        // If the index `i` is odd, the expected character is '0'.
        if (i % 2 === 0) {
            // At an even index, if the character is '0', it deviates from the '1' start pattern.
            if (s[i] === '0') {
                changesForOneStart++;
            }
        } else {
            // At an odd index, if the character is '1', it deviates from the '1' start pattern.
            if (s[i] === '1') {
                changesForOneStart++;
            }
        }
    }

    // The minimum number of operations is the smaller of the two deviation counts.
    return Math.min(changesForZeroStart, changesForOneStart);
};
```