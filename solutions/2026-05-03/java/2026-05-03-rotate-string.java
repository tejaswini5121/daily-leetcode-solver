// Problem: Rotate String
// Link: https://leetcode.com/problems/rotate-string/
//
// Approach:
// The problem asks if string `goal` can be obtained by repeatedly shifting the leftmost character of string `s` to the rightmost position.
// If `s` can be rotated to become `goal`, it means `goal` must be a substring of `s` concatenated with itself (`s + s`).
// For example, if `s = "abcde"`, then `s + s = "abcdeabcde"`.
// If `goal = "cdeab"`, then "cdeab" is indeed a substring of "abcdeabcde".
// If `goal = "abced"`, then "abced" is not a substring of "abcdeabcde".
//
// We first check if the lengths of `s` and `goal` are equal. If they are not equal, `goal` can never be formed by rotating `s`, so we return `false`.
// If the lengths are equal, we then check if `s + s` contains `goal` as a substring.
//
// Time Complexity: O(N), where N is the length of the strings.
// Concatenating `s` with itself takes O(N) time.
// Checking if `goal` is a substring of `s + s` using `contains()` typically has a time complexity of O(N * M) in the worst case (where N is length of `s+s` and M is length of `goal`), but for typical string implementations, it's closer to O(N) on average. Since `s+s` has length 2N and `goal` has length N, this operation is effectively O(N).
//
// Space Complexity: O(N), where N is the length of the strings.
// We create a new string `s + s`, which takes O(N) space.

class Solution {
    public boolean rotateString(String s, String goal) {
        // If the lengths of s and goal are different, they can never be equal after rotation.
        if (s.length() != goal.length()) {
            return false;
        }

        // If s is empty, goal must also be empty to be a rotated version.
        if (s.isEmpty()) {
            return goal.isEmpty();
        }

        // Concatenate s with itself. If goal is a rotated version of s,
        // it must be a substring of s + s.
        // For example, if s = "abcde", then s + s = "abcdeabcde".
        // If goal = "cdeab", "cdeab" is a substring of "abcdeabcde".
        String doubledS = s + s;

        // Check if goal is a substring of the doubled string.
        // The contains() method checks for substring existence.
        return doubledS.contains(goal);
    }
}
