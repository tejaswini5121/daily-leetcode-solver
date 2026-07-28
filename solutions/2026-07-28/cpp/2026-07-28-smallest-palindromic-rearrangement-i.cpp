// Problem: Smallest Palindromic Rearrangement I
// Link: https://leetcode.com/problems/smallest-palindromic-rearrangement-i/
//
// Approach:
// The problem asks for the lexicographically smallest palindromic rearrangement of a given palindromic string.
// Since the input string is already a palindrome, it means that for every character, its count must be even,
// except for at most one character which can have an odd count (this is the middle character of the palindrome).
//
// To achieve the lexicographically smallest palindrome, we should try to place the smallest characters at the
// beginning and end of the rearranged string.
//
// 1. Count the frequency of each character in the input string `s`.
// 2. Identify the character that has an odd count (if any). This will be the middle character of our palindrome.
// 3. For all characters with even counts, we'll use half of their occurrences to build the first half of the palindrome
//    and the other half to build the second half. To make it lexicographically smallest, we iterate through
//    characters from 'a' to 'z' and append half of their counts to the first half.
// 4. Construct the first half of the palindrome by appending `count[c] / 2` copies of character `c` for `c` from 'a' to 'z'.
// 5. Construct the second half of the palindrome by reversing the first half.
// 6. The final palindrome will be `first_half + middle_character + second_half`. If there's no middle character
//    (all counts are even), the final palindrome is `first_half + second_half`.
//
// Time Complexity:
// O(N + A), where N is the length of the string `s` and A is the size of the alphabet (26 for lowercase English letters).
// Counting character frequencies takes O(N). Iterating through the alphabet to build the first half takes O(A).
// Reversing the first half takes O(N/2) which is O(N). String concatenation can be up to O(N).
// Overall, the dominant factor is O(N).
//
// Space Complexity:
// O(N) for storing the characters of the rearranged string and O(A) for the frequency map.
// In the worst case, N can be up to 10^5, so O(N) space is used.

#include <string>
#include <vector>
#include <algorithm>
#include <map>

class Solution {
public:
    std::string smallestPalindrome(std::string s) {
        // Frequency map to store the count of each character.
        // Using a vector of size 26 for lowercase English letters is more efficient than std::map.
        std::vector<int> counts(26, 0);

        // Count the frequency of each character in the input string.
        for (char c : s) {
            counts[c - 'a']++;
        }

        std::string first_half = "";
        std::string middle_char = "";

        // Build the first half of the palindrome and identify the middle character.
        for (int i = 0; i < 26; ++i) {
            char current_char = 'a' + i;

            // If the count of a character is odd, it must be the middle character.
            // Since the input is guaranteed to be a palindrome, there can be at most one such character.
            if (counts[i] % 2 == 1) {
                middle_char = current_char;
                // Decrement count by 1 because one instance will be used for the middle.
                counts[i]--;
            }

            // Append half of the remaining occurrences of the current character to the first half.
            // We iterate through characters in lexicographical order ('a' to 'z'),
            // ensuring the first half is lexicographically smallest.
            first_half += std::string(counts[i] / 2, current_char);
        }

        // The second half of the palindrome is the reverse of the first half.
        std::string second_half = first_half;
        std::reverse(second_half.begin(), second_half.end());

        // Construct the final smallest palindromic rearrangement.
        return first_half + middle_char + second_half;
    }
};
