// Problem: Minimum Deletions to Make String Balanced
// Summary: Find the minimum deletions to make a string of 'a's and 'b's balanced, meaning no 'b' appears before an 'a'.
// Link: https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/
// Approach: Dynamic Programming. We can iterate through the string and for each position, consider two possibilities:
// 1. The current character is part of the 'a's that come before the 'b's.
// 2. The current character is part of the 'b's that come after the 'a's.
// We maintain two counts: `bCount` (number of 'b's encountered so far) and `minDeletions` (minimum deletions needed up to the current point).
// If the current character is 'a':
//    - Option 1 (keep as 'a'): `minDeletions` remains the same.
//    - Option 2 (delete 'a' to make it part of 'b's): `minDeletions` increases by 1.
//    We take the minimum of these two options.
// If the current character is 'b':
//    - Option 1 (keep as 'b'): `minDeletions` remains the same.
//    - Option 2 (delete 'b' to make it part of 'a's): `minDeletions` increases by the current `bCount`.
//    We take the minimum of these two options.
// This DP approach essentially calculates the minimum deletions for all possible split points between 'a's and 'b's.
//
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(1), as we only use a few variables to store counts.
/**
 * @param {string} s
 * @return {number}
 */
var minimumDeletions = function(s) {
    // Initialize `minDeletions` to 0. This will store the minimum deletions needed.
    let minDeletions = 0;
    // Initialize `bCount` to 0. This will store the count of 'b' characters encountered so far.
    let bCount = 0;

    // Iterate through each character in the string.
    for (let i = 0; i < s.length; i++) {
        // If the current character is 'b'.
        if (s[i] === 'b') {
            // Increment the count of 'b's.
            bCount++;
        } else {
            // If the current character is 'a'.
            // We have two choices:
            // 1. Delete this 'a' to potentially balance the string (cost = 1 deletion).
            // 2. Keep this 'a' and delete all previous 'b's encountered so far to balance the string (cost = `bCount` deletions).
            // We want to take the minimum of these two options.
            // `minDeletions = Math.min(minDeletions + 1, bCount);`
            // The `minDeletions + 1` represents deleting the current 'a'.
            // The `bCount` represents deleting all preceding 'b's to allow this 'a' to be part of the 'a' prefix.
            minDeletions = Math.min(minDeletions + 1, bCount);
        }
    }

    // After iterating through the entire string, `minDeletions` will hold the minimum number of deletions
    // required to make the string balanced. This is because the loop implicitly considers all possible
    // positions to split the string into 'a's followed by 'b's. For example, if the string is "aababbab":
    // i=0, s[0]='a', minDeletions = min(0+1, 0) = 0, bCount = 0
    // i=1, s[1]='a', minDeletions = min(0+1, 0) = 0, bCount = 0
    // i=2, s[2]='b', bCount = 1
    // i=3, s[3]='a', minDeletions = min(0+1, 1) = 1, bCount = 1
    // i=4, s[4]='b', bCount = 2
    // i=5, s[5]='b', bCount = 3
    // i=6, s[6]='a', minDeletions = min(1+1, 3) = 2, bCount = 3
    // i=7, s[7]='b', bCount = 4
    // Final minDeletions = 2.

    return minDeletions;
};
```