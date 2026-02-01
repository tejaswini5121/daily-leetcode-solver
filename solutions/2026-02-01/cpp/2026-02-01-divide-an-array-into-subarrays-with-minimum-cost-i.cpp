```cpp
// Problem: Divide an Array Into Subarrays With Minimum Cost I
// Link: https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-i/
//
// Approach:
// The problem requires dividing an array into 3 disjoint contiguous subarrays and minimizing the sum of the costs of these subarrays.
// The cost of a subarray is its first element.
// Since the array length n is small (<= 50), we can iterate through all possible split points.
// We need to find two split points, say `i` and `j`, such that:
// - The first subarray is `nums[0...i-1]`
// - The second subarray is `nums[i...j-1]`
// - The third subarray is `nums[j...n-1]`
//
// The constraints are:
// - The first subarray must have at least one element.
// - The second subarray must have at least one element.
// - The third subarray must have at least one element.
//
// This means:
// - The first split point `i` can range from 1 to `n-2`. (The first subarray ends at `i-1`, so `i` can be at most `n-2` to leave at least one element for the second and third subarrays).
// - The second split point `j` can range from `i+1` to `n-1`. (The second subarray ends at `j-1`, so `j` can be at most `n-1` to leave at least one element for the third subarray).
//
// The cost of the first subarray is `nums[0]`.
// The cost of the second subarray is `nums[i]`.
// The cost of the third subarray is `nums[j]`.
//
// We iterate through all valid `i` and `j`, calculate the total cost `nums[0] + nums[i] + nums[j]`, and keep track of the minimum cost found.
//
// Time Complexity:
// We have nested loops. The outer loop for `i` runs from 1 to `n-2` (approximately `n` times).
// The inner loop for `j` runs from `i+1` to `n-1` (also approximately `n` times).
// Therefore, the total time complexity is O(n^2).
// Given n <= 50, n^2 is at most 2500, which is well within typical time limits.
//
// Space Complexity:
// We only use a few variables to store the minimum cost and loop indices.
// Therefore, the space complexity is O(1).

#include <vector>
#include <algorithm>
#include <limits>

class Solution {
public:
    int minimumCost(std::vector<int>& nums) {
        int n = nums.size();
        // Initialize minimum cost to a very large value.
        int min_total_cost = std::numeric_limits<int>::max();

        // Iterate through all possible split points for the first subarray.
        // 'i' represents the start index of the second subarray.
        // The first subarray will be nums[0...i-1].
        // 'i' can range from 1 to n-2, ensuring at least one element in each subarray.
        for (int i = 1; i < n - 1; ++i) {
            // Iterate through all possible split points for the second subarray.
            // 'j' represents the start index of the third subarray.
            // The second subarray will be nums[i...j-1].
            // 'j' can range from i+1 to n-1, ensuring at least one element in each subarray.
            for (int j = i + 1; j < n; ++j) {
                // The cost of the first subarray is nums[0].
                // The cost of the second subarray is nums[i].
                // The cost of the third subarray is nums[j].
                int current_total_cost = nums[0] + nums[i] + nums[j];
                
                // Update the minimum total cost if the current cost is smaller.
                min_total_cost = std::min(min_total_cost, current_total_cost);
            }
        }

        return min_total_cost;
    }
};
```