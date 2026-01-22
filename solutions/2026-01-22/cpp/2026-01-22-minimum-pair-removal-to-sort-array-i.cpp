```cpp
// Problem: Minimum Pair Removal to Sort Array I
// Problem Summary: Repeatedly merge adjacent elements with the minimum sum until the array is non-decreasing. Return the number of merges.
// Link: https://leetcode.com/problems/minimum-pair-removal-to-sort-array-i/
// Approach:
// We can simulate the process directly. In each step, we need to find the adjacent pair with the minimum sum.
// If there are multiple pairs with the same minimum sum, we choose the leftmost one.
// After finding the pair, we replace them with their sum and increment the operation count.
// We repeat this until the array is sorted non-decreasingly.
// To efficiently find the minimum sum pair, we can iterate through the adjacent pairs and keep track of the minimum sum and its index.
// We use a `std::vector` to represent the array, as it supports efficient element removal and insertion.
// The process continues until the array is sorted. We can check if the array is sorted by iterating through it once.
// Time Complexity:
// In the worst case, we might perform N-1 operations, where N is the initial length of the array.
// In each operation, finding the minimum sum pair takes O(N) time, and modifying the vector takes O(N) time.
// Checking if the array is sorted takes O(N) time.
// Therefore, the overall time complexity is O(N^3) in the worst case. Given the constraint N <= 50, this should be acceptable.
// Space Complexity:
// We use a vector to store the array elements, which takes O(N) space.
// The auxiliary space used for variables is O(1).
// Therefore, the overall space complexity is O(N).

#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int minimumOperations(std::vector<int>& nums) {
        int operations = 0; // Initialize the operation counter

        // Loop until the array is sorted non-decreasingly
        while (!isSorted(nums)) {
            int minSum = INT_MAX; // Initialize minimum sum to a very large value
            int minIndex = -1;    // Initialize index of the pair with minimum sum

            // Iterate through adjacent pairs to find the minimum sum
            for (int i = 0; i < nums.size() - 1; ++i) {
                int currentSum = nums[i] + nums[i+1];
                // If the current sum is less than the minimum sum found so far,
                // or if it's equal and this is the leftmost such pair
                if (currentSum < minSum) {
                    minSum = currentSum;
                    minIndex = i;
                }
            }

            // If a minimum pair was found (array not yet sorted, so it always will be)
            if (minIndex != -1) {
                // Replace the pair with their sum
                nums[minIndex] = nums[minIndex] + nums[minIndex + 1];
                // Remove the next element (which was part of the pair)
                nums.erase(nums.begin() + minIndex + 1);
                operations++; // Increment the operation count
            } else {
                // This case should ideally not be reached if isSorted works correctly
                // and the loop condition is maintained.
                break;
            }
        }

        return operations; // Return the total number of operations
    }

private:
    // Helper function to check if the array is sorted non-decreasingly
    bool isSorted(const std::vector<int>& nums) {
        for (size_t i = 0; i + 1 < nums.size(); ++i) {
            if (nums[i] > nums[i+1]) {
                return false; // If any element is greater than its successor, it's not sorted
            }
        }
        return true; // If no such pair is found, the array is sorted
    }
};

// Example Usage (optional, for testing purposes)
/*
int main() {
    Solution sol;
    std::vector<int> nums1 = {5, 2, 3, 1};
    std::cout << "Input: [5, 2, 3, 1]" << std::endl;
    std::cout << "Output: " << sol.minimumOperations(nums1) << std::endl; // Expected: 2

    std::vector<int> nums2 = {1, 2, 2};
    std::cout << "Input: [1, 2, 2]" << std::endl;
    std::cout << "Output: " << sol.minimumOperations(nums2) << std::endl; // Expected: 0

    std::vector<int> nums3 = {3, 1, 4, 2, 5};
    std::cout << "Input: [3, 1, 4, 2, 5]" << std::endl;
    std::cout << "Output: " << sol.minimumOperations(nums3) << std::endl; // Expected: 3 (3,1)->4, [4,4,2,5] -> (4,2)->6, [4,6,5] -> (6,5)->11, [4,11]

    std::vector<int> nums4 = {10, 1, 2, 3, 4, 5};
    std::cout << "Input: [10, 1, 2, 3, 4, 5]" << std::endl;
    std::cout << "Output: " << sol.minimumOperations(nums4) << std::endl; // Expected: 5

    return 0;
}
*/
```