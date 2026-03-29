// Problem: Check if Strings Can be Made Equal With Operations I
// Link: https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-i/
// Summary: Given two strings of length 4, determine if they can be made equal by swapping characters at indices i and i+2.
//
// Approach:
// The allowed operation allows us to swap characters at indices (0, 2) and (1, 3).
// This means that the characters at even indices (0 and 2) can be swapped with each other,
// and the characters at odd indices (1 and 3) can be swapped with each other.
// Effectively, the characters at even positions can be rearranged among themselves,
// and the characters at odd positions can be rearranged among themselves.
//
// Therefore, to make two strings equal, two conditions must be met:
// 1. The set of characters at even positions in s1 must be the same as the set of characters
//    at even positions in s2.
// 2. The set of characters at odd positions in s1 must be the same as the set of characters
//    at odd positions in s2.
//
// We can check this by sorting the characters at even positions of s1 and s2, and similarly
// for odd positions. If the sorted even-indexed characters are identical and the sorted
// odd-indexed characters are identical, then the strings can be made equal.
//
// Time Complexity: O(1)
// Since the string length is fixed at 4, sorting the characters takes constant time.
//
// Space Complexity: O(1)
// We use a few variables to store characters or sorted strings, which is constant space.

#include <string>
#include <algorithm>
#include <vector>

class Solution {
public:
    bool canBeEqual(std::string s1, std::string s2) {
        // Extract characters at even indices from s1 and s2
        std::string s1_even;
        s1_even += s1[0];
        s1_even += s1[2];

        std::string s2_even;
        s2_even += s2[0];
        s2_even += s2[2];

        // Sort the even-indexed characters of s1 and s2
        std::sort(s1_even.begin(), s1_even.end());
        std::sort(s2_even.begin(), s2_even.end());

        // If the sorted even-indexed characters are not equal, strings cannot be made equal
        if (s1_even != s2_even) {
            return false;
        }

        // Extract characters at odd indices from s1 and s2
        std::string s1_odd;
        s1_odd += s1[1];
        s1_odd += s1[3];

        std::string s2_odd;
        s2_odd += s2[1];
        s2_odd += s2[3];

        // Sort the odd-indexed characters of s1 and s2
        std::sort(s1_odd.begin(), s1_odd.end());
        std::sort(s2_odd.begin(), s2_odd.end());

        // If the sorted odd-indexed characters are not equal, strings cannot be made equal
        if (s1_odd != s2_odd) {
            return false;
        }

        // If both the sorted even and odd indexed characters match, the strings can be made equal
        return true;
    }
};
