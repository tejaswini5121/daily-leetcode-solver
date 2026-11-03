```cpp
// Problem: Minimum Moves to Equal Array Elements III
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-iii/
//
// Summary: Find the minimum moves to make all elements in an array equal by increasing elements.
//
// Approach:
// The problem asks us to find a target value `k` such that the sum of absolute differences
// between each element `nums[i]` and `k` is minimized. That is, we want to minimize
// sum(|nums[i] - k|). This is a classic problem where the optimal `k` is the median
// of the array.
//
// Steps:
// 1. Sort the input array `nums`.
// 2. Find the median element. If the array length `n` is odd, the median is `nums[n/2]`.
//    If `n` is even, any value between `nums[n/2 - 1]` and `nums[n/2]` (inclusive)
//    would be optimal. For simplicity, we can choose `nums[n/2]`.
// 3. Calculate the sum of absolute differences between each element and the median.
//    This sum represents the minimum number of moves.
//
// Time Complexity:
// O(N log N) due to sorting the array, where N is the length of `nums`.
// The subsequent iteration to calculate the sum of differences is O(N).
//
// Space Complexity:
// O(1) if we consider the space used by the sorting algorithm to be in-place,
// or O(log N) to O(N) depending on the sorting algorithm implementation (e.g., recursion stack for quicksort).
// Standard library sort often uses O(log N) space.

#include <vector>
#include <numeric>
#include <algorithm>
#include <cmath>

class Solution {
public:
    int minMoves2(std::vector<int>& nums) {
        // Sort the array to easily find the median.
        std::sort(nums.begin(), nums.end());

        // The median is the optimal target value to minimize the sum of absolute differences.
        // For an array of size n, the median index is n/2.
        // If n is even, any value between nums[n/2 - 1] and nums[n/2] is optimal.
        // We pick nums[n/2] for simplicity.
        int n = nums.size();
        int median = nums[n / 2];

        // Calculate the total number of moves required.
        // This is the sum of the absolute differences between each element and the median.
        long long total_moves = 0;
        for (int num : nums) {
            total_moves += std::abs(num - median);
        }

        // The sum of absolute differences represents the minimum moves to make all elements equal.
        return static_cast<int>(total_moves);
    }
};
```