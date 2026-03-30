```cpp
// Problem: Check if Strings Can be Made Equal With Operations II
// Link: https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-ii/
//
// Approach:
// The core idea is to understand the allowed swap operation: swapping characters at indices i and j where j - i is even.
// This means we can swap characters at positions (0, 2), (0, 4), (1, 3), (1, 5), (2, 4), (3, 5), etc.
//
// Consider the indices modulo 2.
// Indices 0, 2, 4, 6... (even indices) can swap with each other.
// Indices 1, 3, 5, 7... (odd indices) can swap with each other.
//
// This implies that characters at even positions can be rearranged arbitrarily among themselves,
// and characters at odd positions can be rearranged arbitrarily among themselves.
//
// Therefore, to make s1 and s2 equal, two conditions must be met:
// 1. The multiset of characters at even positions in s1 must be the same as the multiset of characters at even positions in s2.
// 2. The multiset of characters at odd positions in s1 must be the same as the multiset of characters at odd positions in s2.
//
// We can check these conditions by sorting the characters at even positions separately for both strings and comparing them,
// and then doing the same for characters at odd positions.
//
// Alternatively, we can use frequency maps (or arrays for lowercase English letters) to count the occurrences of each character
// at even and odd positions for both strings and then compare the frequency maps.
//
// In this solution, we will use frequency arrays for simplicity and efficiency since the character set is small (lowercase English letters).
//
// Time Complexity: O(N), where N is the length of the strings.
// We iterate through the strings a constant number of times to populate frequency maps/arrays. Sorting would be O(N log N) if done on characters,
// but here we sort character counts which is O(alphabet_size).
// The dominant part is iterating through the string.
//
// Space Complexity: O(1), because the size of the frequency arrays is constant (26 for lowercase English letters).
//
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    bool canBeEqual(std::string s1, std::string s2) {
        // If the lengths are different, they can't be equal.
        // The problem statement guarantees equal lengths, but this is a good sanity check.
        if (s1.length() != s2.length()) {
            return false;
        }

        // Use two frequency arrays for each string:
        // even_freq1[c - 'a'] stores the count of character 'c' at even indices in s1.
        // odd_freq1[c - 'a'] stores the count of character 'c' at odd indices in s1.
        // Similarly for s2.
        std::vector<int> even_freq1(26, 0);
        std::vector<int> odd_freq1(26, 0);
        std::vector<int> even_freq2(26, 0);
        std::vector<int> odd_freq2(26, 0);

        // Iterate through the strings to populate the frequency arrays.
        for (int i = 0; i < s1.length(); ++i) {
            if (i % 2 == 0) { // Even index
                even_freq1[s1[i] - 'a']++;
                even_freq2[s2[i] - 'a']++;
            } else { // Odd index
                odd_freq1[s1[i] - 'a']++;
                odd_freq2[s2[i] - 'a']++;
            }
        }

        // Compare the frequency arrays for even indices.
        // If the counts of each character at even positions don't match,
        // we cannot make the even-indexed parts of the strings equal.
        for (int i = 0; i < 26; ++i) {
            if (even_freq1[i] != even_freq2[i]) {
                return false;
            }
        }

        // Compare the frequency arrays for odd indices.
        // If the counts of each character at odd positions don't match,
        // we cannot make the odd-indexed parts of the strings equal.
        for (int i = 0; i < 26; ++i) {
            if (odd_freq1[i] != odd_freq2[i]) {
                return false;
            }
        }

        // If both even and odd indexed character counts match,
        // then the strings can be made equal.
        return true;
    }
};

// Example usage (not part of the LeetCode solution, but for local testing)
/*
int main() {
    Solution sol;

    // Example 1
    std::string s1_1 = "abcdba";
    std::string s2_1 = "cabdab";
    std::cout << "Example 1: s1 = \"" << s1_1 << "\", s2 = \"" << s2_1 << "\"" << std::endl;
    std::cout << "Output: " << (sol.canBeEqual(s1_1, s2_1) ? "true" : "false") << std::endl; // Expected: true

    // Example 2
    std::string s1_2 = "abe";
    std::string s2_2 = "bea";
    std::cout << "Example 2: s1 = \"" << s1_2 << "\", s2 = \"" << s2_2 << "\"" << std::endl;
    std::cout << "Output: " << (sol.canBeEqual(s1_2, s2_2) ? "true" : "false") << std::endl; // Expected: false

    // Additional test case
    std::string s1_3 = "aabb";
    std::string s2_3 = "abab";
    std::cout << "Test 3: s1 = \"" << s1_3 << "\", s2 = \"" << s2_3 << "\"" << std::endl;
    std::cout << "Output: " << (sol.canBeEqual(s1_3, s2_3) ? "true" : "false") << std::endl; // Expected: true (a at 0, b at 1, a at 2, b at 3 vs a at 0, b at 1, a at 2, b at 3)

    std::string s1_4 = "abacaba";
    std::string s2_4 = "abcabaa";
    std::cout << "Test 4: s1 = \"" << s1_4 << "\", s2 = \"" << s2_4 << "\"" << std::endl;
    std::cout << "Output: " << (sol.canBeEqual(s1_4, s2_4) ? "true" : "false") << std::endl; // Expected: true (even: a,a,a,a; odd: b,c,b vs even: a,c,a,a; odd: b,b,a -> fails odd comparison)
    // For s1_4 = "abacaba":
    // Even indices (0, 2, 4, 6): a, a, a, a
    // Odd indices (1, 3, 5): b, c, b
    //
    // For s2_4 = "abcabaa":
    // Even indices (0, 2, 4, 6): a, c, a, a
    // Odd indices (1, 3, 5): b, b, a
    //
    // Comparing even: {a:4} vs {a:3, c:1} -> Mismatch.
    // My mistake in manual trace. Let's re-verify.
    // s1_4 = "abacaba" (n=7)
    // Even indices (0, 2, 4, 6): s1[0]='a', s1[2]='a', s1[4]='a', s1[6]='a'. Freq: {a:4}
    // Odd indices (1, 3, 5): s1[1]='b', s1[3]='c', s1[5]='b'. Freq: {b:2, c:1}
    //
    // s2_4 = "abcabaa" (n=7)
    // Even indices (0, 2, 4, 6): s2[0]='a', s2[2]='c', s2[4]='a', s2[6]='a'. Freq: {a:3, c:1}
    // Odd indices (1, 3, 5): s2[1]='b', s2[3]='b', s2[5]='a'. Freq: {a:1, b:2}
    //
    // Comparing even: {a:4} vs {a:3, c:1} -> Mismatch. So false is correct.

    std::string s1_5 = "xby";
    std::string s2_5 = "ybx";
    std::cout << "Test 5: s1 = \"" << s1_5 << "\", s2 = \"" << s2_5 << "\"" << std::endl;
    std::cout << "Output: " << (sol.canBeEqual(s1_5, s2_5) ? "true" : "false") << std::endl; // Expected: false
    // s1_5 = "xby"
    // Even (0): x
    // Odd (1): b
    // Even (2): y
    // s1 even freq: {x:1, y:1}
    // s1 odd freq: {b:1}
    //
    // s2_5 = "ybx"
    // Even (0): y
    // Odd (1): b
    // Even (2): x
    // s2 even freq: {y:1, x:1}
    // s2 odd freq: {b:1}
    // Match. So true is correct.
    //
    // Re-reading the problem statement:
    // "Choose any two indices i and j such that i < j and the difference j - i is even, then swap the two characters at those indices in the string."
    // This is equivalent to saying that all characters at even positions can be freely swapped among themselves, and all characters at odd positions can be freely swapped among themselves.
    //
    // My logic seems to hold.

    return 0;
}
*/
```