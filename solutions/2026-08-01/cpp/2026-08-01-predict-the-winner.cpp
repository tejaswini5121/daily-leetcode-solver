// Problem Summary: Predict if Player 1 can win a game where players take turns picking numbers from the ends of an array, aiming for a higher score.
// Link: https://leetcode.com/problems/predict-the-winner/
// Approach: This problem can be solved using recursion with memoization (dynamic programming) or a bottom-up DP approach. The core idea is to determine the maximum possible score difference a player can achieve given a subarray.
// For a given subarray nums[i...j], the current player has two choices:
// 1. Pick nums[i]: Their score increases by nums[i], and the opponent will play on the subarray nums[i+1...j]. The opponent will try to maximize their score difference, meaning they will try to minimize the current player's score difference. The score for the current player will be nums[i] - (max difference the opponent can get from nums[i+1...j]).
// 2. Pick nums[j]: Their score increases by nums[j], and the opponent will play on the subarray nums[i...j-1]. Similarly, the score for the current player will be nums[j] - (max difference the opponent can get from nums[i...j-1]).
// The current player will choose the option that maximizes their score difference.
// Base case: When i == j, the current player picks the only element, and the score difference is nums[i].
// Memoization: We can use a 2D DP table (dp[i][j]) to store the maximum score difference the first player can achieve from the subarray nums[i...j].
// Time Complexity: O(n^2) where n is the length of the nums array. This is because there are O(n^2) subproblems (states represented by (i, j)), and each subproblem takes constant time to solve after its dependencies are computed.
// Space Complexity: O(n^2) for the DP table.

#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    // This function calculates the maximum score difference the current player can achieve
    // from the subarray nums[left...right].
    // It uses memoization to avoid redundant calculations.
    // dp[i][j] will store the maximum score difference achievable from nums[i...j] for the current player.
    // A positive value means the current player wins, a negative value means the opponent wins.
    int solve(int left, int right, std::vector<int>& nums, std::vector<std::vector<int>>& dp) {
        // Base case: If the subarray has only one element, the current player takes it.
        if (left == right) {
            return nums[left];
        }

        // If the result for this subproblem (subarray from left to right) is already computed, return it.
        if (dp[left][right] != -1) {
            return dp[left][right];
        }

        // Option 1: The current player picks the element at the left end.
        // Their score increases by nums[left].
        // The opponent then plays on the remaining subarray nums[left+1...right].
        // The opponent will try to maximize their score, which means they will maximize their score difference.
        // So, the score difference for the current player from this choice is nums[left] - (the max difference the opponent can get from the rest).
        int pickLeft = nums[left] - solve(left + 1, right, nums, dp);

        // Option 2: The current player picks the element at the right end.
        // Their score increases by nums[right].
        // The opponent then plays on the remaining subarray nums[left...right-1].
        // Similarly, the score difference for the current player is nums[right] - (the max difference the opponent can get from the rest).
        int pickRight = nums[right] - solve(left, right - 1, nums, dp);

        // The current player will choose the option that maximizes their score difference.
        // Store this maximum difference in the DP table before returning.
        dp[left][right] = std::max(pickLeft, pickRight);

        return dp[left][right];
    }

    bool predictTheWinner(std::vector<int>& nums) {
        int n = nums.size();
        // Initialize a 2D DP table with -1.
        // dp[i][j] will store the maximum score difference Player 1 can achieve
        // from the subarray nums[i...j].
        // If dp[0][n-1] >= 0, it means Player 1 can achieve a score that is
        // greater than or equal to Player 2's score.
        std::vector<std::vector<int>> dp(n, std::vector<int>(n, -1));

        // Call the recursive helper function to calculate the maximum score difference Player 1 can achieve
        // starting with the entire array nums[0...n-1].
        // If the result is non-negative, Player 1 wins or draws (which counts as a win).
        return solve(0, n - 1, nums, dp) >= 0;
    }
};
```