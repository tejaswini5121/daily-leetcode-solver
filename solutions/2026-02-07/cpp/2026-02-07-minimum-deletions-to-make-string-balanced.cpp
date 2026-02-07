```cpp
// Problem: Minimum Deletions to Make String Balanced
// Link: https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/
//
// Approach:
// This problem can be solved using dynamic programming. We can iterate through the string
// and maintain two counts:
// 1. `b_count`: the number of 'b' characters encountered so far.
// 2. `deletions`: the minimum number of deletions required to make the prefix of the
//    string balanced.
//
// For each character `s[i]`:
// - If `s[i]` is 'a':
//   - We have two options to maintain balance for the prefix ending at `i`:
//     a) Delete this 'a'. The number of deletions would be `deletions + 1`.
//     b) Keep this 'a'. This 'a' must come after all 'b's. The number of 'b's
//        before it is `b_count`. So, the deletions needed in this case would be
//        `b_count`.
//   - We choose the minimum of these two options for the new `deletions` count.
//   - `deletions = min(deletions + 1, b_count)`
// - If `s[i]` is 'b':
//   - We can either keep this 'b' or delete it.
//     a) Keep this 'b': The current `deletions` count is still valid for the prefix.
//     b) Delete this 'b': The number of deletions increases by 1.
//   - If we keep this 'b', we increment `b_count`.
//   - If we delete this 'b', the `deletions` count might increase. However, the
//     current `deletions` represents the minimum to balance up to the previous
//     character. If we encounter a 'b', we don't need to delete it *yet* to
//     balance the prefix. The decision to delete a 'b' is only made when we
//     encounter an 'a' that comes *after* a 'b'.
//   - So, when we see a 'b', we simply increment `b_count`. The current `deletions`
//     value already reflects the minimum deletions to balance the prefix ending
//     before this 'b'.
//   - `b_count++`
//
// The final `deletions` value after iterating through the entire string will be the
// minimum number of deletions required to make the whole string balanced.
//
// Time Complexity: O(n), where n is the length of the string s. We iterate through
//                  the string once.
// Space Complexity: O(1), as we only use a few constant extra variables.
//
#include <string>
#include <algorithm>
#include <vector>

class Solution {
public:
    int minimumDeletions(std::string s) {
        // Initialize `b_count` to 0. This will store the count of 'b' characters
        // encountered so far.
        int b_count = 0;

        // Initialize `deletions` to 0. This will store the minimum number of
        // deletions required to make the prefix balanced.
        int deletions = 0;

        // Iterate through each character in the input string `s`.
        for (char c : s) {
            // If the current character is 'a':
            if (c == 'a') {
                // We have two choices to maintain a balanced string up to this point:
                // 1. Delete this 'a'. The number of deletions will be `deletions + 1`
                //    (the current minimum deletions plus this one).
                // 2. Keep this 'a'. This 'a' must come after all preceding 'b's.
                //    The number of 'b's preceding it is `b_count`. So, we would
                //    need to delete all `b_count` 'b's to keep this 'a' balanced.
                // We take the minimum of these two options.
                deletions = std::min(deletions + 1, b_count);
            } else { // If the current character is 'b':
                // If we encounter a 'b', we simply increment the count of 'b's seen so far.
                // The current `deletions` count is already the minimum required to balance
                // the prefix up to the previous character. We don't need to do anything
                // with `deletions` at this point for a 'b'. The decision to delete 'b's
                // is implicitly handled when we encounter an 'a'.
                b_count++;
            }
        }

        // After iterating through the entire string, `deletions` will hold the
        // minimum number of deletions required to make the string balanced.
        return deletions;
    }
};
```