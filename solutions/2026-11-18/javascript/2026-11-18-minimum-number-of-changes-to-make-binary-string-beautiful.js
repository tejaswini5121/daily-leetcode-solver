/**
 * @fileoverview LeetCode problem: Minimum Number of Changes to Make Binary String Beautiful
 *
 * Problem Summary:
 * Given a binary string of even length, find the minimum changes to make it beautiful.
 * A beautiful string can be partitioned into substrings of even length, where each substring is all '0's or all '1's.
 *
 * Link: https://leetcode.com/problems/minimum-number-of-changes-to-make-binary-string-beautiful/
 *
 * Approach:
 * The problem asks for the minimum number of changes to make a binary string "beautiful".
 * A beautiful string can be partitioned into substrings of even length, where each substring consists of identical characters.
 * This implies that beautiful strings must have an alternating pattern of identical characters in blocks of even length.
 * For example, "001100", "1111", "000000" are beautiful.
 *
 * Consider pairs of adjacent characters in the string. For the string to be beautiful, these pairs must be identical.
 * That is, for any even index `i`, `s[i]` must be equal to `s[i+1]`.
 * If `s[i]` is not equal to `s[i+1]`, we must make at least one change to make them equal.
 * We can change either `s[i]` or `s[i+1]` to match the other.
 * The minimum number of changes to satisfy this condition for all even indices `i` is to count how many pairs `(s[i], s[i+1])` have different characters.
 *
 * For example, if s = "1001":
 * i = 0: s[0] = '1', s[1] = '0'. They are different. We need 1 change. We can make it "11" or "00".
 * i = 2: s[2] = '0', s[3] = '1'. They are different. We need 1 change. We can make it "00" or "11".
 *
 * If we consider the string as groups of two: "10" | "01".
 * For the first group "10", to make it all '1's or all '0's, we need 1 change (e.g., to "11" or "00").
 * For the second group "01", to make it all '1's or all '0's, we need 1 change (e.g., to "00" or "11").
 *
 * The total minimum changes is the sum of changes needed for each pair of adjacent characters at even indices.
 *
 * Algorithm:
 * 1. Initialize a counter `changes` to 0.
 * 2. Iterate through the string `s` with a step of 2, starting from index 0 up to `s.length - 2`.
 * 3. In each iteration, compare `s[i]` with `s[i+1]`.
 * 4. If `s[i]` is not equal to `s[i+1]`, increment `changes` by 1.
 * 5. Return `changes`.
 *
 * Time Complexity Analysis:
 * The code iterates through the string `s` once with a step of 2.
 * For a string of length N, the loop runs approximately N/2 times.
 * Each comparison and increment operation takes constant time.
 * Therefore, the time complexity is O(N), where N is the length of the string.
 *
 * Space Complexity Analysis:
 * The algorithm uses only a single variable `changes` to store the count.
 * This variable takes constant space, regardless of the input string size.
 * Therefore, the space complexity is O(1).
 */

/**
 * @param {string} s
 * @return {number}
 */
var minChanges = function(s) {
    // Initialize a counter to store the minimum number of changes required.
    let changes = 0;

    // Iterate through the string with a step of 2.
    // We only need to consider pairs of adjacent characters (s[i] and s[i+1])
    // because a beautiful string can be partitioned into even-length substrings
    // of identical characters. This means that within each such substring,
    // all characters must be the same. For a string to be beautiful, it must be
    // possible to form groups of two identical characters.
    for (let i = 0; i < s.length; i += 2) {
        // Compare the current character with the next character.
        // If they are different, it means this pair needs at least one change
        // to make them identical (either both '0' or both '1').
        if (s[i] !== s[i+1]) {
            // Increment the changes counter if the pair is not already identical.
            changes++;
        }
    }

    // Return the total minimum number of changes required.
    return changes;
};
```