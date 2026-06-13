// Problem Summary: Calculate the weight of each word based on character weights,
// map the modulo 26 result to a character in reverse alphabetical order,
// and concatenate these characters into a result string.
// Link: https://leetcode.com/problems/weighted-word-mapping/
//
// Approach Explanation:
// We iterate through each word in the input `words` array.
// For each word, we calculate its total weight by summing the weights of its characters.
// The weight of a character is determined by its position in the `weights` array (e.g., 'a' is weights[0], 'b' is weights[1], etc.).
// After calculating the word's weight, we take it modulo 26.
// This modulo result is then mapped to a character using reverse alphabetical order.
// The mapping is as follows: 0 -> 'z', 1 -> 'y', ..., 25 -> 'a'.
// This can be achieved by calculating 'z' - (modulo_result).
// We append the mapped character to our result string.
// Finally, we return the concatenated result string.
//
// Time Complexity Analysis:
// Let N be the number of words and L be the maximum length of a word.
// Calculating the weight of each word takes O(L) time.
// We do this for N words, so the total time for weight calculation is O(N * L).
// The modulo operation and character mapping take O(1) time per word.
// Concatenating characters into the result string takes O(N) time in total (if using a string builder or similar efficient approach).
// Thus, the overall time complexity is O(N * L).
//
// Space Complexity Analysis:
// We use a string to store the result, which will have a length of N.
// Thus, the space complexity is O(N).

#include <iostream>
#include <vector>
#include <string>
#include <numeric>

class Solution {
public:
    std::string weightedWordMapping(std::vector<std::string>& words, std::vector<int>& weights) {
        std::string result = ""; // Initialize an empty string to store the mapped characters.

        // Iterate through each word in the input 'words' array.
        for (const std::string& word : words) {
            int word_weight = 0; // Initialize the weight for the current word.

            // Iterate through each character in the current word.
            for (char c : word) {
                // Calculate the index for the character in the 'weights' array.
                // 'a' corresponds to index 0, 'b' to index 1, and so on.
                int char_index = c - 'a';
                // Add the weight of the current character to the word's total weight.
                word_weight += weights[char_index];
            }

            // Calculate the remainder when the word's weight is divided by 26.
            int mapped_index = word_weight % 26;

            // Map the remainder to a character using reverse alphabetical order.
            // 0 maps to 'z', 1 to 'y', ..., 25 to 'a'.
            // This is achieved by subtracting the mapped_index from 'z'.
            char mapped_char = 'z' - mapped_index;

            // Append the mapped character to the result string.
            result += mapped_char;
        }

        // Return the concatenated string of mapped characters.
        return result;
    }
};
```