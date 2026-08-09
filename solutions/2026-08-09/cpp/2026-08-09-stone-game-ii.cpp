// Problem: Stone Game II
// Link: https://leetcode.com/problems/stone-game-ii/
// Approach: This problem can be solved using dynamic programming with memoization.
// The state can be defined by (index, M), where 'index' is the starting pile index
// and 'M' is the current value of M. The function dp(index, M) will return the
// maximum number of stones the current player can get starting from 'index' with
// the given 'M'.
// Since it's a zero-sum game where players play optimally, we want to maximize our
// score while assuming the opponent will also play optimally to maximize their score.
// This means if the current player takes 'x' piles, the remaining stones for the
// opponent will be the total stones from 'index + x' to the end. The opponent will
// then try to maximize their score from that point, which is equivalent to minimizing
// the current player's score from that point.
// We can precompute prefix sums to quickly get the sum of stones in a range.
// The base case is when 'index' is out of bounds, in which case 0 stones are collected.
// For each state (index, M), we iterate through all possible moves 'x' (1 <= x <= 2*M).
// For each 'x', the current player takes stones from 'index' to 'index + x - 1'.
// The remaining stones are what the opponent gets. The current player's score for this move
// is the sum of stones taken plus the total stones minus the maximum the opponent can get
// from the next state (index + x, max(M, x)).
// We use memoization to store the results of dp(index, M) to avoid redundant calculations.
//
// Time Complexity: O(N^2 * M_max), where N is the number of piles and M_max is the maximum possible value of M.
// Since X can be up to 2*M, and M can grow up to N, M_max can be approximately N.
// The number of states is N * N. For each state, we iterate up to 2*M times.
// In the worst case, M can be up to N. So, roughly O(N^3).
//
// Space Complexity: O(N^2) for the memoization table (dp array) and O(N) for prefix sums.
// Thus, the total space complexity is O(N^2).

#include <vector>
#include <numeric>
#include <algorithm>
#include <map>

class Solution {
    // Memoization table: map key is a pair of (index, M), value is the max stones
    std::map<std::pair<int, int>, int> memo;
    // Prefix sums to quickly calculate sum of stones in a range
    std::vector<int> prefixSum;
    // Original piles array
    std::vector<int> piles_arr;
    // Total number of piles
    int n;

    // Recursive function to calculate the maximum stones the current player can get
    // index: the starting index of the remaining piles
    // M: the current value of M
    int solve(int index, int M) {
        // Base case: If we have reached the end of the piles, return 0 stones.
        if (index >= n) {
            return 0;
        }

        // Check if the result for this state is already computed and stored in memo.
        if (memo.count({index, M})) {
            return memo[{index, M}];
        }

        // Calculate the total stones remaining from the current index to the end.
        // This is used to calculate the score of the opponent if the current player
        // takes some stones.
        int remainingTotalStones = prefixSum[n] - prefixSum[index];

        // Initialize the maximum stones the current player can get for this state.
        // We initialize it to a very small number because we want to maximize.
        int maxStonesForCurrentPlayer = 0;

        // Iterate through all possible moves 'x' (number of piles to take).
        // 'x' can be from 1 up to 2*M. Also, 'x' cannot exceed the number of remaining piles.
        for (int x = 1; x <= 2 * M && index + x <= n; ++x) {
            // Calculate the sum of stones the current player takes in this move.
            // This is the sum of piles from 'index' to 'index + x - 1'.
            int currentMoveStones = prefixSum[index + x] - prefixSum[index];

            // The opponent will play optimally from the next state.
            // The next state starts at 'index + x' and the new 'M' becomes max(M, x).
            // The value returned by solve(index + x, std::max(M, x)) is the maximum
            // stones the opponent can get from the remaining piles.
            // The current player's score for this move is the stones they took
            // plus the total remaining stones minus what the opponent gets.
            int stonesIfThisMoveIsChosen = currentMoveStones + (remainingTotalStones - solve(index + x, std::max(M, x)));

            // Update the maximum stones the current player can get by considering this move.
            maxStonesForCurrentPlayer = std::max(maxStonesForCurrentPlayer, stonesIfThisMoveIsChosen);
        }

        // Store the computed maximum stones for the current state in the memoization table.
        memo[{index, M}] = maxStonesForCurrentPlayer;
        // Return the maximum stones the current player can get.
        return maxStonesForCurrentPlayer;
    }

public:
    int stoneGameII(std::vector<int>& piles) {
        // Store the input piles in a member variable for easy access.
        piles_arr = piles;
        // Get the total number of piles.
        n = piles.size();

        // Initialize prefix sum array. prefixSum[i] will store the sum of piles[0] to piles[i-1].
        prefixSum.resize(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            prefixSum[i + 1] = prefixSum[i] + piles[i];
        }

        // Clear the memoization table before starting a new game.
        memo.clear();

        // Alice starts the game. The initial state is starting from index 0 with M = 1.
        // The solve function returns the maximum number of stones Alice can get.
        return solve(0, 1);
    }
};
```