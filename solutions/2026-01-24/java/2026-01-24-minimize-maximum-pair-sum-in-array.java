// Problem: Minimize Maximum Pair Sum in Array
// Link: https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/
//
// Summary: Given an array of even length, pair up elements to minimize the largest sum among all pairs.
//
// Approach:
// The key idea to minimize the maximum pair sum is to pair the smallest element with the largest element,
// the second smallest with the second largest, and so on. This greedy approach ensures that the sums of
// the pairs are as balanced as possible, thus minimizing the maximum sum.
//
// Steps:
// 1. Sort the input array `nums` in ascending order.
// 2. Initialize two pointers: `left` at the beginning of the array (index 0) and `right` at the end of the array (index n-1).
// 3. Initialize a variable `maxPairSum` to store the maximum pair sum found so far, initialized to 0.
// 4. Iterate while `left` is less than `right`:
//    a. Form a pair using `nums[left]` and `nums[right]`.
//    b. Calculate the current pair sum: `currentSum = nums[left] + nums[right]`.
//    c. Update `maxPairSum` if `currentSum` is greater than `maxPairSum`: `maxPairSum = Math.max(maxPairSum, currentSum)`.
//    d. Move the `left` pointer one step to the right: `left++`.
//    e. Move the `right` pointer one step to the left: `right--`.
// 5. After the loop finishes, `maxPairSum` will hold the minimized maximum pair sum. Return `maxPairSum`.
//
// Time Complexity Analysis:
// The dominant operation is sorting the array, which takes O(n log n) time, where n is the length of the array.
// The two-pointer traversal takes O(n) time.
// Therefore, the overall time complexity is O(n log n).
//
// Space Complexity Analysis:
// The space complexity depends on the sorting algorithm used by `Arrays.sort()`.
// In Java, `Arrays.sort()` for primitive types uses a dual-pivot quicksort algorithm, which has an average
// time complexity of O(log n) for the recursion stack. In the worst case, it can be O(n).
// However, if we consider the in-place sorting, the auxiliary space is typically O(log n) on average.
// If we were to use a different sorting algorithm that requires extra space (like merge sort), it would be O(n).
// For this problem, assuming standard library sort, space complexity is O(log n) on average.

import java.util.Arrays;

class Solution {
    /**
     * Given an array nums of even length n, pair up the elements of nums into n / 2 pairs
     * such that the maximum pair sum is minimized.
     *
     * @param nums The input array of integers.
     * @return The minimized maximum pair sum.
     */
    public int minPairSum(int[] nums) {
        // Sort the array in ascending order.
        // This is crucial for the greedy approach: pairing the smallest with the largest.
        Arrays.sort(nums);

        // Initialize pointers for the left and right ends of the sorted array.
        int left = 0;
        int right = nums.length - 1;

        // Initialize a variable to keep track of the maximum pair sum found so far.
        // We will update this as we form pairs.
        int maxPairSum = 0;

        // Iterate through the array using the two pointers.
        // The loop continues as long as the left pointer is to the left of the right pointer.
        while (left < right) {
            // Form a pair using the element at the left pointer and the element at the right pointer.
            // By pairing the smallest available with the largest available, we aim to minimize the maximum sum.
            int currentPairSum = nums[left] + nums[right];

            // Update the maximum pair sum if the current pair sum is greater.
            // This ensures `maxPairSum` always holds the largest sum encountered.
            maxPairSum = Math.max(maxPairSum, currentPairSum);

            // Move the left pointer one step to the right, considering the next smallest element.
            left++;
            // Move the right pointer one step to the left, considering the next largest element.
            right--;
        }

        // After the loop, `maxPairSum` will hold the minimized maximum pair sum.
        return maxPairSum;
    }
}
