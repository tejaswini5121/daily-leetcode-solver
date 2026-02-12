// Problem: Longest Balanced Substring I
// Link: https://leetcode.com/problems/longest-balanced-substring-i/
//
// Approach:
// The problem asks for the longest substring where all distinct characters appear an equal number of times.
// We can iterate through all possible substrings. For each substring, we can count the occurrences of each character
// and then check if all characters have the same count.
//
// To optimize the counting within a substring, we can use a frequency map (or an array of size 26 for lowercase English letters).
//
// The outer loops iterate through all possible start and end indices of a substring.
// For each substring defined by `start` and `end`, we use a frequency map `counts` to store character counts.
// We iterate through the substring from `start` to `end`, updating the `counts`.
//
// After counting characters for a substring, we check if it's balanced.
// We find the frequency of the first character encountered in the substring (if any).
// Then, we iterate through the `counts` map. If any character has a non-zero count different from the initial frequency,
// the substring is not balanced.
//
// If a substring is balanced and its length (`end - start + 1`) is greater than the current `maxLength`, we update `maxLength`.
//
// Time Complexity:
// The outer loops iterate through all possible substrings. There are O(n^2) substrings, where n is the length of the string s.
// For each substring, we iterate through its characters to build the frequency map, which takes O(k) time, where k is the length of the substring.
// Then, we iterate through the frequency map (at most 26 entries) to check for balance.
// In the worst case, k can be up to n. So, for each substring, the work is O(n).
// Therefore, the overall time complexity is O(n^3).
//
// Space Complexity:
// We use a frequency map (an array of size 26) to store character counts for each substring. This takes O(1) space as the alphabet size is constant.
// Thus, the space complexity is O(1).

/**
 * @param {string} s
 * @return {number}
 */
var longestBalancedSubstring = function(s) {
    let maxLength = 0; // Initialize the maximum length of a balanced substring found so far

    // Iterate through all possible start indices of a substring
    for (let start = 0; start < s.length; start++) {
        // Iterate through all possible end indices of a substring, starting from the current start index
        for (let end = start; end < s.length; end++) {
            // Initialize a frequency map for characters within the current substring.
            // We use an array of size 26, where index 0 corresponds to 'a', 1 to 'b', and so on.
            const counts = new Array(26).fill(0);
            let distinctChars = 0; // Counter for the number of distinct characters in the substring

            // Iterate through the characters of the current substring (from start to end)
            for (let i = start; i <= end; i++) {
                const charCode = s.charCodeAt(i) - 'a'.charCodeAt(0); // Get the index for the character
                if (counts[charCode] === 0) {
                    distinctChars++; // If it's the first time we see this character, increment distinctChars
                }
                counts[charCode]++; // Increment the count for this character
            }

            // Now, check if the current substring is balanced.
            // A substring is balanced if all distinct characters appear the same number of times.
            let isBalanced = true;
            let targetCount = -1; // The expected count for each distinct character

            // Iterate through the frequency counts
            for (let i = 0; i < 26; i++) {
                // If the character is present in the substring (count > 0)
                if (counts[i] > 0) {
                    // If this is the first distinct character we're checking, set its count as the target count.
                    if (targetCount === -1) {
                        targetCount = counts[i];
                    } else if (counts[i] !== targetCount) {
                        // If the count of this character is different from the target count, the substring is not balanced.
                        isBalanced = false;
                        break; // No need to check further for this substring
                    }
                }
            }

            // If the substring is balanced and its length is greater than the current maxLength
            if (isBalanced && targetCount !== -1) { // targetCount !== -1 ensures there was at least one character
                const currentLength = end - start + 1;
                if (currentLength > maxLength) {
                    maxLength = currentLength; // Update maxLength
                }
            }
        }
    }

    return maxLength; // Return the length of the longest balanced substring found
};
```