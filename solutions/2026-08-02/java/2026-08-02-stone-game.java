// Summary: Alice and Bob play a game with an even number of stone piles. They take turns choosing a pile from either end. Alice wins if she has more stones than Bob, assuming optimal play.
// Link: https://leetcode.com/problems/stone-game/
// Approach: This is a classic game theory problem that can be solved using dynamic programming.
// The core idea is to define a state `dp[i][j]` which represents the maximum difference in score that the current player can achieve
// when considering the piles from index `i` to `j` (inclusive).
//
// For each subproblem `dp[i][j]`, the current player has two choices:
// 1. Take the pile at index `i`: The player gets `piles[i]` stones. The remaining piles are from `i+1` to `j`. The next player will play on this subarray.
//    The score difference for the current player will be `piles[i] - dp[i+1][j]`.
// 2. Take the pile at index `j`: The player gets `piles[j]` stones. The remaining piles are from `i` to `j-1`. The next player will play on this subarray.
//    The score difference for the current player will be `piles[j] - dp[i][j-1]`.
//
// The current player will choose the option that maximizes their score difference:
// `dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])`
//
// The base cases are when `i == j`. In this case, `dp[i][i] = piles[i]`.
// We iterate through increasing lengths of subarrays (from 1 to `n`).
// The final answer will be `dp[0][n-1]`. If `dp[0][n-1] > 0`, it means Alice (the first player) can achieve a positive score difference, and thus wins.
//
// IMPORTANT OBSERVATION:
// Due to the problem constraints (even number of piles, total odd number of stones), Alice always has a winning strategy.
// Alice can choose to always pick from either the even-indexed piles or the odd-indexed piles.
// Let's consider the sum of stones at even indices and odd indices.
// Sum_even = piles[0] + piles[2] + ... + piles[n-2]
// Sum_odd  = piles[1] + piles[3] + ... + piles[n-1]
// Total sum is Sum_even + Sum_odd, which is odd. This means Sum_even != Sum_odd.
//
// Alice can decide at the beginning whether she wants to target the set of piles with a larger sum.
// For example, if Sum_even > Sum_odd, Alice can ensure she always picks from an even-indexed pile.
// If Alice picks piles[0], the remaining piles are from index 1 to n-1. The next player (Bob) faces piles at indices 1, 2, ..., n-1.
// If Bob picks piles[1] (odd index), Alice can pick piles[2] (even index).
// If Bob picks piles[n-1] (odd index), Alice can pick piles[n-2] (even index).
// Alice can always maintain the strategy of picking from the 'preferred' parity of indices.
// Since Sum_even != Sum_odd, Alice can always pick the parity that gives her more stones.
// Therefore, Alice always wins.
//
// Time Complexity: O(n^2) for the DP approach. However, due to the mathematical property explained above, the actual time complexity to determine the winner is O(1).
// Space Complexity: O(n^2) for the DP approach. However, due to the mathematical property explained above, the actual space complexity to determine the winner is O(1).

class Solution {
    public boolean stoneGame(int[] piles) {
        // Due to the problem constraints (even number of piles, total odd number of stones),
        // Alice always has a winning strategy by picking from piles of a specific parity
        // (either all even-indexed piles or all odd-indexed piles).
        // Since the total number of stones is odd, the sum of stones at even indices
        // and the sum of stones at odd indices cannot be equal.
        // Alice can choose to target the set of piles with the larger sum, and she can
        // always ensure she picks from this set.
        // Therefore, Alice always wins.
        return true;

        /*
        // DP approach for completeness (though not necessary for this problem given the constraints)
        int n = piles.length;
        // dp[i][j] will store the maximum score difference the current player can achieve
        // from piles[i] to piles[j]
        int[][] dp = new int[n][n];

        // Base case: when only one pile is left, the player takes it.
        for (int i = 0; i < n; i++) {
            dp[i][i] = piles[i];
        }

        // Fill the DP table for lengths of subarrays from 2 to n
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                // The current player can either take piles[i] or piles[j].
                // If they take piles[i], their score is piles[i] plus the remaining score difference from dp[i+1][j].
                // The difference is positive if they take more than the opponent.
                // The score difference achieved by the *current* player from the remaining subarray is dp[i+1][j].
                // So, if the current player takes piles[i], their score gain relative to the opponent is piles[i] - dp[i+1][j].
                // Similarly, if they take piles[j], their score gain is piles[j] - dp[i][j-1].
                // The current player will choose the move that maximizes this difference.
                dp[i][j] = Math.max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1]);
            }
        }

        // If dp[0][n-1] is positive, it means Alice (the first player) can achieve a positive score difference,
        // thus she wins.
        return dp[0][n - 1] > 0;
        */
    }
}
