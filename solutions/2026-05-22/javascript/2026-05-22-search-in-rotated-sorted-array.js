// Problem: Search in Rotated Sorted Array
// Link: https://leetcode.com/problems/search-in-rotated-sorted-array/
// Approach: This problem can be solved using a modified binary search.
// The key idea is to first determine which half of the array (left or right of the mid-point) is sorted.
// Once we know which half is sorted, we can check if the target falls within the range of that sorted half.
// If it does, we perform a standard binary search on that half.
// If it doesn't, we search in the other (unsorted) half.
// This process is repeated until the target is found or the search space is exhausted.
// Time Complexity: O(log n) - Each step of the binary search halves the search space.
// Space Complexity: O(1) - We only use a few variables to keep track of the pointers.
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    // Initialize left and right pointers for binary search.
    let left = 0;
    let right = nums.length - 1;

    // Continue the search as long as the left pointer is less than or equal to the right pointer.
    while (left <= right) {
        // Calculate the middle index to avoid potential integer overflow.
        const mid = Math.floor(left + (right - left) / 2);

        // If the middle element is the target, we've found it.
        if (nums[mid] === target) {
            return mid;
        }

        // Check if the left half of the array (from left to mid) is sorted.
        // This is true if nums[left] <= nums[mid].
        if (nums[left] <= nums[mid]) {
            // If the target is within the range of the sorted left half:
            // i.e., target is greater than or equal to nums[left] AND less than nums[mid].
            if (target >= nums[left] && target < nums[mid]) {
                // Search in the left half by moving the right pointer to mid - 1.
                right = mid - 1;
            } else {
                // If the target is not in the sorted left half, it must be in the right half.
                // Search in the right half by moving the left pointer to mid + 1.
                left = mid + 1;
            }
        }
        // If the left half is not sorted, then the right half (from mid to right) must be sorted.
        else {
            // If the target is within the range of the sorted right half:
            // i.e., target is greater than nums[mid] AND less than or equal to nums[right].
            if (target > nums[mid] && target <= nums[right]) {
                // Search in the right half by moving the left pointer to mid + 1.
                left = mid + 1;
            } else {
                // If the target is not in the sorted right half, it must be in the left half.
                // Search in the left half by moving the right pointer to mid - 1.
                right = mid - 1;
            }
        }
    }

    // If the loop finishes without finding the target, return -1.
    return -1;
};
```