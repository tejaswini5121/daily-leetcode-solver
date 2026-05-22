/**
 * Searches for a target value in a rotated sorted array.
 * The array is sorted in ascending order but might have been rotated at an unknown pivot.
 * The algorithm uses a modified binary search to achieve O(log n) time complexity.
 *
 * Problem Link: https://leetcode.com/problems/search-in-rotated-sorted-array/
 *
 * Approach:
 * We adapt the standard binary search. In each step, we determine which half of the array
 * is sorted.
 * 1. Initialize `left` to 0 and `right` to `nums.length - 1`.
 * 2. While `left` <= `right`:
 *    a. Calculate `mid = left + (right - left) / 2`.
 *    b. If `nums[mid]` equals `target`, return `mid`.
 *    c. Check if the left half (`nums[left]` to `nums[mid]`) is sorted.
 *       - If it is sorted:
 *         - If `target` is within the range of the left sorted half (`nums[left] <= target < nums[mid]`),
 *           then search in the left half by setting `right = mid - 1`.
 *         - Otherwise, the `target` must be in the right half (if it exists), so search
 *           in the right half by setting `left = mid + 1`.
 *       - If the left half is not sorted, it means the right half (`nums[mid]` to `nums[right]`)
 *         must be sorted.
 *         - If `target` is within the range of the right sorted half (`nums[mid] < target <= nums[right]`),
 *           then search in the right half by setting `left = mid + 1`.
 *         - Otherwise, the `target` must be in the left half (if it exists), so search
 *           in the left half by setting `right = mid - 1`.
 * 3. If the loop finishes without finding the `target`, return -1.
 *
 * Time Complexity: O(log n)
 * The algorithm performs a binary search, dividing the search space in half at each step.
 *
 * Space Complexity: O(1)
 * The algorithm uses a constant amount of extra space for variables like `left`, `right`, and `mid`.
 */
class Solution {
    /**
     * Searches for a target in a rotated sorted array.
     *
     * @param nums The rotated sorted integer array.
     * @param target The integer to search for.
     * @return The index of the target if found, otherwise -1.
     */
    public int search(int[] nums, int target) {
        // Initialize pointers for the binary search.
        int left = 0;
        int right = nums.length - 1;

        // Perform binary search.
        while (left <= right) {
            // Calculate the middle index to avoid potential integer overflow.
            int mid = left + (right - left) / 2;

            // If the middle element is the target, we've found it.
            if (nums[mid] == target) {
                return mid;
            }

            // Determine which half of the array is sorted.

            // Case 1: The left half (from `left` to `mid`) is sorted.
            if (nums[left] <= nums[mid]) {
                // Check if the target lies within this sorted left half.
                if (target >= nums[left] && target < nums[mid]) {
                    // If yes, search in the left half.
                    right = mid - 1;
                } else {
                    // If no, the target must be in the right half (if it exists).
                    left = mid + 1;
                }
            }
            // Case 2: The right half (from `mid` to `right`) is sorted.
            // This condition implies that `nums[left] > nums[mid]`, meaning the rotation point is in the left half.
            else {
                // Check if the target lies within this sorted right half.
                if (target > nums[mid] && target <= nums[right]) {
                    // If yes, search in the right half.
                    left = mid + 1;
                } else {
                    // If no, the target must be in the left half (if it exists).
                    right = mid - 1;
                }
            }
        }

        // If the loop completes without finding the target, return -1.
        return -1;
    }
}
