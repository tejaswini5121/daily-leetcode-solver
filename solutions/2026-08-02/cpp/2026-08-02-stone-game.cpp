// Problem: Stone Game
// Link: https://leetcode.com/problems/stone-game/
//
// Summary: In a game with an even number of stone piles, Alice and Bob take turns picking piles from either end.
// Alice goes first, and the player with more stones wins. The total number of stones is odd.
//
// Approach:
// This problem can be solved using dynamic programming. We want to find the maximum difference in score Alice can achieve over Bob.
// Let dp[i][j] represent the maximum difference in score the current player can achieve over the other player
// when considering the subarray of piles from index i to j (inclusive).
//
// The base cases are when i == j. In this case, the current player takes the only pile, and the difference is piles[i].
//
// For the recursive step, dp[i][j] is calculated as follows:
// The current player has two choices:
// 1. Take piles[i]: The score difference would be piles[i] - dp[i+1][j] (subtracting what the *other* player can achieve from the remaining piles).
// 2. Take piles[j]: The score difference would be piles[j] - dp[i][j-1] (subtracting what the *other* player can achieve from the remaining piles).
// The current player will choose the option that maximizes their score difference, so:
// dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])
//
// The DP table is filled for increasing lengths of subarrays (len = 1 to n), and for each length, for all possible starting indices i.
// The final answer is dp[0][n-1], which represents the maximum score difference Alice (the first player) can achieve over Bob.
// Since Alice wins if she has more stones, and the total sum is odd (no ties), Alice wins if dp[0][n-1] > 0.
//
// It turns out that for this specific problem, Alice always wins. This is because she can choose to take all the odd-indexed piles or all the even-indexed piles.
// Since the total sum is odd, one of these sets will have a greater sum. Alice can guarantee she gets the larger sum by choosing her first move appropriately.
// However, the DP approach correctly models optimal play and demonstrates this.
//
// Time Complexity: O(n^2), where n is the number of piles. We fill an n x n DP table.
// Space Complexity: O(n^2) for the DP table.
//
// NOTE: A simpler mathematical proof shows Alice always wins. Alice can choose to take either the odd-indexed piles or the even-indexed piles on her first move. She can guarantee she picks the parity of piles that sum to more. If she picks an even-indexed pile on her first turn, all subsequent piles she can pick are also even-indexed relative to the original array. Similarly, if she picks an odd-indexed pile, all subsequent piles she can pick are odd-indexed. The total sum of stones is odd, so the sum of stones in odd-indexed piles and even-indexed piles cannot be equal. Alice can always ensure she gets the larger sum. Therefore, Alice always wins.
// The DP solution below implements the general optimal strategy which also leads to Alice winning.
class Solution {
public:
    bool stoneGame(vector<int>& piles) {
        int n = piles.size();
        // dp[i][j] will store the maximum difference in score the current player can achieve
        // over the other player when considering the subarray of piles from index i to j.
        vector<vector<int>> dp(n, vector<int>(n, 0));

        // Base case: For a subarray of length 1 (i == j), the current player takes the only pile.
        // The difference is the value of that pile.
        for (int i = 0; i < n; ++i) {
            dp[i][i] = piles[i];
        }

        // Iterate over the length of the subarray, from 2 up to n.
        for (int len = 2; len <= n; ++len) {
            // Iterate over all possible starting indices 'i' for a subarray of current 'len'.
            for (int i = 0; i <= n - len; ++i) {
                // The ending index 'j' is determined by 'i' and 'len'.
                int j = i + len - 1;

                // The current player has two choices:
                // 1. Take the pile at index 'i': The score difference will be piles[i] minus
                //    the maximum difference the *other* player can achieve from the remaining piles (i+1 to j).
                // 2. Take the pile at index 'j': The score difference will be piles[j] minus
                //    the maximum difference the *other* player can achieve from the remaining piles (i to j-1).
                // The current player plays optimally to maximize their score difference.
                dp[i][j] = max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1]);
            }
        }

        // dp[0][n-1] represents the maximum score difference Alice (the first player)
        // can achieve over Bob for the entire array of piles.
        // Since the total sum of stones is odd, there are no ties.
        // Alice wins if her score difference is positive.
        return dp[0][n - 1] > 0;

        // As per the mathematical analysis, Alice always wins this game.
        // The optimal strategy guarantees her at least one more stone than Bob.
        // Therefore, we could simply return 'true' without computing the DP.
        // return true;
    }
};
