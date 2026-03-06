```java
// Problem: Check if Binary String Has at Most One Segment of Ones
// Link: https://leetcode.com/problems/check-if-binary-string-has-at-most-one-segment-of-ones/
//
// Approach:
// The problem states that the binary string `s` does not have leading zeros,
// which means `s[0]` is always '1'. We need to check if there's at most one
// contiguous segment of ones. This means we should not encounter a '1' after
// we have already seen a '0' that was preceded by a '1'.
//
// We can iterate through the string and keep track of whether we are currently
// inside a segment of ones. A simple way to detect multiple segments of ones
// is to look for the pattern "101". If we find this pattern, it means there
// are at least two separate segments of ones separated by a zero.
//
// We can use a flag to indicate if we have encountered a '0' after a '1'.
// If we see a '1' and the flag is already set (meaning we've seen '1' then '0'),
// then we have found a second segment of ones, and we can return false.
//
// Alternatively, a more straightforward approach is to check if there is any
// occurrence of "101" in the string. If there is, it means there are two
// distinct segments of ones. If there is no "101", then all ones must be
// contiguous or there's only one segment (since s[0] is '1').
//
// Time Complexity: O(n), where n is the length of the string `s`. We iterate
// through the string once to check for the pattern or to track the state.
// The `indexOf` method in Java for strings also takes O(n) in the worst case.
//
// Space Complexity: O(1), as we are only using a few variables to store state.

class Solution {
    /**
     * Checks if a binary string contains at most one contiguous segment of ones.
     *
     * @param s The input binary string.
     * @return True if there is at most one segment of ones, false otherwise.
     */
    public boolean checkOnesSegment(String s) {
        // The problem guarantees s[0] is '1', so there's at least one segment of ones.
        // We need to check if there is MORE than one segment.
        // This can be detected by looking for the pattern "101".
        // If "101" exists, it means we have a '1', then a '0', then another '1',
        // indicating two separate segments of ones.

        // The indexOf method returns the index of the first occurrence of the
        // specified substring, or -1 if the substring is not found.
        // If "101" is found, indexOf will return a non-negative value.
        // If "101" is not found, indexOf will return -1.
        return s.indexOf("101") == -1;
    }

    // Alternative implementation using a state variable for clarity,
    // though the indexOf approach is more concise.
    // public boolean checkOnesSegment(String s) {
    //     boolean seenZeroAfterOne = false;
    //     for (int i = 0; i < s.length(); i++) {
    //         char currentChar = s.charAt(i);
    //         if (currentChar == '1') {
    //             // If we see a '1' and we have already seen a '0' after a '1',
    //             // it means this '1' starts a new segment.
    //             if (seenZeroAfterOne) {
    //                 return false; // Found a second segment of ones
    //             }
    //         } else { // currentChar == '0'
    //             // If we see a '0', it means the current segment of ones (if any) has ended.
    //             // Set the flag to indicate that we have now seen a '0' after a '1'.
    //             // This flag will be used to detect if a subsequent '1' starts a new segment.
    //             seenZeroAfterOne = true;
    //         }
    //     }
    //     // If we complete the loop without returning false, it means there was at most one segment of ones.
    //     return true;
    // }
}
```