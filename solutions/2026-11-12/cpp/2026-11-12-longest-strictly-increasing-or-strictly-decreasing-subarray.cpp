// Problem: Longest Strictly Increasing or Strictly Decreasing Subarray
// Link: https://leetcode.com/problems/longest-strictly-increasing-or-strictly-decreasing-subarray/
//
// Approach:
// We can iterate through the array and maintain two counters: one for the current strictly increasing subarray length
// and one for the current strictly decreasing subarray length.
// At each element, we compare it with the previous element.
// If nums[i] > nums[i-1], it extends the increasing subarray, so we increment the increasing counter and reset the decreasing counter to 1.
// If nums[i] < nums[i-1], it extends the decreasing subarray, so we increment the decreasing counter and reset the increasing counter to 1.
// If nums[i] == nums[i-1], both increasing and decreasing subarrays are broken, so we reset both counters to 1.
// We keep track of the maximum length encountered so far by comparing it with the current increasing and decreasing lengths.
// The initial maximum length is 1, as any single element is a valid subarray.
//
// Time Complexity: O(n), where n is the length of the input array. We iterate through the array once.
// Space Complexity: O(1), as we only use a few variables to store the current and maximum lengths.

#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    int longestSubarray(std::vector<int>& nums) {
        // Handle the edge case where the array is empty.
        if (nums.empty()) {
            return 0;
        }

        // Initialize the maximum length to 1, as any single element is a valid subarray.
        int maxLength = 1;
        // Initialize the current length of the strictly increasing subarray.
        int currentIncreasingLength = 1;
        // Initialize the current length of the strictly decreasing subarray.
        int currentDecreasingLength = 1;

        // Iterate through the array starting from the second element.
        for (size_t i = 1; i < nums.size(); ++i) {
            // Check if the current element is strictly greater than the previous element.
            if (nums[i] > nums[i - 1]) {
                // If it is, the strictly increasing subarray is extended.
                currentIncreasingLength++;
                // The strictly decreasing subarray is broken, so reset its length to 1.
                currentDecreasingLength = 1;
            }
            // Check if the current element is strictly less than the previous element.
            else if (nums[i] < nums[i - 1]) {
                // If it is, the strictly decreasing subarray is extended.
                currentDecreasingLength++;
                // The strictly increasing subarray is broken, so reset its length to 1.
                currentIncreasingLength = 1;
            }
            // If the current element is equal to the previous element.
            else {
                // Both strictly increasing and strictly decreasing subarrays are broken.
                // Reset both lengths to 1.
                currentIncreasingLength = 1;
                currentDecreasingLength = 1;
            }
            // Update the maximum length found so far.
            // We take the maximum of the current maxLength, currentIncreasingLength, and currentDecreasingLength.
            maxLength = std::max({maxLength, currentIncreasingLength, currentDecreasingLength});
        }

        // Return the overall maximum length found.
        return maxLength;
    }
};

/*
int main() {
    Solution sol;
    std::vector<int> nums1 = {1, 4, 3, 3, 2};
    std::cout << "Input: [1,4,3,3,2]" << std::endl;
    std::cout << "Output: " << sol.longestSubarray(nums1) << std::endl; // Expected: 2

    std::vector<int> nums2 = {3, 3, 3, 3};
    std::cout << "Input: [3,3,3,3]" << std::endl;
    std::cout << "Output: " << sol.longestSubarray(nums2) << std::endl; // Expected: 1

    std::vector<int> nums3 = {3, 2, 1};
    std::cout << "Input: [3,2,1]" << std::endl;
    std::cout << "Output: " << sol.longestSubarray(nums3) << std::endl; // Expected: 3

    std::vector<int> nums4 = {1, 2, 3, 4, 5};
    std::cout << "Input: [1,2,3,4,5]" << std::endl;
    std::cout << "Output: " << sol.longestSubarray(nums4) << std::endl; // Expected: 5

    std::vector<int> nums5 = {5};
    std::cout << "Input: [5]" << std::endl;
    std::cout << "Output: " << sol.longestSubarray(nums5) << std::endl; // Expected: 1

    return 0;
}
*/
