// Given an array of integers, find the maximum product of two elements after decrementing them by 1.
// Problem Link: https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/
// Approach: To maximize the product (nums[i]-1)*(nums[j]-1), we need to find the two largest elements in the array.
// This is because subtracting 1 from a larger number will result in a larger decremented value,
// and the product of two larger decremented values will be maximized.
// We can find the two largest elements by iterating through the array and keeping track of the largest and second largest elements found so far.
// Alternatively, we can sort the array and pick the last two elements.
// Time Complexity: O(N log N) if sorting is used, O(N) if we iterate to find the top two.
// Space Complexity: O(1) if we iterate to find the top two, O(N) or O(log N) depending on the sorting algorithm's space complexity.
// For this solution, we will use the O(N) iteration approach for better time complexity.

#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    int maxProduct(std::vector<int>& nums) {
        // Initialize variables to store the largest and second largest elements.
        // We initialize them to a very small value to ensure the first elements encountered
        // become the largest and second largest initially.
        int max1 = 0; // Stores the largest element
        int max2 = 0; // Stores the second largest element

        // Iterate through the array to find the two largest elements.
        for (int num : nums) {
            // If the current number is greater than the current largest element (max1)
            if (num > max1) {
                // The previous largest element (max1) now becomes the second largest (max2).
                max2 = max1;
                // The current number becomes the new largest element (max1).
                max1 = num;
            }
            // Else if the current number is not greater than max1, but is greater than the second largest element (max2)
            else if (num > max2) {
                // The current number becomes the new second largest element (max2).
                max2 = num;
            }
        }

        // Calculate and return the maximum product of (nums[i]-1)*(nums[j]-1).
        // We use max1 and max2 as the two largest elements.
        return (max1 - 1) * (max2 - 1);
    }
};

// Main function for testing
int main() {
    Solution sol;

    // Example 1
    std::vector<int> nums1 = {3, 4, 5, 2};
    std::cout << "Input: [3, 4, 5, 2]" << std::endl;
    std::cout << "Output: " << sol.maxProduct(nums1) << std::endl; // Expected output: 12

    // Example 2
    std::vector<int> nums2 = {1, 5, 4, 5};
    std::cout << "Input: [1, 5, 4, 5]" << std::endl;
    std::cout << "Output: " << sol.maxProduct(nums2) << std::endl; // Expected output: 16

    // Example 3
    std::vector<int> nums3 = {3, 7};
    std::cout << "Input: [3, 7]" << std::endl;
    std::cout << "Output: " << sol.maxProduct(nums3) << std::endl; // Expected output: 12

    return 0;
}
