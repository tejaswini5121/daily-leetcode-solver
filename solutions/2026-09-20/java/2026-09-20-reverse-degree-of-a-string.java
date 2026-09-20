// Problem: Reverse Degree of a String
// Link: https://leetcode.com/problems/reverse-degree-of-a-string/
//
// Approach:
// We need to iterate through the input string `s`. For each character, we calculate its contribution to the reverse degree.
// The contribution of a character is the product of two values:
// 1. Its position in the reversed alphabet: 'a' is 26, 'b' is 25, ..., 'z' is 1. This can be calculated as 26 - (character - 'a').
// 2. Its position in the string (1-indexed): This is simply the index of the character + 1.
// We sum up these products for all characters to get the final reverse degree.
//
// Time Complexity: O(N), where N is the length of the string `s`. We iterate through the string once.
// Space Complexity: O(1), as we only use a few variables to store the sum and intermediate calculations.
class Solution {
    public int reverseDegree(String s) {
        int reverseDegree = 0; // Initialize the total reverse degree

        // Iterate through the string `s`
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i); // Get the current character

            // Calculate the position in the reversed alphabet.
            // 'a' corresponds to 26, 'b' to 25, ..., 'z' to 1.
            // The formula is 26 - (difference between current char and 'a').
            int reversedAlphabetPosition = 26 - (currentChar - 'a');

            // Calculate the position in the string (1-indexed).
            // The loop index `i` is 0-indexed, so we add 1.
            int stringPosition = i + 1;

            // Calculate the product of the two positions
            int product = reversedAlphabetPosition * stringPosition;

            // Add the product to the total reverse degree
            reverseDegree += product;
        }

        // Return the calculated reverse degree
        return reverseDegree;
    }
}
