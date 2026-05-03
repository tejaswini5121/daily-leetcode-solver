// Summary: Checks if string `goal` can be obtained by repeatedly shifting `s` to the left.
// Link: https://leetcode.com/problems/rotate-string/
// Approach:
// If the lengths of `s` and `goal` are different, they cannot be rotations of each other, so return false.
// If `s` and `goal` are identical, then 0 shifts are needed, so return true.
// The core idea is that if `goal` is a rotation of `s`, then `goal` must be a substring of `s` concatenated with itself (`s + s`).
// For example, if s = "abcde", then s+s = "abcdeabcde".
// If goal = "cdeab", it is a substring of "abcdeabcde".
// If goal = "abced", it is not a substring of "abcdeabcde".
// Therefore, we can concatenate `s` with itself and check if `goal` is present as a substring.
// Time Complexity: O(N), where N is the length of the string `s`. This is due to string concatenation and the `includes` method, which in most JavaScript engines is optimized to be linear.
// Space Complexity: O(N), due to the creation of the concatenated string `s + s`.
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function(s, goal) {
    // If the lengths of the strings are different, they cannot be rotations of each other.
    if (s.length !== goal.length) {
        return false;
    }

    // If the strings are identical, no rotation is needed.
    if (s === goal) {
        return true;
    }

    // Concatenate s with itself. If goal is a rotation of s,
    // then goal must be a substring of s + s.
    // Example: s = "abcde", s + s = "abcdeabcde"
    // If goal = "cdeab", it's found in "abcdeabcde".
    // If goal = "abced", it's not found in "abcdeabcde".
    const concatenatedS = s + s;

    // Check if goal is a substring of the concatenated string.
    return concatenatedS.includes(goal);
};
