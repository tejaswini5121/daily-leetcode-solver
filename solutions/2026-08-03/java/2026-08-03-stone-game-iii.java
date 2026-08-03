/**
 * Problem Summary: Alice and Bob play a game taking stones from a row. Players can take 1, 2, or 3 stones from the front. The goal is to maximize one's own score. Alice goes first.
 * Link: https://leetcode.com/problems/stone-game-iii/
 *
 * Approach: This problem can be solved using dynamic programming with a game theory approach.
 * We want to determine the maximum score difference a player can achieve from a given starting position.
 * Let dp[i] represent the maximum score difference the current player can achieve if the game starts with stones from index i to the end.
 * The current player can choose to take 1, 2, or 3 stones.
 * If the current player takes k stones (1 <= k <= 3), their score increases by the sum of stones[i] to stones[i+k-1].
 * The opponent will then play optimally on the remaining stones starting from index i+k. The opponent's maximum score difference from that point will be dp[i+k].
 * Since dp[i+k] represents the *opponent's* advantage, the *current* player's advantage from taking k stones will be (sum of taken stones) - dp[i+k].
 * The current player will choose k to maximize this advantage.
 *
 * dp[i] = max(sum(stoneValue[i...i+k-1]) - dp[i+k]) for k in {1, 2, 3}
 *
 * Base Cases:
 * If i >= n (no stones left), the score difference is 0.
 * For indices near the end (n-1, n-2, n-3), we need to handle the boundaries carefully, ensuring we don't access out of bounds.
 *
 * To make calculations easier, we can use a suffix sum array. `suffixSum[i]` will store the sum of `stoneValue[i]` to `stoneValue[n-1]`.
 * Then, `sum(stoneValue[i...i+k-1])` can be calculated as `suffixSum[i] - suffixSum[i+k]` (if i+k < n) or `suffixSum[i]` (if i+k >= n).
 *
 * For the DP calculation, we iterate from `n-1` down to `0`.
 *
 * `dp[i]` will store the maximum score the current player can get *more than the opponent* if the game starts at index `i`.
 *
 * dp[i] = max(
 *     stoneValue[i] - dp[i+1],   // Take 1 stone
 *     stoneValue[i] + stoneValue[i+1] - dp[i+2], // Take 2 stones
 *     stoneValue[i] + stoneValue[i+1] + stoneValue[i+2] - dp[i+3] // Take 3 stones
 * )
 *
 * We need to handle boundary conditions for dp[i+1], dp[i+2], dp[i+3]. If `i+k >= n`, the opponent gets 0 additional score from that point, so `dp[i+k]` is effectively 0.
 *
 * After computing dp[0], which represents Alice's maximum score advantage over Bob:
 * If dp[0] > 0, Alice wins.
 * If dp[0] < 0, Bob wins.
 * If dp[0] == 0, it's a tie.
 *
 * Time Complexity: O(n) where n is the number of stones. We iterate through the stones once to compute suffix sums and once again for DP. Each DP state calculation is O(1).
 * Space Complexity: O(n) for the suffix sum array and the DP array.
 */
class Solution {
    public String stoneGameIII(int[] stoneValue) {
        int n = stoneValue.length;

        // dp[i] will store the maximum score difference the current player can achieve
        // if the game starts with stones from index i to the end.
        // The value is current_player_score - opponent_score.
        int[] dp = new int[n + 1]; // dp[n] is the base case for 0 stones remaining.

        // Iterate from the end of the stones array backwards.
        // This is because to calculate dp[i], we need values of dp[i+1], dp[i+2], dp[i+3].
        for (int i = n - 1; i >= 0; i--) {
            int currentStoneSum = 0;
            // The current player can take 1, 2, or 3 stones.
            // For each choice (k stones), calculate the potential score difference.
            // The potential score difference is:
            // (sum of stones taken) - (maximum score difference the opponent can achieve from the remaining stones)
            // dp[i+k] represents the opponent's maximum score difference from index i+k.
            // So, current_player_score - opponent_score = (stones taken) - dp[i+k].
            // We want to maximize this value for the current player.
            int maxDiff = Integer.MIN_VALUE;

            for (int k = 1; k <= 3 && i + k <= n; k++) {
                // Sum of stones from index i to i+k-1
                currentStoneSum += stoneValue[i + k - 1];

                // Calculate the difference if the current player takes k stones.
                // The opponent will play from index i+k. Their max difference is dp[i+k].
                // So, current player's gain is currentStoneSum, and opponent's gain from the rest is dp[i+k].
                // The current player's net advantage is currentStoneSum - dp[i+k].
                int diff = currentStoneSum - dp[i + k];

                // Update maxDiff if this choice is better for the current player.
                maxDiff = Math.max(maxDiff, diff);
            }
            // Store the maximum achievable score difference for the current player at index i.
            dp[i] = maxDiff;
        }

        // dp[0] represents Alice's maximum score difference over Bob when starting the game.
        // If dp[0] > 0, Alice has a higher score.
        // If dp[0] < 0, Bob has a higher score.
        // If dp[0] == 0, it's a tie.
        if (dp[0] > 0) {
            return "Alice";
        } else if (dp[0] < 0) {
            return "Bob";
        } else {
            return "Tie";
        }
    }
}
