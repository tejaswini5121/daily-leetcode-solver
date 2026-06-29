// Problem: Number of Strings That Appear as Substrings in Word
// Link: https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word/
// Approach:
// Iterate through each string in the `patterns` array. For each pattern, check if it is a substring of the `word` using the `contains()` method.
// If a pattern is found as a substring, increment a counter. Finally, return the total count.
// Time Complexity: O(N * M * L), where N is the number of patterns, M is the length of the word, and L is the maximum length of a pattern.
// The `contains()` method in Java for strings can take up to O(M * L) in the worst case (though often optimized).
// Space Complexity: O(1), as we are only using a single integer counter.

class Solution {
    /**
     * Counts the number of strings in patterns that exist as a substring in word.
     *
     * @param patterns An array of strings to search for.
     * @param word     The string to search within.
     * @return The count of patterns that are substrings of word.
     */
    public int numOfStrings(String[] patterns, String word) {
        // Initialize a counter to store the number of patterns found as substrings.
        int count = 0;

        // Iterate through each pattern string in the patterns array.
        for (String pattern : patterns) {
            // Check if the current pattern string is present as a substring within the word.
            // The String.contains() method efficiently checks for substring existence.
            if (word.contains(pattern)) {
                // If the pattern is found as a substring, increment the counter.
                count++;
            }
        }

        // Return the total count of patterns that were found as substrings in the word.
        return count;
    }
}
