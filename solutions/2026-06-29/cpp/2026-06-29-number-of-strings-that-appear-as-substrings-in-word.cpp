// Problem: Number of Strings That Appear as Substrings in Word
// Link: https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word/
//
// Approach:
// Iterate through each string in the `patterns` array. For each pattern, check if it exists as a substring within the `word` string.
// The `string::find()` method in C++ is used to efficiently check for substring existence. If `find()` returns a value other than `string::npos`,
// it means the pattern is present as a substring. A counter is incremented for each successful match.
//
// Time Complexity:
// Let N be the number of patterns and M be the length of the word.
// Let L be the maximum length of a pattern.
// For each pattern, `word.find(pattern)` takes approximately O(M * L) time in the worst case (though often faster in practice due to optimized string searching algorithms).
// Since we do this for N patterns, the total time complexity is O(N * M * L).
// Given the constraints (N, M, L <= 100), this is at most 100 * 100 * 100 = 1,000,000 operations, which is well within acceptable limits.
//
// Space Complexity:
// O(1) extra space, as we are only using a counter variable and not storing any additional data structures proportional to the input size.
// The space used by `std::string::find` is internal and not considered in the overall complexity for this approach.

#include <iostream>
#include <vector>
#include <string>

class Solution {
public:
    int numOfStrings(std::vector<std::string>& patterns, std::string word) {
        int count = 0; // Initialize a counter for the number of patterns found as substrings

        // Iterate through each string in the 'patterns' vector
        for (const std::string& pattern : patterns) {
            // Check if the current 'pattern' exists as a substring within 'word'
            // std::string::find() returns std::string::npos if the substring is not found.
            // Otherwise, it returns the starting index of the first occurrence.
            if (word.find(pattern) != std::string::npos) {
                count++; // Increment the counter if the pattern is found
            }
        }

        return count; // Return the total count of patterns found as substrings
    }
};

/*
// Main function for testing purposes (optional, can be removed if only submitting the Solution class)
int main() {
    Solution sol;

    // Example 1
    std::vector<std::string> patterns1 = {"a", "abc", "bc", "d"};
    std::string word1 = "abc";
    std::cout << "Example 1 Output: " << sol.numOfStrings(patterns1, word1) << std::endl; // Expected: 3

    // Example 2
    std::vector<std::string> patterns2 = {"a", "b", "c"};
    std::string word2 = "aaaaabbbbb";
    std::cout << "Example 2 Output: " << sol.numOfStrings(patterns2, word2) << std::endl; // Expected: 2

    // Example 3
    std::vector<std::string> patterns3 = {"a", "a", "a"};
    std::string word3 = "ab";
    std::cout << "Example 3 Output: " << sol.numOfStrings(patterns3, word3) << std::endl; // Expected: 3

    return 0;
}
*/
```