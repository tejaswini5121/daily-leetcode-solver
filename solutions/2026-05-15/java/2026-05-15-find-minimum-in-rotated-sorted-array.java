// Problem: Find Minimum in Rotated Sorted Array
// Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
//
// Approach:
// This problem can be solved efficiently using binary search. The key idea is to observe that in a rotated sorted array,
// the minimum element will be the only element that is smaller than its previous element (if it exists).
// We can use binary search to narrow down the search space. We compare the middle element with the rightmost element.
//
// 1. If nums[mid] > nums[right], it means the minimum element lies in the right half of the array (including mid+1).
//    This is because the left part (from left to mid) is still in its sorted ascending order relative to each other,
//    but the pivot point (minimum element) must be to the right of mid. So we update left = mid + 1.
//
// 2. If nums[mid] <= nums[right], it means the minimum element lies in the left half of the array (including mid).
//    The right half (from mid to right) is sorted, and nums[mid] could be the minimum or the minimum is to its left.
//    So we update right = mid.
//
// We continue this process until left == right. At this point, 'left' (or 'right') will point to the index of the minimum element.
//
// Time Complexity: O(log n)
// The algorithm uses binary search, which halves the search space in each step.
//
// Space Complexity: O(1)
// The algorithm uses a constant amount of extra space for variables like 'left', 'right', and 'mid'.
class Solution {
    /**
     * Finds the minimum element in a rotated sorted array.
     *
     * @param nums The rotated sorted array of unique elements.
     * @return The minimum element in the array.
     */
    public int findMin(int[] nums) {
        // Initialize two pointers, 'left' and 'right', to the start and end of the array.
        int left = 0;
        int right = nums.length - 1;

        // The binary search loop continues as long as the 'left' pointer is less than the 'right' pointer.
        // When left == right, we have found the minimum element.
        while (left < right) {
            // Calculate the middle index to avoid potential integer overflow.
            int mid = left + (right - left) / 2;

            // Compare the middle element with the rightmost element.
            // If nums[mid] > nums[right], it means the pivot (minimum element) is in the right half.
            // The left portion (from left to mid) is sorted ascendingly, but it's "higher" than the minimum.
            // So, we discard the left half and search in the right half by moving 'left' to 'mid + 1'.
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            }
            // If nums[mid] <= nums[right], it means the minimum element is in the left half,
            // or nums[mid] itself is the minimum element.
            // The right portion (from mid to right) is sorted ascendingly.
            // We search in the left half by moving 'right' to 'mid'. We keep 'mid' in the search space
            // because it might be the minimum.
            else {
                right = mid;
            }
        }

        // When the loop terminates, 'left' and 'right' will point to the same index,
        // which is the index of the minimum element in the rotated sorted array.
        return nums[left];
    }
}
