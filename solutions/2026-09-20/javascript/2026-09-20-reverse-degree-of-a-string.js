/**
 * @summary Calculates the reverse degree of a string by summing products of reversed alphabet position and string position for each character.
 * @link https://leetcode.com/problems/reverse-degree-of-a-string/
 *
 * @approach
 * The problem asks us to calculate a "reverse degree" for a given string. This degree is a sum.
 * For each character in the string, we need to do two things:
 * 1. Find its "index in the reversed alphabet". The reversed alphabet assigns 'a' the value 26, 'b' the value 25, ..., and 'z' the value 1.
 *    We can achieve this by taking the character's ASCII value, subtracting the ASCII value of 'a', and then subtracting this from 26.
 *    Specifically, for a character `char`, its reversed alphabet index is `26 - (char.charCodeAt(0) - 'a'.charCodeAt(0))`.
 * 2. Find its "position in the string (1-indexed)". This is simply the index of the character in the string plus 1.
 *
 * Then, we multiply these two values for each character and sum up all these products to get the final reverse degree.
 *
 * We can iterate through the string using a loop. For each character at index `i` (0-indexed):
 * - `char = s[i]`
 * - `reversed_alphabet_index = 26 - (char.charCodeAt(0) - 'a'.charCodeAt(0))`
 * - `string_position = i + 1`
 * - `product = reversed_alphabet_index * string_position`
 * - Add `product` to a running total.
 *
 * Finally, return the total sum.
 *
 * @timeComplexity
 * The time complexity is O(N), where N is the length of the string `s`. This is because we iterate through the string once to calculate the reverse degree. Each character operation (getting char code, arithmetic) takes constant time.
 *
 * @spaceComplexity
 * The space complexity is O(1). We are only using a few variables to store the running total and intermediate calculations, which do not depend on the input string's length.
 */
function reverseDegreeOfString(s) {
    // Initialize the total reverse degree to 0.
    let totalReverseDegree = 0;

    // Iterate through the string character by character.
    // The loop variable 'i' represents the 0-indexed position of the character.
    for (let i = 0; i < s.length; i++) {
        // Get the current character.
        const char = s[i];

        // Calculate the index in the reversed alphabet.
        // 'a' should map to 26, 'b' to 25, ..., 'z' to 1.
        // The expression `char.charCodeAt(0) - 'a'.charCodeAt(0)` gives the 0-indexed position in the normal alphabet (a=0, b=1, ..., z=25).
        // Subtracting this from 26 gives us the desired reversed alphabet index.
        // For example, for 'a': 26 - (0) = 26. For 'z': 26 - (25) = 1.
        const reversedAlphabetIndex = 26 - (char.charCodeAt(0) - 'a'.charCodeAt(0));

        // Calculate the position in the string (1-indexed).
        // Since the loop index 'i' is 0-indexed, we add 1 to get the 1-indexed position.
        const stringPosition = i + 1;

        // Calculate the product of the reversed alphabet index and the string position.
        const product = reversedAlphabetIndex * stringPosition;

        // Add this product to the total reverse degree.
        totalReverseDegree += product;
    }

    // Return the calculated total reverse degree.
    return totalReverseDegree;
}
```