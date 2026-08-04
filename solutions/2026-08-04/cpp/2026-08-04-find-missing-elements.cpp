```cpp
// Problem Summary:
// This problem asks us to find all missing integers within a specific range
// defined by the minimum and maximum values present in a given array `nums`.
// The array `nums` contains unique integers, and the smallest and largest
// numbers of the original contiguous range are guaranteed to be in `nums`.

// Link:
// https://leetcode.com/problems/find-missing-elements/

// Approach Explanation:
// The core idea is to first determine the full range of integers that *should*
// be present. This range is established by finding the minimum and maximum
// values in the input array `nums`. Let's call these `min_val` and `max_val`.
// The complete range of numbers is then `[min_val, min_val + 1, ..., max_val]`.
//
// To efficiently identify which numbers from this range are missing, we can
// use a boolean array (or a hash set) to mark all numbers that *are* present
// in `nums`. Since the constraints specify `1 <= nums[i] <= 100`, a fixed-size
// boolean array `seen[101]` (to cover indices 1 through 100) is very efficient.
//
// The algorithm proceeds as follows:
// 1. Initialize `min_val` to a value greater than any possible `nums[i]` (e.g., 101)
//    and `max_val` to a value smaller than any possible `nums[i]` (e.g., 0).
// 2. Initialize a boolean array `seen` of size 101 to all `false`.
// 3. Iterate through each number `num` in the input array `nums`:
//    a. Mark `seen[num]` as `true` to indicate its presence.
//    b. Update `min_val` to be the minimum of its current value and `num`.
//    c. Update `max_val` to be the maximum of its current value and `num`.
// 4. After processing all numbers in `nums`, `min_val` and `max_val` will hold
//    the true smallest and largest numbers of the range.
// 5. Create an empty `std::vector<int>` to store the missing numbers.
// 6. Iterate from `i = min_val` up to `i = max_val`:
//    a. If `seen[i]` is `false`, it means `i` was not present in `nums`. Add `i`
//       to our result vector.
// 7. Return the `std::vector<int>` containing the missing numbers. Since we
//    iterate from `min_val` to `max_val`, the result vector will naturally be sorted.

// Time Complexity Analysis:
// 1. Iterating through `nums` to find `min_val`, `max_val`, and populate `seen`:
//    O(N), where N is `nums.length`. This involves N constant-time operations
//    (array access, min/max comparisons).
// 2. Iterating from `min_val` to `max_val` to find missing numbers:
//    O(max_val - min_val + 1). Given the constraints `1 <= nums[i] <= 100`,
//    this loop runs at most 100 times, which is a constant factor.
// Overall Time Complexity: O(N + MaxValueRange). Since MaxValueRange (100) is
// a small constant, this simplifies to O(N).

// Space Complexity Analysis:
// 1. `seen` boolean array: O(MaxValueRange). Since MaxValueRange is 100, this
//    is considered O(1) auxiliary space.
// 2. `result` vector: In the worst case (e.g., `nums = [1, 100]`), it could
//    store `MaxValueRange - N` numbers. This is at most 98 numbers. Thus,
//    the space for the result vector is O(MaxValueRange) or O(1) depending on
//    how we classify constant limits.
// Overall Space Complexity: O(MaxValueRange), which is effectively O(1) due to
// the constant constraints on `nums[i]`.

#include <vector>     // Required for std::vector
#include <algorithm>  // Required for std::min and std::max

// Define a class for the solution, as is common in LeetCode problems.
class Solution {
public:
    // Method to find all missing elements in the given range.
    std::vector<int> findMissingElements(std::vector<int>& nums) {
        // Initialize min_val and max_val to extreme values
        // based on constraints (1 <= nums[i] <= 100).
        // Using 101 for min_val ensures any valid nums[i] will be smaller.
        // Using 0 for max_val ensures any valid nums[i] will be larger.
        int min_val = 101;
        int max_val = 0;

        // A boolean array to mark the presence of numbers.
        // Size 101 to cover indices 0-100. Indices 1-100 will be used.
        // Initialized to all false by default for static/global arrays or
        // explicitly with {} for local arrays.
        bool seen[101] = {false}; 

        // First pass: Iterate through the input array to find the true min/max
        // and mark all present numbers in the 'seen' array.
        for (int num : nums) {
            // Mark the current number as seen.
            seen[num] = true;
            // Update the minimum value encountered so far.
            min_val = std::min(min_val, num);
            // Update the maximum value encountered so far.
            max_val = std::max(max_val, num);
        }

        // Initialize an empty vector to store the missing numbers.
        std::vector<int> missing_numbers;

        // Second pass: Iterate from the determined min_val to max_val.
        // For each number in this range, check if it was seen.
        for (int i = min_val; i <= max_val; ++i) {
            // If the current number 'i' has not been seen, it's missing.
            if (!seen[i]) {
                // Add the missing number to our result vector.
                // The numbers are added in increasing order, so the vector
                // will naturally be sorted.
                missing_numbers.push_back(i);
            }
        }

        // Return the sorted list of missing integers.
        return missing_numbers;
    }
};

/*
// Example Usage (for local testing, not part of the submission to LeetCode):
#include <iostream>

void printVector(const std::vector<int>& vec) {
    std::cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << vec[i];
        if (i < vec.size() - 1) {
            std::cout << ",";
        }
    }
    std::cout << "]" << std::endl;
}

int main() {
    Solution sol;

    // Example 1: nums = [1,4,2,5] -> Output: [3]
    std::vector<int> nums1 = {1, 4, 2, 5};
    std::vector<int> result1 = sol.findMissingElements(nums1);
    std::cout << "Input: [1,4,2,5], Output: ";
    printVector(result1); // Expected: [3]

    // Example 2: nums = [7,8,6,9] -> Output: []
    std::vector<int> nums2 = {7, 8, 6, 9};
    std::vector<int> result2 = sol.findMissingElements(nums2);
    std::cout << "Input: [7,8,6,9], Output: ";
    printVector(result2); // Expected: []

    // Example 3: nums = [5,1] -> Output: [2,3,4]
    std::vector<int> nums3 = {5, 1};
    std::vector<int> result3 = sol.findMissingElements(nums3);
    std::cout << "Input: [5,1], Output: ";
    printVector(result3); // Expected: [2,3,4]

    // Custom Test: nums = [10, 15] -> Output: [11,12,13,14]
    std::vector<int> nums4 = {10, 15};
    std::vector<int> result4 = sol.findMissingElements(nums4);
    std::cout << "Input: [10,15], Output: ";
    printVector(result4); // Expected: [11,12,13,14]

    // Custom Test: nums = [1, 2] -> Output: []
    std::vector<int> nums5 = {1, 2};
    std::vector<int> result5 = sol.findMissingElements(nums5);
    std::cout << "Input: [1,2], Output: ";
    printVector(result5); // Expected: []

    // Custom Test: nums = [100, 98] -> Output: [99]
    std::vector<int> nums6 = {100, 98};
    std::vector<int> result6 = sol.findMissingElements(nums6);
    std::cout << "Input: [100,98], Output: ";
    printVector(result6); // Expected: [99]

    return 0;
}
*/
```