/**
 * @param {string} s
 * @return {boolean}
 */
// Problem: Check if a binary string has at most one contiguous segment of ones.
// Link: https://leetcode.com/problems/check-if-binary-string-has-at-most-one-segment-of-ones/
// Approach:
// We can iterate through the string and keep track of whether we are currently inside a segment of ones.
// We initialize a flag `inSegment` to false.
// When we encounter a '1':
//   If `inSegment` is already true, it means we have found a second segment of ones (or continued a single segment). This is fine.
//   If `inSegment` is false, it means we are entering a new segment of ones. We set `inSegment` to true.
// When we encounter a '0':
//   If `inSegment` is true, it means the current segment of ones has ended. We set `inSegment` to false.
//
// However, a simpler approach is to detect if we encounter a '0' followed by a '1'. This signifies the end of one segment of ones and the start of another.
// We can iterate through the string from the first character up to the second-to-last character.
// If we find a character `s[i]` that is '0' and the next character `s[i+1]` is '1', then we have more than one segment of ones, and we can immediately return false.
// If the loop completes without finding such a pattern, it means there is at most one segment of ones (or no ones at all if the string is all zeros, though the problem statement guarantees s[0] is '1').
//
// Time Complexity: O(N), where N is the length of the string, because we iterate through the string once.
// Space Complexity: O(1), because we are only using a few variables to keep track of the state.
var checkOneSegment = function(s) {
    // Iterate through the string up to the second-to-last character.
    for (let i = 0; i < s.length - 1; i++) {
        // Check if the current character is '0' and the next character is '1'.
        // This pattern indicates the end of one segment of ones and the start of a new one.
        if (s[i] === '0' && s[i + 1] === '1') {
            // If this pattern is found, it means there is more than one segment of ones.
            return false;
        }
    }
    // If the loop completes without finding the "01" pattern, it means there is at most one segment of ones.
    return true;
};
```