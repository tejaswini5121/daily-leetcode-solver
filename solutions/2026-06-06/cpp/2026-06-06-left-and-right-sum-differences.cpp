// Problem: Left and Right Sum Differences
// Link: https://leetcode.com/problems/left-and-right-sum-differences/
//
// Approach:
// We can solve this problem efficiently using prefix sums.
// First, we calculate the total sum of all elements in the array.
// Then, we iterate through the array. For each element at index `i`:
// 1. The `leftSum[i]` is the sum of elements to its left. This can be maintained as a running sum.
// 2. The `rightSum[i]` is the sum of elements to its right. This can be calculated by subtracting the `leftSum[i]` and the current element `nums[i]` from the total sum.
// 3. The difference `answer[i]` is the absolute value of `leftSum[i] - rightSum[i]`.
//
// Time Complexity: O(n), where n is the number of elements in the input array.
// We iterate through the array twice: once to calculate the total sum and once to compute the left and right sums and their differences.
//
// Space Complexity: O(n) for the output array `answer`. If we consider the output array as part of the space complexity, then it's O(n). If we are allowed to modify the input array or if the output array is not counted towards space complexity, then it would be O(1) as we only use a few extra variables.

#include <vector>
#include <numeric>
#include <cmath>

class Solution {
public:
    std::vector<int> getDistances(std::vector<int>& nums) {
        int n = nums.size();
        std::vector<int> answer(n);

        // Calculate the total sum of all elements in the array.
        long long totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        long long leftSum = 0; // Accumulates the sum of elements to the left of the current index.

        // Iterate through the array to calculate leftSum, rightSum, and the differences.
        for (int i = 0; i < n; ++i) {
            // rightSum[i] is the totalSum minus the sum of elements to the left (leftSum)
            // and the current element itself (nums[i]).
            long long rightSum = totalSum - leftSum - nums[i];

            // Calculate the absolute difference between leftSum and rightSum.
            answer[i] = std::abs(leftSum - rightSum);

            // Update leftSum by adding the current element for the next iteration.
            leftSum += nums[i];
        }

        return answer;
    }
};
