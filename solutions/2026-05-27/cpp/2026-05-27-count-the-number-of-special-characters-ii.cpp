// Count the Number of Special Characters II
// Link: https://leetcode.com/problems/count-the-number-of-special-characters-ii/
//
// Approach:
// We need to find letters that appear in both lowercase and uppercase,
// with all lowercase occurrences preceding the first uppercase occurrence.
// We can iterate through the string and for each character, check its lowercase and uppercase counterparts.
// To efficiently track the first occurrence of lowercase and uppercase letters, we can use two arrays (or maps) of size 26.
// `first_lower[i]` will store the index of the first occurrence of the i-th lowercase letter.
// `first_upper[i]` will store the index of the first occurrence of the i-th uppercase letter.
// Initialize these arrays with -1 or a value indicating not seen.
//
// Iterate through the string:
// If `word[i]` is lowercase, update `first_lower[word[i] - 'a']` if it's the first occurrence.
// If `word[i]` is uppercase, update `first_upper[word[i] - 'A']` if it's the first occurrence.
//
// After the first pass, iterate through all possible letters (a-z).
// For each letter `c` (from 'a' to 'z'):
// Get the index of its first lowercase occurrence `lower_idx = first_lower[c - 'a']`.
// Get the index of its first uppercase occurrence `upper_idx = first_upper[c - 'A']`.
//
// A letter `c` is special if:
// 1. It appears in both lowercase and uppercase (`lower_idx != -1` AND `upper_idx != -1`).
// 2. The first lowercase occurrence appears before the first uppercase occurrence (`lower_idx < upper_idx`).
//
// If both conditions are met, increment the count of special characters.
//
// Time Complexity: O(N), where N is the length of the string. We iterate through the string once to find first occurrences, and then iterate 26 times (constant) to check for special characters.
// Space Complexity: O(1), as we use two arrays of fixed size 26 regardless of the input string length.

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int numberOfSpecialChars(std::string word) {
        // Initialize arrays to store the first occurrence index of each letter.
        // Size 26 for a-z. Initialize with -1 to indicate not seen.
        std::vector<int> first_lower(26, -1);
        std::vector<int> first_upper(26, -1);

        // Iterate through the string to record the first occurrence of each lowercase and uppercase letter.
        for (int i = 0; i < word.length(); ++i) {
            char c = word[i];
            if (islower(c)) {
                // If it's a lowercase letter, record its first index if not already recorded.
                if (first_lower[c - 'a'] == -1) {
                    first_lower[c - 'a'] = i;
                }
            } else if (isupper(c)) {
                // If it's an uppercase letter, record its first index if not already recorded.
                if (first_upper[c - 'A'] == -1) {
                    first_upper[c - 'A'] = i;
                }
            }
        }

        int special_count = 0; // Counter for special characters.

        // Iterate through all 26 possible letters from 'a' to 'z'.
        for (int i = 0; i < 26; ++i) {
            // Get the index of the first lowercase occurrence and first uppercase occurrence for the current letter.
            int lower_idx = first_lower[i];
            int upper_idx = first_upper[i];

            // A character is special if:
            // 1. It appears in both lowercase and uppercase (both indices are valid, i.e., not -1).
            // 2. The first lowercase occurrence appears before the first uppercase occurrence.
            if (lower_idx != -1 && upper_idx != -1 && lower_idx < upper_idx) {
                special_count++; // Increment the count if the conditions are met.
            }
        }

        return special_count; // Return the total count of special characters.
    }
};

/*
// Example Usage (for local testing, not part of the final LeetCode submission)
int main() {
    Solution sol;
    std::cout << "Example 1: " << sol.numberOfSpecialChars("aaAbcBC") << std::endl; // Output: 3
    std::cout << "Example 2: " << sol.numberOfSpecialChars("abc") << std::endl;     // Output: 0
    std::cout << "Example 3: " << sol.numberOfSpecialChars("AbBCab") << std::endl;   // Output: 0
    std::cout << "Example 4: " << sol.numberOfSpecialChars("aBcDe") << std::endl;    // Output: 0
    std::cout << "Example 5: " << sol.numberOfSpecialChars("zZz") << std::endl;      // Output: 1
    std::cout << "Example 6: " << sol.numberOfSpecialChars("AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz") << std::endl; // Output: 26
    return 0;
}
*/
```