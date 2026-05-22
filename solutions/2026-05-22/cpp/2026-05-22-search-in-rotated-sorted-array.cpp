// Problem: Search in Rotated Sorted Array
// Link: https://leetcode.com/problems/search-in-rotated-sorted-array/
// Approach: This problem can be solved using a modified binary search.
// The core idea is to determine which half of the current search space (left or right) is sorted.
// Once we know which half is sorted, we can check if the target falls within the range of that sorted half.
// If it does, we adjust our binary search to that sorted half.
// If it doesn't, the target must be in the other (unsorted) half, and we adjust our search accordingly.
// We continue this process until the search space is exhausted or the target is found.
// Time Complexity: O(log n) - Each step of the binary search halves the search space.
// Space Complexity: O(1) - We only use a few variables for pointers and comparisons.
#include <vector>
#include <iostream>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;

        // Perform binary search
        while (left <= right) {
            int mid = left + (right - left) / 2; // Calculate mid to avoid overflow

            // If target is found at mid, return mid
            if (nums[mid] == target) {
                return mid;
            }

            // Determine which half is sorted
            // Case 1: The left half (from left to mid) is sorted
            if (nums[left] <= nums[mid]) {
                // Check if target lies within the sorted left half
                if (target >= nums[left] && target < nums[mid]) {
                    // Target is in the left sorted half, so search there
                    right = mid - 1;
                } else {
                    // Target is not in the left sorted half, so search in the right unsorted half
                    left = mid + 1;
                }
            }
            // Case 2: The right half (from mid to right) is sorted
            else { // nums[left] > nums[mid] implies the pivot is in the left half, so right half is sorted
                // Check if target lies within the sorted right half
                if (target > nums[mid] && target <= nums[right]) {
                    // Target is in the right sorted half, so search there
                    left = mid + 1;
                } else {
                    // Target is not in the right sorted half, so search in the left unsorted half
                    right = mid - 1;
                }
            }
        }

        // If target is not found after the loop, return -1
        return -1;
    }
};
/*
// Example Usage:
int main() {
    Solution sol;
    std::vector<int> nums1 = {4,5,6,7,0,1,2};
    int target1 = 0;
    std::cout << "Input: nums = [4,5,6,7,0,1,2], target = 0" << std::endl;
    std::cout << "Output: " << sol.search(nums1, target1) << std::endl; // Expected: 4

    std::vector<int> nums2 = {4,5,6,7,0,1,2};
    int target2 = 3;
    std::cout << "Input: nums = [4,5,6,7,0,1,2], target = 3" << std::endl;
    std::cout << "Output: " << sol.search(nums2, target2) << std::endl; // Expected: -1

    std::vector<int> nums3 = {1};
    int target3 = 0;
    std::cout << "Input: nums = [1], target = 0" << std::endl;
    std::cout << "Output: " << sol.search(nums3, target3) << std::endl; // Expected: -1

    std::vector<int> nums4 = {1,3};
    int target4 = 3;
    std::cout << "Input: nums = [1,3], target = 3" << std::endl;
    std::cout << "Output: " << sol.search(nums4, target4) << std::endl; // Expected: 1

    std::vector<int> nums5 = {3,1};
    int target5 = 1;
    std::cout << "Input: nums = [3,1], target = 1" << std::endl;
    std::cout << "Output: " << sol.search(nums5, target5) << std::endl; // Expected: 1
    
    return 0;
}
*/
