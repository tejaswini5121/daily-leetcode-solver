// Summary: Checks if an array can be divided into three segments: strictly increasing, strictly decreasing, and strictly increasing.
// Link: https://leetcode.com/problems/trionic-array-i/
// Approach:
// The problem requires us to find two indices p and q such that 0 < p < q < n-1, and the array segments nums[0...p], nums[p...q], and nums[q...n-1] satisfy the given increasing/decreasing conditions.
// We can iterate through all possible pairs of (p, q) that satisfy the index constraints.
// For each pair (p, q), we check if:
// 1. The subarray from index 0 to p is strictly increasing.
// 2. The subarray from index p to q is strictly decreasing.
// 3. The subarray from index q to n-1 is strictly increasing.
// If all three conditions are met for any pair (p, q), we return true.
// If no such pair is found after checking all possibilities, we return false.
//
// Time Complexity: O(n^3) - We have nested loops for p and q (O(n^2) pairs). For each pair, we iterate through the segments to check the increasing/decreasing property, which takes O(n) time in the worst case.
// Space Complexity: O(1) - We only use a few variables to keep track of indices and loop counters.
class Solution {
    public boolean isTrionic(int[] nums) {
        int n = nums.length;

        // Iterate through all possible values of p.
        // p must be greater than 0 and less than n-2 (to allow for q and the last element).
        for (int p = 1; p < n - 2; p++) {
            // Iterate through all possible values of q.
            // q must be greater than p and less than n-1 (to allow for the last increasing segment).
            for (int q = p + 1; q < n - 1; q++) {

                // Check if the first segment (nums[0...p]) is strictly increasing.
                boolean firstSegmentIncreasing = true;
                for (int i = 0; i < p; i++) {
                    if (nums[i] >= nums[i + 1]) {
                        firstSegmentIncreasing = false;
                        break;
                    }
                }

                // If the first segment is not increasing, continue to the next pair of (p, q).
                if (!firstSegmentIncreasing) {
                    continue;
                }

                // Check if the second segment (nums[p...q]) is strictly decreasing.
                boolean secondSegmentDecreasing = true;
                for (int i = p; i < q; i++) {
                    if (nums[i] <= nums[i + 1]) {
                        secondSegmentDecreasing = false;
                        break;
                    }
                }

                // If the second segment is not decreasing, continue to the next pair of (p, q).
                if (!secondSegmentDecreasing) {
                    continue;
                }

                // Check if the third segment (nums[q...n-1]) is strictly increasing.
                boolean thirdSegmentIncreasing = true;
                for (int i = q; i < n - 1; i++) {
                    if (nums[i] >= nums[i + 1]) {
                        thirdSegmentIncreasing = false;
                        break;
                    }
                }

                // If all three segments satisfy the conditions, return true.
                if (thirdSegmentIncreasing) {
                    return true;
                }
            }
        }

        // If no such pair of (p, q) is found after checking all possibilities, return false.
        return false;
    }
}
