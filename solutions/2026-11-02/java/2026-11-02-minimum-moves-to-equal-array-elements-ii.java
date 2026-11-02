// Problem Summary: Find the minimum moves to make all elements in an array equal by incrementing or decrementing.
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/
// Approach:
// The key insight to this problem is that the optimal target value to make all elements equal to is the median of the array.
// If we choose any other target value, say 'x', and the median is 'm', then the sum of absolute differences from 'x' will be greater than or equal to the sum of absolute differences from 'm'.
// This is a property of medians: they minimize the sum of absolute deviations.
// Therefore, the algorithm is to:
// 1. Sort the input array `nums`.
// 2. Find the median element. For an array of size `n`, the median is at index `n/2` after sorting.
// 3. Calculate the sum of the absolute differences between each element and the median.
// Time Complexity: O(n log n) due to sorting the array. The subsequent sum calculation is O(n).
// Space Complexity: O(1) if sorting is done in-place, or O(log n) to O(n) depending on the sorting algorithm's space requirements (e.g., Timsort in Java uses O(n) in worst case).

import java.util.Arrays;

class Solution {
    public int minMoves2(int[] nums) {
        // Sort the array to easily find the median.
        Arrays.sort(nums);

        // The median is the element that minimizes the sum of absolute differences.
        // For an array of size n, the median is at index n/2 after sorting.
        int n = nums.length;
        int median = nums[n / 2];

        // Initialize the total number of moves required.
        int moves = 0;

        // Iterate through the array and sum the absolute differences
        // between each element and the median.
        for (int num : nums) {
            moves += Math.abs(num - median);
        }

        // Return the total minimum moves.
        return moves;
    }
}
