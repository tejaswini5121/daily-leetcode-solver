// Brief problem summary: Given a palindromic string, find its lexicographically smallest palindromic permutation.
// Link: https://leetcode.com/problems/smallest-palindromic-rearrangement-i/
// Approach:
// Since we need the lexicographically smallest palindromic rearrangement, we should try to place the smallest characters (like 'a', 'b', etc.) at the beginning and end of the string, working inwards.
// A palindrome has a symmetric structure. For any character at index `i` from the start, there's a corresponding character at index `n-1-i` from the end (where `n` is the length of the string).
// We can count the frequency of each character in the input string `s`.
// Then, we can construct the first half of the resulting palindrome by iterating through characters from 'a' to 'z'. For each character, we append half of its count to the first half.
// If there's a character with an odd count, it must be placed in the middle of the palindrome (if the string length is odd). To ensure the lexicographically smallest result, we should pick the smallest character with an odd count for the middle.
// The second half of the palindrome is the reverse of the first half.
//
// For example, if s = "babab":
// Counts: a: 2, b: 3
// First half construction:
// - 'a': count is 2. Append 2/2 = 1 'a'. First half: "a"
// - 'b': count is 3. This is odd. We need a middle character. The smallest character with an odd count is 'b'. So, 'b' will be our middle character. For the first half, we use (3-1)/2 = 1 'b'. First half: "ab"
// Middle character: 'b'
// Second half: reverse of "ab" is "ba"
// Result: "ab" + "b" + "ba" = "abbba"
//
// For example, if s = "daccad":
// Counts: a: 2, c: 2, d: 2
// First half construction:
// - 'a': count is 2. Append 2/2 = 1 'a'. First half: "a"
// - 'c': count is 2. Append 2/2 = 1 'c'. First half: "ac"
// - 'd': count is 2. Append 2/2 = 1 'd'. First half: "acd"
// No odd counts, so no middle character.
// Second half: reverse of "acd" is "dca"
// Result: "acd" + "" + "dca" = "acddca"
//
// Time complexity analysis:
// Counting character frequencies: O(N), where N is the length of the string `s`.
// Constructing the first half: O(26) for iterating through alphabet + O(N/2) for appending characters, which is O(N).
// Reversing the first half and concatenating: O(N/2) for reverse + O(N) for concatenation, which is O(N).
// Overall time complexity: O(N).
//
// Space complexity analysis:
// Storing character counts: O(26), which is O(1).
// Storing the first half of the result: O(N/2), which is O(N).
// Storing the middle character: O(1).
// Storing the final result: O(N).
// Overall space complexity: O(N).
class Solution {
    public String smallestPalindromicRearrangement(String s) {
        // Frequency array to store counts of each character 'a' through 'z'.
        // Index 0 for 'a', 1 for 'b', ..., 25 for 'z'.
        int[] counts = new int[26];

        // Count the frequency of each character in the input string.
        for (char c : s.toCharArray()) {
            counts[c - 'a']++;
        }

        StringBuilder firstHalf = new StringBuilder();
        char middleChar = '\0'; // To store the character that will be in the middle (if any).

        // Iterate through characters from 'a' to 'z' to build the first half of the palindrome.
        for (int i = 0; i < 26; i++) {
            char currentChar = (char) ('a' + i);
            int currentCount = counts[i];

            // If the count of the current character is odd, it must be the middle character.
            // Since we iterate from 'a' to 'z', the first character with an odd count will be the lexicographically smallest.
            if (currentCount % 2 != 0) {
                middleChar = currentChar;
                // For the first half, we use one less instance of this character.
                // The remaining even count will be split between the first and second halves.
                currentCount--;
            }

            // Append half of the (remaining even) count of the current character to the first half.
            // Integer division automatically handles this.
            for (int j = 0; j < currentCount / 2; j++) {
                firstHalf.append(currentChar);
            }
        }

        // Construct the second half by reversing the first half.
        StringBuilder secondHalf = new StringBuilder(firstHalf).reverse();

        // Build the final palindromic string.
        StringBuilder result = new StringBuilder();
        result.append(firstHalf); // Append the first half.
        if (middleChar != '\0') {
            result.append(middleChar); // Append the middle character if it exists.
        }
        result.append(secondHalf); // Append the reversed first half.

        return result.toString();
    }
}
