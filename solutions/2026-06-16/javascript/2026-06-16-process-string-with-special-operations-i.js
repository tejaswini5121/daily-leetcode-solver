/**
 * @summary Processes a string with special characters '*' (remove last), '#' (duplicate), and '%' (reverse).
 * @link https://leetcode.com/problems/process-string-with-special-operations-i/
 * @approach We iterate through the input string character by character.
 * We maintain a `result` string.
 * If the character is a lowercase letter, we append it to `result`.
 * If the character is '*', we remove the last character from `result` if `result` is not empty.
 * If the character is '#', we duplicate the current `result` by concatenating it with itself.
 * If the character is '%', we reverse the current `result`.
 * After processing all characters, we return the final `result`.
 * @timeComplexity O(N*M) where N is the length of the input string `s` and M is the maximum length of the `result` string.
 * In the worst case, for '#', we might double the string length repeatedly.
 * Reversing a string also takes time proportional to its length.
 * Since the constraints on `s.length` are small (<= 20), this complexity is acceptable.
 * @spaceComplexity O(M) where M is the maximum length of the `result` string.
 * The `result` string can grow, but the maximum length is bounded by the operations on `s`.
 */
const processSpecialCharacters = (s) => {
    // Initialize an empty string to store the result.
    let result = "";

    // Iterate through each character in the input string `s`.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // Check if the character is a lowercase English letter.
        if (char >= 'a' && char <= 'z') {
            // If it's a letter, append it to the result string.
            result += char;
        } else if (char === '*') {
            // If the character is '*', remove the last character from the result if it's not empty.
            if (result.length > 0) {
                result = result.slice(0, -1);
            }
        } else if (char === '#') {
            // If the character is '#', duplicate the current result string.
            result += result;
        } else if (char === '%') {
            // If the character is '%', reverse the current result string.
            // Convert string to array, reverse it, and join back to a string.
            result = result.split('').reverse().join('');
        }
    }

    // Return the final processed string.
    return result;
};
```