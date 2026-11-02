// Summary: Finds the minimum moves to make all array elements equal by incrementing/decrementing.
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/
//
// Approach:
// The problem asks for the minimum number of moves to make all elements in an array equal.
// A move consists of incrementing or decrementing a single element by 1.
// The key insight is that the target value to which all elements should be moved is the median of the array.
// If we pick any value other than the median, say a value `x`, the sum of absolute differences
// `sum(|nums[i] - x|)` will be greater than `sum(|nums[i] - median|)`.
//
// Steps:
// 1. Sort the input array `nums`.
// 2. Find the median element. For an array of size `n`, the median is at index `n / 2` (0-indexed).
// 3. Iterate through the sorted array and sum the absolute differences between each element and the median.
//    This sum represents the minimum number of moves.
//
// Time Complexity: O(N log N) due to sorting the array, where N is the number of elements.
// Space Complexity: O(1) if sorting is done in-place, or O(log N) or O(N) depending on the sorting algorithm's space requirements.
//                   For `std::sort` in C++, it's typically O(log N) for the recursion stack.

#include <vector>
#include <algorithm>
#include <cmath>

class Solution {
public:
    int minMoves2(std::vector<int>& nums) {
        // Sort the array to easily find the median.
        std::sort(nums.begin(), nums.end());

        // The median is the element at the middle index.
        // For an array of size n, the median is at index n/2.
        int n = nums.size();
        int median = nums[n / 2];

        int totalMoves = 0;
        // Calculate the sum of absolute differences between each element and the median.
        for (int num : nums) {
            totalMoves += std::abs(num - median);
        }

        return totalMoves;
    }
};
