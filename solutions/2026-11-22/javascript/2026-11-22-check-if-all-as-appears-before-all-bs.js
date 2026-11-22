// /**
//  * @param {string} s
//  * @return {boolean}
//  */
// Problem Summary: Check if all 'a' characters in a string appear before all 'b' characters.
// Link: https://leetcode.com/problems/check-if-all-as-appears-before-all-bs/
// Approach:
// We can iterate through the string and keep track of whether we have encountered a 'b' yet.
// If we find an 'a' after we have already seen a 'b', it means the condition is violated, and we return false.
// If we reach the end of the string without violating the condition, we return true.
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(1), as we only use a constant amount of extra space for the flag variable.
var checkString = function(s) {
    // Initialize a flag to track if we have encountered a 'b'
    let foundB = false;

    // Iterate through each character in the string
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // If the current character is 'b', set the foundB flag to true
        if (char === 'b') {
            foundB = true;
        }
        // If the current character is 'a' AND we have already found a 'b',
        // it means an 'a' appears after a 'b', which violates the condition.
        // So, return false.
        else if (char === 'a' && foundB) {
            return false;
        }
    }

    // If the loop completes without returning false, it means all 'a's appear before all 'b's.
    // This also covers cases where there are no 'a's or no 'b's.
    return true;
};
