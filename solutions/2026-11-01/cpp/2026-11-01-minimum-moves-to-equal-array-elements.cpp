// Problem: Minimum Moves to Equal Array Elements
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements/
//
// Problem Summary:
// Given an integer array, find the minimum moves to make all elements equal.
// In one move, increment n-1 elements by 1.
//
// Approach Explanation:
// The key insight is that incrementing n-1 elements by 1 is mathematically equivalent
// to decrementing one element by 1. This is because the relative difference between
// elements remains the same.
// If we want to make all elements equal to some target value `T`, and we increment
// n-1 elements by 1 in each step, let `m` be the number of moves.
// The sum of the array after `m` moves will be `sum(nums) + m * (n - 1)`.
// If all elements become equal to `T`, then `T` must be the final value of every element.
// The initial minimum element `min_val` will also eventually become `T`.
// The number of increments that the minimum element receives is `m`. So, `T = min_val + m`.
//
// Therefore, the final sum can also be expressed as `n * T`.
// Equating the two expressions for the final sum:
// `sum(nums) + m * (n - 1) = n * T`
// Substitute `T = min_val + m`:
// `sum(nums) + m * (n - 1) = n * (min_val + m)`
// `sum(nums) + m * n - m = n * min_val + n * m`
// `sum(nums) - m = n * min_val`
// `sum(nums) - n * min_val = m`
//
// So, the minimum number of moves `m` is `sum(nums) - n * min_val`.
// This means we need to find the sum of all elements and the minimum element,
// and then calculate `sum - (n * min_val)`.
//
// Time Complexity Analysis:
// We need to iterate through the array once to find the minimum element and the sum.
// This takes O(n) time, where n is the length of the array.
//
// Space Complexity Analysis:
// We only use a few variables to store the sum and the minimum value, which is O(1) space.
//
#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int minMoves(std::vector<int>& nums) {
        // Get the size of the array.
        int n = nums.size();

        // If the array is empty or has only one element, no moves are needed.
        if (n <= 1) {
            return 0;
        }

        // Find the minimum element in the array.
        // std::min_element returns an iterator to the smallest element.
        // Dereference it to get the value.
        int min_val = *std::min_element(nums.begin(), nums.end());

        // Calculate the sum of all elements in the array.
        // std::accumulate sums up all elements starting from an initial value (0 in this case).
        long long sum = 0; // Use long long to prevent potential overflow for sum.
        for (int num : nums) {
            sum += num;
        }

        // The minimum number of moves is the total sum minus n times the minimum element.
        // This formula is derived from the fact that incrementing n-1 elements is
        // equivalent to decrementing 1 element, and we want to bring all elements
        // down to the level of the initial minimum element.
        // The total difference that needs to be "removed" (by bringing larger numbers down)
        // is the sum of differences between each element and the minimum element.
        // This is equivalent to sum(nums[i] - min_val) for all i, which simplifies to
        // sum(nums) - n * min_val.
        return static_cast<int>(sum - (long long)n * min_val);
    }
};
