// Problem: Stone Game II
// Link: https://leetcode.com/problems/stone-game-ii/
//
// Approach:
// This problem can be solved using dynamic programming with memoization, framed as a minimax game.
// We define a recursive function `solve(index, m)` which returns the maximum number of stones the current player can get
// starting from `piles[index]` with the current M value as `m`.
//
// The base case is when `index` reaches the end of the `piles` array. In this case, the current player gets 0 stones.
//
// For a given state `(index, m)`, the current player can choose to take `x` piles, where `1 <= x <= 2*m` and `index + x <= piles.length`.
// After taking `x` piles, the number of stones the current player gets is the sum of stones from `piles[index]` to `piles[index + x - 1]`.
// The remaining piles will be played by the other player, starting from `index + x` and with the new M value `max(m, x)`.
// The other player will play optimally to maximize their stones, which means they will leave the minimum possible stones for the current player.
// Therefore, the current player wants to maximize `(sum of taken piles) + (total stones from current index onwards - maximum stones the next player can get)`.
//
// To efficiently calculate the sum of stones, we can use a prefix sum array.
//
// The DP state can be represented by `dp[index][m]`, storing the maximum stones the current player can get starting from `index` with M as `m`.
// We initialize the DP table with -1 to indicate uncomputed states.
//
// The initial call would be `solve(0, 1)`.
//
// Time Complexity:
// The number of states is `piles.length * (piles.length / 2 + 1)`. For each state, we iterate up to `2*M` times, where `M` can be up to `piles.length`.
// More precisely, `M` is bounded by `n` (number of piles), so the loop runs up to `2*n` times.
// The maximum value of M can be `piles.length`.
// The range of `index` is `0` to `n`. The range of `m` is `1` to `n+1` (since `2*m` can reach `2*n` and `m` is updated to `x`).
// A tighter bound on `m`: `m` can at most be `n`. If `x=n`, `m` becomes `n`. `2*m` can go up to `2*n`.
// So, the states are `O(n * n)`. The transition takes `O(n)` because `2*m` can be up to `2*n`.
// However, `2*m` is bounded by `n` (number of remaining piles). So the inner loop is `O(n)`.
// The total states are `n * n`. The transitions are `n`. So, `O(n^3)`.
// Using prefix sums for sum calculation is `O(1)`.
// Total time complexity: `O(n^3)`.
//
// Space Complexity:
// The DP table `dp[n][n+1]` takes `O(n^2)` space.
// The prefix sum array takes `O(n)` space.
// Total space complexity: `O(n^2)`.
//
class Solution {
    // dp[index][m] stores the maximum stones the current player can get
    // starting from index `index` with current M value `m`.
    private Integer[][] memo;
    private int[] prefixSum;
    private int[] piles;
    private int n;

    public int stoneGameII(int[] piles) {
        this.piles = piles;
        this.n = piles.length;
        // Initialize memoization table with nulls (or -1, but null is cleaner for Integer)
        memo = new Integer[n][n + 1];
        // Precompute prefix sums for efficient sum calculation
        prefixSum = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefixSum[i + 1] = prefixSum[i] + piles[i];
        }
        // Start the game from the first pile (index 0) with M = 1
        return solve(0, 1);
    }

    // Recursive function to calculate the maximum stones the current player can get
    // index: the starting index of the current piles
    // m: the current value of M
    private int solve(int index, int m) {
        // Base case: if we have reached the end of the piles, no stones can be taken
        if (index >= n) {
            return 0;
        }
        // If the result for this state (index, m) is already computed, return it
        if (memo[index][m] != null) {
            return memo[index][m];
        }

        // Calculate the total number of stones remaining from the current index
        int remainingStones = prefixSum[n] - prefixSum[index];

        // Initialize the maximum stones the current player can get in this state to a very small value
        // This will be updated as we explore different moves.
        int maxStonesForCurrentPlayer = 0;

        // Iterate through all possible moves: taking x piles
        // 1 <= x <= 2*m, and the piles taken must be within the bounds of the array
        for (int x = 1; x <= 2 * m && index + x <= n; x++) {
            // The number of stones the current player takes in this move
            int currentMoveStones = prefixSum[index + x] - prefixSum[index];

            // The opponent will play optimally from the next state (index + x) with the new M value (max(m, x)).
            // The opponent will try to maximize their own stones, which means minimizing the stones left for the current player.
            // The total stones remaining from the current index are `remainingStones`.
            // The opponent will get `solve(index + x, Math.max(m, x))` stones.
            // So, the stones left for the current player from this move will be `remainingStones - solve(index + x, Math.max(m, x))`.
            int stonesLeftForCurrentPlayer = remainingStones - solve(index + x, Math.max(m, x));

            // The current player wants to maximize their total stones obtained.
            // The total stones for the current player in this scenario is `currentMoveStones` (taken in this move)
            // plus whatever they can get from the remaining game after the opponent plays.
            // However, the `solve` function returns the maximum the *current* player can get from that state.
            // So, the current player wants to maximize `currentMoveStones + (stones remaining from current index onwards after opponent plays optimally)`.
            // The opponent plays optimally from `index+x` with `max(m, x)`. `solve(index+x, max(m,x))` is what the opponent gets.
            // The current player gets the total stones from `index` to `n-1`, minus what the opponent gets.
            // So, the current player gets `remainingStones - solve(index + x, Math.max(m, x))`.
            // This is the *total* stones the current player will end up with in this specific branch of the game.
            // We want to maximize this value across all possible moves `x`.
            maxStonesForCurrentPlayer = Math.max(maxStonesForCurrentPlayer, stonesLeftForCurrentPlayer);
        }

        // Store the computed result in the memoization table
        memo[index][m] = maxStonesForCurrentPlayer;
        return maxStonesForCurrentPlayer;
    }
}