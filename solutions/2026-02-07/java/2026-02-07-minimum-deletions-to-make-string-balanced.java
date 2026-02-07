// Problem Summary: Find the minimum deletions to make a string of 'a's and 'b's balanced,
// meaning no 'b' appears before an 'a'.
// Link: https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/
//
// Approach:
// This problem can be solved using dynamic programming. We can iterate through the string and maintain two values:
// 1. The number of 'b's encountered so far that need to be deleted to maintain a balanced prefix.
// 2. The minimum deletions needed to balance the string up to the current index.
//
// Let dp[i] be the minimum deletions to make the prefix s[0...i-1] balanced.
//
// When we consider s[i]:
// If s[i] is 'a':
//   To make s[0...i] balanced, we have two options for this 'a':
//   a) Keep it: If we keep this 'a', it must appear after all 'b's that we keep. The number of deletions would be the number of 'b's encountered so far that we decided to keep, plus any deletions needed for the prefix s[0...i-1]. This is effectively the number of 'b's encountered so far.
//   b) Delete it: If we delete this 'a', the number of deletions is dp[i] (deletions for prefix s[0...i-1]) + 1 (for deleting this 'a').
//   So, dp[i+1] = min(dp[i] + 1, count_of_b_so_far)
//
// If s[i] is 'b':
//   To make s[0...i] balanced, we have two options for this 'b':
//   a) Keep it: If we keep this 'b', it must appear before any 'a's we keep. The number of deletions is simply the minimum deletions needed for the prefix s[0...i-1], which is dp[i].
//   b) Delete it: If we delete this 'b', the number of deletions is dp[i] + 1 (for deleting this 'b').
//   So, dp[i+1] = min(dp[i] + 1, dp[i]) which simplifies to dp[i+1] = dp[i].
//
// This DP approach can be optimized. We don't need a full DP array. We can maintain the count of 'b's seen so far and the current minimum deletions.
//
// Optimized Approach (Single Pass):
// We can iterate through the string and maintain two variables:
// 1. `b_count`: The number of 'b's encountered so far.
// 2. `min_deletions`: The minimum number of deletions required to make the string balanced up to the current character.
//
// For each character `c` in the string `s`:
// If `c` is 'a':
//   To balance the string up to this point, we have two choices for this 'a':
//   a) Delete this 'a': The cost would be `min_deletions + 1`.
//   b) Keep this 'a': This 'a' must come after all 'b's that we decide to keep. The number of 'b's we need to delete to ensure this 'a' is preceded only by 'a's would be `b_count`. So, the cost is `b_count`.
//   Therefore, `min_deletions` becomes `min(min_deletions + 1, b_count)`.
// If `c` is 'b':
//   We increment `b_count`. This 'b' could potentially be kept or deleted. If we keep it, we don't incur any immediate deletion cost for this specific 'b'. The minimum deletions for the prefix remains the same as it was before this 'b'. If we delete it, the cost increases by 1. Since we want the minimum, we don't update `min_deletions` based on deleting this 'b' yet; it's implicitly handled by the `b_count` when we encounter an 'a' later.
//
// The initial value of `min_deletions` should be 0, and `b_count` should be 0.
// The final answer will be the value of `min_deletions` after iterating through the entire string.
//
// Example Walkthrough: s = "aababbab"
// i=0, c='a': b_count = 0, min_deletions = min(0+1, 0) = 0
// i=1, c='a': b_count = 0, min_deletions = min(0+1, 0) = 0
// i=2, c='b': b_count = 1, min_deletions = 0
// i=3, c='a': b_count = 1, min_deletions = min(0+1, 1) = 1
// i=4, c='b': b_count = 2, min_deletions = 1
// i=5, c='b': b_count = 3, min_deletions = 1
// i=6, c='a': b_count = 3, min_deletions = min(1+1, 3) = 2
// i=7, c='b': b_count = 4, min_deletions = 2
//
// Final answer: 2
//
// Time Complexity: O(N), where N is the length of the string s. We iterate through the string once.
// Space Complexity: O(1), as we only use a few constant space variables.
//
// Alternative Approach (Prefix Sums):
// We can precompute the count of 'b's to the left of each index and the count of 'a's to the right of each index.
// For each index `i`:
// If s[i] == 'a', the number of deletions to make the string balanced by making it all 'b's up to `i` and all 'a's after `i` would be:
//   (number of 'b's before `i`) + (number of 'a's after `i`)
// We can iterate through all possible split points (where the transition from 'b' to 'a' conceptually happens) and find the minimum.
// Let `b_prefix[i]` be the count of 'b's in s[0...i-1].
// Let `a_suffix[i]` be the count of 'a's in s[i...N-1].
//
// Initialize `min_deletions = a_suffix[0]` (delete all 'a's if the string starts with 'a's).
// Iterate `i` from 0 to N-1:
//   If s[i] == 'a':
//     `deletions_at_this_split = b_prefix[i] + a_suffix[i+1]`
//     `min_deletions = min(min_deletions, deletions_at_this_split)`
//
// Time Complexity: O(N) for precomputation and O(N) for iteration, total O(N).
// Space Complexity: O(N) for prefix and suffix arrays.
//
// The optimized single-pass approach is preferred for its O(1) space complexity.

class Solution {
    /**
     * Calculates the minimum number of deletions required to make a string balanced.
     * A balanced string has no 'b' followed by an 'a'.
     *
     * @param s The input string consisting of 'a' and 'b' characters.
     * @return The minimum number of deletions.
     */
    public int minimumDeletions(String s) {
        // `b_count` tracks the number of 'b's encountered so far.
        // These 'b's are candidates for deletion if an 'a' appears later.
        int b_count = 0;

        // `min_deletions` stores the minimum deletions needed to balance the string
        // up to the current character being processed.
        // Initially, we assume no deletions are needed for an empty prefix.
        int min_deletions = 0;

        // Iterate through each character in the input string.
        for (char c : s.toCharArray()) {
            // If the current character is 'a':
            // We have two choices to make the string balanced up to this point:
            // 1. Delete this 'a': The cost is the current minimum deletions plus 1 (for deleting this 'a').
            //    `min_deletions + 1`
            // 2. Keep this 'a': This 'a' must appear after all the 'b's that we decide to keep.
            //    The number of deletions required would be the count of 'b's encountered so far (`b_count`),
            //    as all these 'b's would need to be deleted to ensure this 'a' is preceded only by 'a's.
            //    `b_count`
            // We take the minimum of these two options to update `min_deletions`.
            if (c == 'a') {
                min_deletions = Math.min(min_deletions + 1, b_count);
            }
            // If the current character is 'b':
            // We simply increment the count of 'b's. This 'b' might be deleted later
            // if an 'a' appears after it. For now, keeping it doesn't immediately
            // increase the minimum deletions needed for balancing, as it can precede 'a's.
            // The decision to delete this 'b' (or keep it and delete subsequent 'a's)
            // is implicitly handled by the `b_count` logic when an 'a' is encountered.
            else { // c == 'b'
                b_count++;
            }
        }

        // After iterating through the entire string, `min_deletions` will hold
        // the minimum number of deletions required to make the entire string balanced.
        return min_deletions;
    }
}
