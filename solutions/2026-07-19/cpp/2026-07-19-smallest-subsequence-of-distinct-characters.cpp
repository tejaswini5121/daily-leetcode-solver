// Problem Summary:
// Given a string s, find the lexicographically smallest subsequence that contains all distinct characters of s exactly once.
//
// Problem Link:
// https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/
//
// Approach Explanation:
// This problem is solved using a greedy approach with a monotonic stack.
// We iterate through the input string `s` character by character. We maintain a result string (acting as a stack) `res` which will store the characters of our candidate subsequence.
// To ensure the lexicographical smallest property and distinct characters:
// 1. We first pre-compute the last occurrence index for each character in `s`. This helps us decide if a character currently in our `res` stack can be safely removed (popped) because it will appear again later in `s`.
// 2. For each character `s[i]` in the input string:
//    a. If `s[i]` is already in our `res` stack, we skip it because we only need distinct characters.
//    b. If `s[i]` is not in `res`, we compare it with the character at the top of `res` (`res.back()`):
//       - While `res` is not empty, `s[i]` is lexicographically smaller than `res.back()`, AND `res.back()` will appear again later in `s` (i.e., `i < last_occurrence[res.back() - 'a']`):
//         - We pop `res.back()` from `res` and mark it as no longer being in the stack. This is because we found a smaller character `s[i]` that can replace `res.back()` earlier, and `res.back()` can be picked up later. This removal helps make the subsequence lexicographically smaller.
//       - After the while loop, we push `s[i]` onto `res` and mark it as being in the stack.
// The final `res` string will be the lexicographically smallest subsequence of distinct characters.
//
// Time Complexity:
// O(N), where N is the length of the input string `s`.
// - Pre-calculating `last_occurrence` takes O(N).
// - The main loop iterates N times. Each character is pushed onto the `res` stack at most once and popped at most once. Stack operations (push_back/pop_back/back) are O(1).
// - Overall, the time complexity is linear with respect to the input string length.
//
// Space Complexity:
// O(1) due to the fixed size of the alphabet (26 lowercase English letters).
// - `last_occurrence` array stores 26 integers.
// - `in_stack` boolean array stores 26 booleans.
// - The `res` string (stack) stores at most 26 characters (all distinct characters).
// - All auxiliary space is constant.

#include <string>    // Required for std::string
#include <vector>    // Required for std::vector
#include <algorithm> // Not strictly necessary for this solution but often useful.

class Solution {
public:
    std::string smallestSubsequence(std::string s) {
        // last_occurrence[char_code] stores the index of the last occurrence of 'a' + char_code in s.
        // char_code is 'a' -> 0, 'b' -> 1, ..., 'z' -> 25.
        std::vector<int> last_occurrence(26, -1);
        for (int i = 0; i < s.length(); ++i) {
            last_occurrence[s[i] - 'a'] = i;
        }

        // in_stack[char_code] is true if 'a' + char_code is currently in our result string (stack).
        std::vector<bool> in_stack(26, false);

        // res will store the characters of our lexicographically smallest subsequence.
        // It acts as a stack, where push_back adds to top and pop_back removes from top.
        std::string res = "";

        for (int i = 0; i < s.length(); ++i) {
            int char_code = s[i] - 'a';

            // If the current character is already in our result subsequence, skip it.
            // We only need distinct characters, and we've already processed this one optimally.
            if (in_stack[char_code]) {
                continue;
            }

            // Greedy decision: While the stack is not empty,
            // AND the current character s[i] is lexicographically smaller than the character at the top of the stack (res.back()),
            // AND the character at the top of the stack (res.back()) appears again later in the string (meaning we can safely remove it now and pick it up later):
            // Pop the character from the stack. This helps form a lexicographically smaller subsequence.
            while (!res.empty() && s[i] < res.back() && i < last_occurrence[res.back() - 'a']) {
                in_stack[res.back() - 'a'] = false; // Mark popped character as not in stack
                res.pop_back();                     // Remove from stack
            }

            // Push the current character onto the stack.
            res.push_back(s[i]);
            in_stack[char_code] = true; // Mark current character as being in stack
        }

        return res;
    }
};