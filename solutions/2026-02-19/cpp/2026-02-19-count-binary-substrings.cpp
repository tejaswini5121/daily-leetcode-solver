//
// Problem: Count Binary Substrings
// Link: https://leetcode.com/problems/count-binary-substrings/
//
// Approach:
// The problem asks us to count substrings where the number of '0's and '1's are equal,
// and all '0's are grouped together, and all '1's are grouped together.
// We can iterate through the string and find consecutive groups of identical characters.
// For example, in "00110011", we have groups of lengths [2, 2, 2, 2].
// When we have two adjacent groups of lengths `prev_group_len` and `current_group_len`,
// the number of valid substrings that can be formed at their boundary is `min(prev_group_len, current_group_len)`.
// This is because we can form substrings like "01", "0011", "10", "1100" etc. The number of such
// substrings is limited by the shorter of the two consecutive groups.
//
// We can maintain two variables: `prev_group_len` and `current_group_len`.
// We iterate through the string, counting the length of the current consecutive group.
// When the character changes, it signifies the end of a group. We then add `min(prev_group_len, current_group_len)`
// to our total count, update `prev_group_len` to `current_group_len`, and reset `current_group_len` to 1 for the new group.
// After the loop, we need to do one final addition for the last pair of groups.
//
// Example: s = "00110011"
// i = 0: s[0] = '0', count = 1
// i = 1: s[1] = '0', count = 2
// i = 2: s[2] = '1'. Character changed.
//        prev_group_len = 0 (initially), current_group_len = 2.
//        Add min(0, 2) = 0.
//        prev_group_len becomes 2. current_group_len resets to 1.
// i = 2: s[2] = '1', count = 1
// i = 3: s[3] = '1', count = 2
// i = 4: s[4] = '0'. Character changed.
//        prev_group_len = 2, current_group_len = 2.
//        Add min(2, 2) = 2 (for "01", "0011"). Total count = 2.
//        prev_group_len becomes 2. current_group_len resets to 1.
// i = 4: s[4] = '0', count = 1
// i = 5: s[5] = '0', count = 2
// i = 6: s[6] = '1'. Character changed.
//        prev_group_len = 2, current_group_len = 2.
//        Add min(2, 2) = 2 (for "10", "1100"). Total count = 2 + 2 = 4.
//        prev_group_len becomes 2. current_group_len resets to 1.
// i = 6: s[6] = '1', count = 1
// i = 7: s[7] = '1', count = 2
// End of loop.
// Final step: Add min(prev_group_len, current_group_len) = min(2, 2) = 2 (for "01", "0011").
// Total count = 4 + 2 = 6.
//
// Time Complexity:
// O(n), where n is the length of the string s. We iterate through the string once.
//
// Space Complexity:
// O(1), as we only use a few extra variables to store counts and lengths.
//
#include <string>
#include <algorithm> // For std::min

class Solution {
public:
    int countBinarySubstrings(std::string s) {
        // Initialize the total count of valid binary substrings.
        int count = 0;
        // Initialize the length of the previous consecutive group of characters.
        // Starts at 0 as there's no preceding group before the first character.
        int prev_group_len = 0;
        // Initialize the length of the current consecutive group of characters.
        int current_group_len = 0;

        // Iterate through the string to count consecutive groups.
        for (int i = 0; i < s.length(); ++i) {
            // Increment the length of the current consecutive group.
            current_group_len++;

            // Check if we are at the end of the string OR if the current character
            // is different from the next character. This signifies the end of a group.
            if (i + 1 == s.length() || s[i] != s[i + 1]) {
                // If we have a previous group (prev_group_len > 0), we can form
                // valid substrings at the boundary of the previous and current groups.
                // The number of such substrings is the minimum of the lengths of
                // the two adjacent groups.
                if (prev_group_len > 0) {
                    count += std::min(prev_group_len, current_group_len);
                }

                // Update the previous group's length to the current group's length.
                prev_group_len = current_group_len;
                // Reset the current group's length to 0, as a new group will start
                // from the next character (or we've reached the end of the string).
                current_group_len = 0;
            }
        }

        // Return the total count of valid binary substrings.
        return count;
    }
};
