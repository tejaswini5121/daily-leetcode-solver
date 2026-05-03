// Problem: Rotate String
// Link: https://leetcode.com/problems/rotate-string/
//
// Approach:
// The core idea is that if `goal` is a rotation of `s`, then `goal` must be a
// substring of `s + s`. For example, if `s = "abcde"`, then `s + s = "abcdeabcde"`.
// Any rotation of `s` (e.g., "bcdea", "cdeab", "deabc", "eabcd", "abcde") will be
// present within `s + s`.
//
// First, we check if the lengths of `s` and `goal` are different. If they are,
// `goal` cannot be a rotation of `s`, so we return `false`.
// If the lengths are the same, we construct a new string by concatenating `s` with
// itself (`s + s`). Then, we check if `goal` is a substring of this concatenated
// string. If it is, `goal` is a rotation of `s`, and we return `true`. Otherwise,
// we return `false`.
//
// Time Complexity: O(N), where N is the length of the string `s`.
//   - String concatenation `s + s` takes O(N) time.
//   - The `find` operation (substring search) can take up to O(N) time in the
//     worst case for standard library implementations.
//
// Space Complexity: O(N), where N is the length of the string `s`.
//   - We create a new string `s + s` which has a length of 2N, thus O(N) space.
//
#include <string>
#include <iostream>

class Solution {
public:
    bool rotateString(std::string s, std::string goal) {
        // If the lengths of the two strings are different,
        // goal cannot be a rotation of s.
        if (s.length() != goal.length()) {
            return false;
        }

        // If both strings are empty, they are considered equal and thus a rotation.
        if (s.empty()) {
            return true;
        }

        // Create a concatenated string by appending s to itself.
        // If goal is a rotation of s, then goal must be a substring of s + s.
        // For example, if s = "abcde", then s + s = "abcdeabcde".
        // Any rotation like "cdeab" will be present in "abcdeabcde".
        std::string doubled_s = s + s;

        // Check if goal is a substring of doubled_s.
        // The `find` method returns std::string::npos if the substring is not found.
        if (doubled_s.find(goal) != std::string::npos) {
            // If goal is found within doubled_s, it means goal is a rotation of s.
            return true;
        } else {
            // If goal is not found, it is not a rotation of s.
            return false;
        }
    }
};
/*
// Example Usage (for testing purposes, not part of the LeetCode solution submission)
int main() {
    Solution sol;

    // Example 1
    std::string s1 = "abcde";
    std::string goal1 = "cdeab";
    bool result1 = sol.rotateString(s1, goal1); // Expected: true
    std::cout << "Input: s = \"" << s1 << "\", goal = \"" << goal1 << "\"" << std::endl;
    std::cout << "Output: " << (result1 ? "true" : "false") << std::endl << std::endl;

    // Example 2
    std::string s2 = "abcde";
    std::string goal2 = "abced";
    bool result2 = sol.rotateString(s2, goal2); // Expected: false
    std::cout << "Input: s = \"" << s2 << "\", goal = \"" << goal2 << "\"" << std::endl;
    std::cout << "Output: " << (result2 ? "true" : "false") << std::endl << std::endl;

    // Additional Test Case: Same string
    std::string s3 = "abc";
    std::string goal3 = "abc";
    bool result3 = sol.rotateString(s3, goal3); // Expected: true
    std::cout << "Input: s = \"" << s3 << "\", goal = \"" << goal3 << "\"" << std::endl;
    std::cout << "Output: " << (result3 ? "true" : "false") << std::endl << std::endl;

    // Additional Test Case: Different lengths
    std::string s4 = "abc";
    std::string goal4 = "abca";
    bool result4 = sol.rotateString(s4, goal4); // Expected: false
    std::cout << "Input: s = \"" << s4 << "\", goal = \"" << goal4 << "\"" << std::endl;
    std::cout << "Output: " << (result4 ? "true" : "false") << std::endl << std::endl;

    // Additional Test Case: Empty strings
    std::string s5 = "";
    std::string goal5 = "";
    bool result5 = sol.rotateString(s5, goal5); // Expected: true
    std::cout << "Input: s = \"" << s5 << "\", goal = \"" << goal5 << "\"" << std::endl;
    std::cout << "Output: " << (result5 ? "true" : "false") << std::endl << std::endl;

    return 0;
}
*/
