// Problem: Reverse Degree of a String
// Link: https://leetcode.com/problems/reverse-degree-of-a-string/
// Approach:
// The problem asks us to calculate a "reverse degree" for a given string.
// This degree is the sum of products, where each product is formed by:
// 1. The character's position in the reversed alphabet (e.g., 'a' is 26, 'b' is 25, ..., 'z' is 1).
// 2. The character's 1-indexed position within the string.
//
// To implement this, we can iterate through the input string `s`. For each character:
// - We need to find its value in the reversed alphabet. This can be calculated as `26 - (character - 'a')`.
// - We need its 1-indexed position in the string. If we use a 0-indexed loop, this will be `index + 1`.
// - We then multiply these two values and add them to a running total.
//
// Time Complexity: O(N), where N is the length of the string `s`.
// We iterate through the string once to calculate the reverse degree.
// Space Complexity: O(1), as we only use a few variables to store the sum and intermediate calculations,
// regardless of the input string's length.

#include <string>
#include <iostream>
#include <vector>

class Solution {
public:
    int reverseDegree(std::string s) {
        int totalReverseDegree = 0; // Initialize the total reverse degree to 0

        // Iterate through each character of the string
        for (int i = 0; i < s.length(); ++i) {
            // Get the current character
            char currentChar = s[i];

            // Calculate the position of the character in the reversed alphabet
            // 'a' -> 26, 'b' -> 25, ..., 'z' -> 1
            // The formula is 26 - (currentChar - 'a')
            int reversedAlphabetPosition = 26 - (currentChar - 'a');

            // Calculate the 1-indexed position of the character in the string
            // The loop index `i` is 0-indexed, so we add 1 for the 1-indexed position.
            int stringPosition = i + 1;

            // Calculate the product of the two positions
            int product = reversedAlphabetPosition * stringPosition;

            // Add the product to the total reverse degree
            totalReverseDegree += product;
        }

        // Return the calculated total reverse degree
        return totalReverseDegree;
    }
};

// int main() {
//     // Example 1:
//     std::string s1 = "abc";
//     Solution sol;
//     int result1 = sol.reverseDegree(s1);
//     std::cout << "Input: \"" << s1 << "\", Output: " << result1 << std::endl; // Expected: 148

//     // Example 2:
//     std::string s2 = "zaza";
//     int result2 = sol.reverseDegree(s2);
//     std::cout << "Input: \"" << s2 << "\", Output: " << result2 << std::endl; // Expected: 160

//     return 0;
// }
