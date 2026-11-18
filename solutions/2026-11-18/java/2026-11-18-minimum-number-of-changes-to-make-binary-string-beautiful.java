```java
/**
 * Problem Summary: Given an even-length binary string, find the minimum changes to make it beautiful.
 * A beautiful string can be partitioned into substrings of even length, each containing only 0s or only 1s.
 * Link: https://leetcode.com/problems/minimum-number-of-changes-to-make-binary-string-beautiful/
 *
 * Approach:
 * The problem asks for the minimum number of changes to make a binary string "beautiful".
 * A beautiful string can be partitioned into blocks of even length, where each block is all '0's or all '1's.
 * This implies that consecutive characters in a beautiful string must be the same within each block.
 * Specifically, for any even index `i`, `s[i]` must be equal to `s[i+1]` for the string to be beautiful without any partitions.
 * If we consider partitioning, each block must have uniform characters.
 * For a string to be beautiful, it must be possible to group adjacent identical characters into blocks of even length.
 *
 * Let's consider the structure of a beautiful string. It can be formed by concatenating blocks like "00", "11", "0000", "1111", etc.
 * This means that `s[i]` should ideally be the same as `s[i+1]` if they belong to the same intended block.
 *
 * The crucial observation is that we can partition the string into blocks of length 2.
 * For example, "1001" can be thought of as pairs: "10" and "01".
 * If we want to make the string beautiful with minimum changes, we can aim to make each pair `s[i]` and `s[i+1]` identical for all even `i`.
 *
 * Consider pairs of adjacent characters `s[i]` and `s[i+1]` for `i = 0, 2, 4, ...`.
 * If `s[i]` is different from `s[i+1]`, we need to change one of them to make them identical. This costs 1 change.
 * For example, if we have "10", we can change it to "11" or "00". Both require 1 change.
 *
 * By iterating through the string with a step of 2 (i.e., checking `s[0]` vs `s[1]`, `s[2]` vs `s[3]`, etc.),
 * we can count the number of adjacent pairs that are different.
 * Each such difference requires one change to make that pair uniform (either "00" or "11").
 * This strategy ensures that we can partition the resulting string into blocks of length 2, where each block is beautiful.
 * Since the problem statement allows partitioning into *one or more* substrings of even length, and we are making every pair `s[i] == s[i+1]`,
 * the entire string can be viewed as a single beautiful string if all pairs are made identical. Alternatively, it can be partitioned into pairs of identical characters, which are themselves beautiful substrings of length 2.
 *
 * Therefore, the minimum number of changes is simply the count of indices `i` (where `i` is even) such that `s[i] != s[i+1]`.
 *
 * Time Complexity: O(n), where n is the length of the string s. We iterate through the string once.
 * Space Complexity: O(1), as we only use a few variables to store the count and loop index.
 */
class Solution {
    public int minChanges(String s) {
        // Initialize a counter for the number of changes needed.
        int changes = 0;
        // Get the length of the binary string.
        int n = s.length();

        // Iterate through the string with a step of 2.
        // We only need to check pairs of characters: (s[0], s[1]), (s[2], s[3]), and so on.
        // For the string to be beautiful, s[i] should be equal to s[i+1] for all even i.
        for (int i = 0; i < n; i += 2) {
            // If the character at index i is different from the character at index i+1,
            // we need to make one change to make them identical.
            // This makes the pair (s[i], s[i+1]) either "00" or "11".
            if (s.charAt(i) != s.charAt(i + 1)) {
                // Increment the changes counter.
                changes++;
            }
        }

        // Return the total minimum number of changes required.
        return changes;
    }
}
```