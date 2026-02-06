```java
import java.util.Arrays;

/**
 * Problem: Minimum Removals to Balance Array
 * Link: https://leetcode.com/problems/minimum-removals-to-balance-array/
 *
 * Problem Summary: Given an array and an integer k, find the minimum number of elements to remove
 * so that the maximum element in the remaining array is at most k times the minimum element.
 *
 * Approach:
 * The problem asks for the minimum number of removals, which is equivalent to maximizing the number of elements
 * that can be kept to form a balanced array.
 *
 * A balanced array has `max_element <= min_element * k`.
 * If we sort the array, any contiguous subarray `nums[i...j]` will have `nums[j]` as its maximum and `nums[i]`
 * as its minimum.
 * Therefore, we can sort the input array `nums` first.
 *
 * After sorting, we can iterate through all possible contiguous subarrays and check if they are balanced.
 * A subarray `nums[i...j]` is balanced if `nums[j] <= nums[i] * k`.
 *
 * We are looking for the longest balanced subarray. If the longest balanced subarray has length `L`,
 * then the minimum number of removals will be `nums.length - L`.
 *
 * We can use a sliding window approach. For each element `nums[i]` as a potential minimum of a balanced subarray,
 * we want to find the largest `j` such that `nums[j] <= nums[i] * k`.
 *
 * Since the array is sorted, as we increment `i`, the smallest possible minimum `nums[i]` increases or stays the same.
 * This means the maximum possible `nums[j]` (`nums[i] * k`) also increases or stays the same.
 * Therefore, the right pointer `j` will only move forward or stay in place. This is the characteristic of a
 * sliding window.
 *
 * We can use two pointers, `left` and `right`. `left` will iterate from 0 to n-1. For each `left`,
 * we expand `right` as far as possible such that `nums[right] <= nums[left] * k`.
 * The length of this balanced window is `right - left + 1`. We keep track of the maximum length found.
 *
 * Time Complexity:
 * Sorting the array takes O(N log N) time, where N is the number of elements in `nums`.
 * The sliding window part involves two pointers, `left` and `right`. Both pointers iterate through the array
 * at most once. So, the sliding window part takes O(N) time.
 * Therefore, the overall time complexity is dominated by sorting, which is O(N log N).
 *
 * Space Complexity:
 * Sorting might take O(log N) or O(N) space depending on the implementation (e.g., mergesort or quicksort).
 * The sliding window uses constant extra space for pointers.
 * Therefore, the space complexity is O(log N) or O(N) due to sorting.
 */
class Solution {
    public int minimumRemovals(int[] nums, int k) {
        // Sort the array to easily find minimum and maximum within a subarray.
        Arrays.sort(nums);

        int n = nums.length;
        // Initialize maxLen to 0, representing the maximum number of elements
        // we can keep in a balanced subarray.
        int maxLen = 0;
        // Initialize the right pointer for the sliding window.
        int right = 0;

        // Iterate through the sorted array using the left pointer.
        // Each nums[left] is considered as a potential minimum of a balanced subarray.
        for (int left = 0; left < n; left++) {
            // Expand the right pointer as long as the current element nums[right]
            // satisfies the balance condition: nums[right] <= nums[left] * k.
            // We also need to ensure that 'right' does not go out of bounds.
            while (right < n && nums[right] <= (long) nums[left] * k) { // Use long to prevent overflow
                right++;
            }
            // At this point, nums[left...right-1] is a balanced subarray.
            // The length of this balanced subarray is (right - 1) - left + 1 = right - left.
            // Update maxLen with the maximum length found so far.
            maxLen = Math.max(maxLen, right - left);
        }

        // The minimum number of removals is the total number of elements minus
        // the maximum number of elements we can keep in a balanced subarray.
        return n - maxLen;
    }
}
```