```cpp
// Problem: Minimum Number of Pushes to Type Word I
// Link: https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-i/
//
// Approach:
// The problem asks us to find the minimum number of pushes to type a given word
// where each character is distinct. We can remap keys 2-9 (which can hold up to 8 characters)
// to minimize the total pushes. To minimize the total pushes, we should assign the
// most frequent characters to keys that require fewer pushes. Since all characters
// in the input `word` are distinct, each character appears exactly once.
//
// The most efficient way to assign characters is to put as many characters as possible
// on keys that require only 1 push. There are 8 keys (2-9) that can be remapped.
// We can put up to 8 characters on these keys with 1 push each.
// The next most efficient assignment would be to put characters on keys that require
// 2 pushes. We can do this for up to 8 characters (using the 8 keys again).
// And so on.
//
// Given that the input `word` has distinct characters, we can think of it as
// assigning each character to a specific key. To minimize pushes, we should assign
// characters greedily. The first 8 characters of the word should be assigned to keys
// that require 1 push. The next 8 characters should be assigned to keys that require
// 2 pushes. The next 8 characters (if any) should be assigned to keys that require
// 3 pushes.
//
// For example, if the word has length L:
// - The first min(L, 8) characters will require 1 push each.
// - The next min(L - 8, 8) characters will require 2 pushes each.
// - The next min(L - 16, 8) characters will require 3 pushes each.
//
// We can iterate through the length of the word and calculate the contribution of
// each character to the total pushes.
//
// Time Complexity: O(N), where N is the length of the `word`. We iterate through the word once.
// Space Complexity: O(1), as we only use a few variables to store the total pushes and loop counters.
class Solution {
public:
    int minimumPushes(std::string word) {
        int n = word.length();
        int totalPushes = 0;
        // We can assign up to 8 characters to keys that require 1 push.
        // The next 8 characters to keys that require 2 pushes, and so on.
        //
        // For characters from index 0 to 7 (first 8), each requires 1 push.
        // For characters from index 8 to 15 (next 8), each requires 2 pushes.
        // For characters from index 16 to 23 (next 8), each requires 3 pushes.
        //
        // This logic can be implemented by observing the number of characters
        // that fall into each "push level".
        //
        // Level 1: First 8 characters. Contribution: 8 * 1
        // Level 2: Next 8 characters. Contribution: 8 * 2
        // Level 3: Next 8 characters. Contribution: 8 * 3
        // ... and so on.
        //
        // We can use a loop to calculate this.
        // The number of characters that fall into a certain push level `p`
        // is limited by 8 (the number of keys available for remapping)
        // and the remaining characters in the word.
        //
        // Example: word.length() = 10
        // Chars 0-7: 8 characters. Pushes = 8 * 1 = 8. Remaining chars = 10 - 8 = 2.
        // Chars 8-9: 2 characters. Pushes = 2 * 2 = 4. Remaining chars = 2 - 2 = 0.
        // Total pushes = 8 + 4 = 12.
        //
        // This can be calculated as:
        // Iterate through push levels p = 1, 2, 3, ...
        // For each level p, the number of characters assigned to this level is:
        // `numCharsAtThisLevel = min(remaining_chars, 8)`
        // `totalPushes += numCharsAtThisLevel * p`
        // `remaining_chars -= numCharsAtThisLevel`
        // Stop when `remaining_chars` is 0.

        int remainingChars = n;
        for (int pushes = 1; remainingChars > 0; ++pushes) {
            // The number of characters we can assign to the current push level.
            // It's either 8 (max characters per key) or the number of remaining characters,
            // whichever is smaller.
            int charsForThisPushLevel = std::min(remainingChars, 8);

            // Add the total pushes for this level.
            totalPushes += charsForThisPushLevel * pushes;

            // Decrease the count of remaining characters.
            remainingChars -= charsForThisPushLevel;
        }

        return totalPushes;
    }
};
```