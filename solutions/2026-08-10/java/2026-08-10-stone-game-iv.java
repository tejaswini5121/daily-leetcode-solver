// Problem Summary: Alice and Bob play a game removing square numbers of stones. Alice wins if she can make a move such that Bob loses from the resulting state.
// Link: https://leetcode.com/problems/stone-game-iv/
// Approach: This is a game theory problem that can be solved using dynamic programming. We can define dp[i] as a boolean indicating whether the first player wins with i stones.
// A player wins if they can make a move to a state where the *other* player loses.
// Therefore, dp[i] is true if there exists a perfect square 'k*k' such that i - k*k >= 0 and dp[i - k*k] is false (meaning the next player loses from that state).
// We iterate through possible moves (perfect squares) for each number of stones 'i'.
// Time Complexity: O(n * sqrt(n)). For each 'i' from 1 to n, we iterate through possible square subtractions. The number of perfect squares less than 'i' is approximately sqrt(i).
// Space Complexity: O(n) to store the DP table.
class Solution {
    public boolean winnerSquareGame(int n) {
        // dp[i] will be true if the first player can win with i stones, false otherwise.
        boolean[] dp = new boolean[n + 1];

        // Base case: With 0 stones, the current player has no moves and loses.
        // So dp[0] is implicitly false (default value for boolean array).

        // Iterate through each number of stones from 1 to n.
        for (int i = 1; i <= n; i++) {
            // For each number of stones 'i', check all possible moves.
            // A move consists of removing a perfect square number of stones.
            // Iterate through all possible perfect squares 'j*j' such that j*j <= i.
            for (int j = 1; j * j <= i; j++) {
                // If we can remove j*j stones, the remaining stones will be i - j*j.
                // If the *next* player (who faces i - j*j stones) *loses*,
                // then the *current* player wins by making this move.
                // dp[i - j*j] == false means the player whose turn it is with i - j*j stones loses.
                if (!dp[i - j * j]) {
                    // If we find such a move, then the current player can win with 'i' stones.
                    dp[i] = true;
                    // Once we find a winning move, we don't need to check other moves for 'i'.
                    break;
                }
            }
        }

        // The result for Alice (the first player) starting with 'n' stones is stored in dp[n].
        return dp[n];
    }
}