// Problem: Count the Number of Special Characters I
// Link: https://leetcode.com/problems/count-the-number-of-special-characters-i/
//
// Approach:
// We can use two sets to store the lowercase and uppercase characters present in the string.
// Iterate through the input string `word`. For each character:
// 1. If the character is lowercase, add it to the `lowerCaseChars` set.
// 2. If the character is uppercase, add it to the `upperCaseChars` set.
// After iterating through the entire string, iterate through the `lowerCaseChars` set.
// For each lowercase character, check if its uppercase equivalent exists in the `upperCaseChars` set.
// If it does, increment a counter for special characters.
// Finally, return the counter.
//
// Time Complexity: O(N), where N is the length of the input string `word`.
// We iterate through the string once to populate the sets, and then iterate through at most 26 lowercase characters to check for special characters.
//
// Space Complexity: O(1), as the maximum size of the sets will be 26 (for lowercase and uppercase English letters).

/**
 * @param {string} word
 * @return {number}
 */
const numberOfSpecialChars = function(word) {
    // Set to store all unique lowercase characters encountered
    const lowerCaseChars = new Set();
    // Set to store all unique uppercase characters encountered
    const upperCaseChars = new Set();

    // Iterate through each character in the input string
    for (const char of word) {
        // Check if the character is lowercase
        if (char >= 'a' && char <= 'z') {
            // Add the lowercase character to the set
            lowerCaseChars.add(char);
        }
        // Check if the character is uppercase
        else if (char >= 'A' && char <= 'Z') {
            // Add the uppercase character to the set
            upperCaseChars.add(char);
        }
    }

    // Initialize a counter for special characters
    let specialCharCount = 0;

    // Iterate through each unique lowercase character found
    for (const lowerChar of lowerCaseChars) {
        // Convert the lowercase character to its uppercase equivalent
        const upperChar = lowerChar.toUpperCase();
        // Check if the uppercase equivalent is present in the set of uppercase characters
        if (upperCaseChars.has(upperChar)) {
            // If both lowercase and uppercase versions exist, increment the special character count
            specialCharCount++;
        }
    }

    // Return the total count of special characters
    return specialCharCount;
};
```