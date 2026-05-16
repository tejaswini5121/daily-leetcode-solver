// Problem: Find Minimum in Rotated Sorted Array II
// Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/
//
// Approach:
// This problem is a variation of finding the minimum in a rotated sorted array,
// but with the added complexity of duplicate elements. We'll use a modified binary search.
//
// The core idea of binary search is to eliminate half of the search space in each step.
// In a rotated sorted array without duplicates, we can determine which half contains
// the minimum by comparing `nums[mid]` with `nums[right]`.
//
// If `nums[mid] < nums[right]`, it means the right half (from `mid` to `right`) is sorted,
// and the minimum element must be in the left half (including `mid`). So, we set `right = mid`.
// If `nums[mid] > nums[right]`, it means the pivot (and thus the minimum) is in the right half.
// So, we set `left = mid + 1`.
//
// The challenge with duplicates arises when `nums[mid] == nums[right]`. In this scenario,
// we cannot definitively say whether the minimum is in the left or right half. For example,
// consider `[3, 1, 3, 3, 3]` or `[3, 3, 3, 1, 3]`. If `mid` points to one of the `3`s,
// and `right` also points to a `3`, we don't know which direction to go.
//
// To handle `nums[mid] == nums[right]`, we can safely decrement `right` by one.
// This is because `nums[right]` is a duplicate of `nums[mid]`, and even if `nums[right]`
// was the minimum, there's still a possibility that `nums[mid]` or elements to its left
// are also the minimum. By moving `right` inwards, we are essentially discarding one
// of the duplicate elements at the right end, which doesn't eliminate the true minimum
// if it's located elsewhere. This step is crucial for correctness when duplicates exist.
//
// The loop continues until `left == right`. At this point, `nums[left]` (or `nums[right]`)
// will be the minimum element.
//
// Time Complexity:
// In the best and average case, when there are few duplicates or the duplicates are clustered,
// the binary search effectively reduces the search space by half in most steps. This leads
// to O(log n) time complexity.
// However, in the worst case, where the array consists of all duplicate elements (e.g., `[2, 2, 2, 2, 2]`),
// the `right--` operation might be executed in almost every step. In such scenarios, the algorithm
// degrades to O(n) because we might end up iterating through most of the elements.
//
// Space Complexity:
// O(1) because we are using a constant amount of extra space for variables like `left`, `right`, and `mid`.

class Solution {
    public int findMin(int[] nums) {
        // Initialize pointers for binary search
        int left = 0;
        int right = nums.length - 1;

        // Perform binary search
        while (left < right) {
            // Calculate the middle index
            int mid = left + (right - left) / 2;

            // Case 1: nums[mid] < nums[right]
            // This means the right half of the array (from mid to right) is sorted.
            // The minimum element must be in the left half, including mid.
            // So, we move the right pointer to mid.
            if (nums[mid] < nums[right]) {
                right = mid;
            }
            // Case 2: nums[mid] > nums[right]
            // This means the pivot (and the minimum element) is in the right half of the array.
            // So, we move the left pointer to mid + 1 to search in the right half.
            else if (nums[mid] > nums[right]) {
                left = mid + 1;
            }
            // Case 3: nums[mid] == nums[right]
            // This is the tricky case due to duplicates. We cannot definitively know
            // if the minimum is to the left or right of mid.
            // However, we know that nums[right] is a duplicate and is not smaller
            // than nums[mid]. So, we can safely discard nums[right] by decrementing
            // the right pointer. This doesn't eliminate the true minimum if it exists
            // elsewhere. In the worst case (all duplicates), this could lead to O(n).
            else { // nums[mid] == nums[right]
                right--;
            }
        }

        // When the loop terminates, left == right, and this index points to the minimum element.
        return nums[left];
    }
}
