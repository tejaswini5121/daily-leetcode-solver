// Summary: Checks if an array is a sorted array that has been rotated.
// Link: https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/
// Approach:
// The core idea is that a sorted and rotated array will have at most one "descent" or "break"
// in the non-decreasing order. A descent occurs when nums[i] > nums[i+1].
// If the array is sorted and rotated, there can be at most one such point where the order breaks
// (e.g., in [3,4,5,1,2], the break is between 5 and 1).
// If the array is just sorted (no rotation or rotation by n positions), there will be zero descents.
// If the array is sorted and rotated, there will be exactly one descent.
// If there are two or more descents, the array cannot be a sorted and rotated version of a non-decreasing array.
// We iterate through the array and count these descents. We also need to consider the wrap-around case
// where the last element might be greater than the first element (e.g., [3,4,5,1,2] -> 2 < 3 is fine,
// but [5,1,2,3,4] -> 4 < 5 is also fine). The only case where the wrap-around contributes to a descent
// is if nums[n-1] > nums[0]. This is implicitly handled by comparing nums[i] with nums[(i+1) % n].
// We can simply iterate from i = 0 to n-1 and check nums[i] > nums[(i+1) % n].
//
// Time Complexity: O(n), where n is the length of the input array nums. We iterate through the array once.
// Space Complexity: O(1), as we only use a constant amount of extra space for the counter variable.
class Solution {
    public boolean check(int[] nums) {
        int n = nums.length;
        int inversions = 0; // Counter for the number of times the non-decreasing order is broken.

        // Iterate through the array to find "inversions" or "descents".
        // An inversion occurs when nums[i] > nums[i+1].
        // We use the modulo operator to handle the wrap-around comparison between the last and first element.
        for (int i = 0; i < n; i++) {
            // Compare the current element with the next element, considering wrap-around.
            // For example, if i is n-1, then (i+1) % n will be 0, comparing nums[n-1] with nums[0].
            if (nums[i] > nums[(i + 1) % n]) {
                inversions++; // Increment the count if a descent is found.
            }
        }

        // A sorted and rotated array can have at most one inversion.
        // If inversions is 0, the array is sorted and not rotated (or rotated by n).
        // If inversions is 1, the array is sorted and rotated.
        // If inversions is greater than 1, it's not a sorted and rotated array.
        return inversions <= 1;
    }
}
