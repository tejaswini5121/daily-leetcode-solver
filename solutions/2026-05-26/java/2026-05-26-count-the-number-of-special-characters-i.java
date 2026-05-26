// Problem: Count the Number of Special Characters I
// Link: https://leetcode.com/problems/count-the-number-of-special-characters-i/
// Approach:
// We can use two sets to keep track of all lowercase and uppercase letters encountered in the string.
// Iterate through the input string `word`. For each character:
// If the character is lowercase, add it to the `lowercaseChars` set.
// If the character is uppercase, add it to the `uppercaseChars` set.
// After iterating through the entire string, iterate through the `lowercaseChars` set.
// For each lowercase character, check if its uppercase equivalent exists in the `uppercaseChars` set.
// If it does, increment a counter for special characters.
// Finally, return the counter.
// Time Complexity: O(N), where N is the length of the input string `word`.
// We iterate through the string once to populate the sets (O(N)).
// Then, we iterate through the `lowercaseChars` set, which at most has 26 elements. For each element, set lookups are O(1) on average.
// Space Complexity: O(1), because the sets `lowercaseChars` and `uppercaseChars` will store at most 26 lowercase and 26 uppercase English letters, respectively, which is a constant amount of space regardless of the input string's length.

import java.util.HashSet;
import java.util.Set;

class Solution {
    public int numberOfSpecialChars(String word) {
        // Set to store all unique lowercase characters encountered
        Set<Character> lowercaseChars = new HashSet<>();
        // Set to store all unique uppercase characters encountered
        Set<Character> uppercaseChars = new HashSet<>();

        // Iterate through each character in the input string
        for (char c : word.toCharArray()) {
            // Check if the character is lowercase
            if (Character.isLowerCase(c)) {
                // Add the lowercase character to its set
                lowercaseChars.add(c);
            } else { // The character must be uppercase
                // Add the uppercase character to its set
                uppercaseChars.add(c);
            }
        }

        // Initialize a counter for special characters
        int specialCharCount = 0;

        // Iterate through each unique lowercase character found
        for (char lowerChar : lowercaseChars) {
            // Convert the lowercase character to its uppercase equivalent
            char upperChar = Character.toUpperCase(lowerChar);
            // Check if this uppercase equivalent also exists in the set of uppercase characters
            if (uppercaseChars.contains(upperChar)) {
                // If both lowercase and uppercase versions are present, increment the count
                specialCharCount++;
            }
        }

        // Return the total number of special characters
        return specialCharCount;
    }
}
