// Check if All A's Appear Before All B's
// Problem: https://leetcode.com/problems/check-if-all-as-appears-before-all-bs/
//
// Approach:
// We can iterate through the string and keep track of whether we have encountered a 'b' yet.
// If we encounter an 'a' after we have already seen a 'b', it means not all 'a's appear before all 'b's,
// so we can immediately return false. If we reach the end of the string without this condition
// being met, it means all 'a's appear before all 'b's (or there are no 'a's or no 'b's), so we return true.
//
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(1). We only use a single boolean variable.

#include <string>
#include <iostream>

class Solution {
public:
    bool checkString(std::string s) {
        // Flag to indicate if we have encountered a 'b'
        bool encounteredB = false;

        // Iterate through each character in the string
        for (char c : s) {
            // If the current character is 'b', set the flag to true
            if (c == 'b') {
                encounteredB = true;
            }
            // If the current character is 'a' AND we have already encountered a 'b',
            // it means an 'a' appears after a 'b', which violates the condition.
            else if (c == 'a' && encounteredB) {
                return false; // Condition violated
            }
        }

        // If the loop completes without returning false, it means all 'a's appear before all 'b's.
        return true;
    }
};

/*
// Example Usage (for testing purposes, not part of the final LeetCode submission)
int main() {
    Solution sol;
    std::cout << "Input: \"aaabbb\", Output: " << (sol.checkString("aaabbb") ? "true" : "false") << std::endl; // Expected: true
    std::cout << "Input: \"abab\", Output: " << (sol.checkString("abab") ? "true" : "false") << std::endl;     // Expected: false
    std::cout << "Input: \"bbb\", Output: " << (sol.checkString("bbb") ? "true" : "false") << std::endl;      // Expected: true
    std::cout << "Input: \"aaa\", Output: " << (sol.checkString("aaa") ? "true" : "false") << std::endl;      // Expected: true
    std::cout << "Input: \"b\", Output: " << (sol.checkString("b") ? "true" : "false") << std::endl;        // Expected: true
    std::cout << "Input: \"a\", Output: " << (sol.checkString("a") ? "true" : "false") << std::endl;        // Expected: true
    return 0;
}
*/
