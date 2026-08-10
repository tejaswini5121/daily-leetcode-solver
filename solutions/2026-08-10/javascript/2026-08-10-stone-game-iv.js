// Problem Summary: Alice and Bob take turns removing perfect square numbers of stones from a pile. The player who cannot make a move loses. Determine if Alice wins with optimal play.
// Link: https://leetcode.com/problems/stone-game-iv/
// Approach: This is a typical game theory problem that can be solved using dynamic programming. We can define dp[i] as a boolean value indicating whether the first player (whoever's turn it is) can win with 'i' stones remaining.
// To calculate dp[i], we iterate through all possible perfect squares 's' (1, 4, 9, ...) such that s <= i. If for any 's', the state dp[i-s] is false (meaning the *next* player loses from that state), then the current player can win by moving to state 'i-s'. Therefore, dp[i] would be true.
// If for all possible moves 's', the state dp[i-s] is true (meaning the next player wins from all reachable states), then the current player will lose, and dp[i] will be false.
// The base case is dp[0] = false, as a player with 0 stones cannot make a move and loses.
// Time Complexity: O(n * sqrt(n)). For each number of stones 'i' from 1 to 'n', we iterate through possible square subtractions. The number of perfect squares less than or equal to 'i' is approximately sqrt(i).
// Space Complexity: O(n). We use a DP array of size n+1 to store the win/loss status for each number of stones.
/**
 * @param {number} n
 * @return {boolean}
 */
var winnerSquareGame = function(n) {
    // dp[i] will be true if the current player can win with 'i' stones, false otherwise.
    // Initialize dp array of size n+1. dp[0] is false as a player with 0 stones loses.
    const dp = new Array(n + 1).fill(false);

    // Iterate from 1 stone up to n stones.
    for (let i = 1; i <= n; i++) {
        // Iterate through all possible perfect squares (1, 4, 9, ...) that can be removed.
        // 'j*j' represents the number of stones to remove.
        for (let j = 1; j * j <= i; j++) {
            // If the opponent would lose from the state 'i - (j*j)' stones remaining,
            // then the current player can win by making this move.
            // The opponent loses if dp[i - (j*j)] is false.
            if (!dp[i - (j * j)]) {
                dp[i] = true; // Current player can win.
                break; // Once we find a winning move, we don't need to check further for this 'i'.
            }
        }
    }

    // The result for 'n' stones indicates whether Alice (the first player) wins.
    return dp[n];
};
