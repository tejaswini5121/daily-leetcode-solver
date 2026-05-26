// Problem: Count the Number of Special Characters I
// Link: https://leetcode.com/problems/count-the-number-of-special-characters-i/
//
// Approach:
// We can use two hash sets (or boolean arrays of size 26 for simplicity given the constraints)
// to keep track of lowercase and uppercase letters encountered in the string.
// We iterate through the input string `word`. For each character, we check if it's lowercase or uppercase.
// If it's lowercase, we add its corresponding character value (e.g., 'a' to 0, 'b' to 1) to the lowercase set.
// If it's uppercase, we add its corresponding character value (e.g., 'A' to 0, 'B' to 1) to the uppercase set.
// After iterating through the entire string, we iterate from 0 to 25 (representing 'a' to 'z' or 'A' to 'Z').
// For each index `i`, if both the lowercase set and the uppercase set contain the character corresponding to `i`
// (i.e., 'a' + i and 'A' + i), then this letter is special. We increment a counter for special letters.
// Finally, we return the total count of special letters.
//
// Time Complexity: O(N), where N is the length of the input string `word`.
// We iterate through the string once to populate the sets and then iterate up to 26 times (constant) to count special characters.
//
// Space Complexity: O(1), as the size of the boolean arrays used to track letters is fixed at 26,
// independent of the input string length.

#include <string>
#include <vector>
#include <cctype>

class Solution {
public:
    int numberOfSpecialChars(std::string word) {
        // Boolean arrays to track presence of lowercase and uppercase letters.
        // Index 0 corresponds to 'a'/'A', index 1 to 'b'/'B', and so on.
        std::vector<bool> lowerPresent(26, false);
        std::vector<bool> upperPresent(26, false);

        // Iterate through the input string to populate the presence arrays.
        for (char c : word) {
            if (std::islower(c)) {
                // Mark the presence of the lowercase character.
                lowerPresent[c - 'a'] = true;
            } else if (std::isupper(c)) {
                // Mark the presence of the uppercase character.
                upperPresent[c - 'A'] = true;
            }
        }

        int specialCharCount = 0;
        // Iterate through all possible letters (a-z or A-Z).
        for (int i = 0; i < 26; ++i) {
            // A letter is special if both its lowercase and uppercase forms are present.
            if (lowerPresent[i] && upperPresent[i]) {
                specialCharCount++;
            }
        }

        // Return the total count of special letters.
        return specialCharCount;
    }
};
