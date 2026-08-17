```cpp
// Problem: Stone Game V
// Link: https://leetcode.com/problems/stone-game-v/
//
// Approach:
// This problem can be solved using dynamic programming. The game involves Alice making
// optimal splits to maximize her score. Since the game state is defined by a contiguous
// subarray of stones, we can use DP to store the maximum score Alice can achieve for
// any subarray.
//
// Let dp[i][j] be the maximum score Alice can get from the subarray stoneValue[i...j].
// To calculate dp[i][j], Alice can split the subarray stoneValue[i...j] into two
// non-empty subarrays: stoneValue[i...k] and stoneValue[k+1...j], where i <= k < j.
// Let sum_left be the sum of values in stoneValue[i...k] and sum_right be the sum of
// values in stoneValue[k+1...j].
//
// Bob throws away the row with the maximum sum.
// - If sum_left < sum_right, Bob throws away the right row. Alice gets sum_left, and
//   the game continues with the left row. The score from this split is sum_left + dp[i][k].
// - If sum_left > sum_right, Bob throws away the left row. Alice gets sum_right, and
//   the game continues with the right row. The score from this split is sum_right + dp[k+1][j].
// - If sum_left == sum_right, Alice can choose which row to discard. To maximize her
//   score, she will choose to keep the row that leads to a higher future score.
//   If she discards the right row, her score is sum_left + dp[i][k].
//   If she discards the left row, her score is sum_right + dp[k+1][j].
//   Since sum_left == sum_right, she chooses the maximum of these two. This simplifies
//   to max(sum_left + dp[i][k], sum_right + dp[k+1][j]).
//
// Alice wants to maximize her score over all possible split points 'k'.
// So, dp[i][j] = max(over all i <= k < j) {
//     score_from_split(i, k, j)
// }.
//
// To efficiently calculate the sums of subarrays, we can precompute a prefix sum array.
// prefixSum[x] will store the sum of stoneValue[0...x-1].
// The sum of stoneValue[a...b] can be calculated as prefixSum[b+1] - prefixSum[a].
//
// The base case is when the subarray has only one stone (i.e., j = i). In this case,
// no splits can be made, and Alice's score is 0. So, dp[i][i] = 0.
//
// We can iterate over the length of the subarray (len) from 2 to n, and for each length,
// iterate over all possible start indices (i). The end index j will be i + len - 1.
//
// Time Complexity:
// Calculating prefix sums: O(N), where N is the number of stones.
// DP table calculation: There are O(N^2) states (i, j). For each state, we iterate
// through O(N) possible split points 'k'. Therefore, the time complexity of the DP
// is O(N^3).
//
// Space Complexity:
// For the DP table: O(N^2).
// For the prefix sum array: O(N).
// Total space complexity: O(N^2).

#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int stoneGameV(std::vector<int>& stoneValue) {
        int n = stoneValue.size();

        // If there's only one stone, Alice gets 0 score.
        if (n == 1) {
            return 0;
        }

        // Precompute prefix sums for efficient subarray sum calculation.
        // prefixSum[i] stores the sum of stoneValue[0]...stoneValue[i-1].
        std::vector<long long> prefixSum(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            prefixSum[i + 1] = prefixSum[i] + stoneValue[i];
        }

        // dp[i][j] will store the maximum score Alice can get from subarray stoneValue[i...j].
        std::vector<std::vector<int>> dp(n, std::vector<int>(n, 0));

        // Iterate over the length of the subarray.
        // Length starts from 2 because a subarray of length 1 has 0 score.
        for (int len = 2; len <= n; ++len) {
            // Iterate over all possible start indices for a subarray of current length.
            for (int i = 0; i <= n - len; ++i) {
                // The end index of the current subarray.
                int j = i + len - 1;
                
                // For each subarray stoneValue[i...j], Alice can split it at any point k
                // such that i <= k < j.
                int maxScoreForSubarray = 0;
                for (int k = i; k < j; ++k) {
                    // Calculate the sum of the left subarray stoneValue[i...k].
                    // sum_left = prefixSum[k+1] - prefixSum[i]
                    long long sum_left = prefixSum[k + 1] - prefixSum[i];

                    // Calculate the sum of the right subarray stoneValue[k+1...j].
                    // sum_right = prefixSum[j+1] - prefixSum[k+1]
                    long long sum_right = prefixSum[j + 1] - prefixSum[k + 1];

                    int currentSplitScore = 0;

                    // Bob throws away the row with the maximum value.
                    if (sum_left < sum_right) {
                        // Bob throws away the right row, Alice gets sum_left.
                        // The game continues with the left subarray stoneValue[i...k].
                        currentSplitScore = sum_left + dp[i][k];
                    } else if (sum_left > sum_right) {
                        // Bob throws away the left row, Alice gets sum_right.
                        // The game continues with the right subarray stoneValue[k+1...j].
                        currentSplitScore = sum_right + dp[k + 1][j];
                    } else { // sum_left == sum_right
                        // Alice can choose which row to discard to maximize her score.
                        // If she discards right, she gets sum_left + dp[i][k].
                        // If she discards left, she gets sum_right + dp[k+1][j].
                        // Since sums are equal, she chooses the max of these two.
                        currentSplitScore = std::max(sum_left + dp[i][k], sum_right + dp[k + 1][j]);
                    }
                    
                    // Alice wants to maximize her score over all possible split points 'k'.
                    maxScoreForSubarray = std::max(maxScoreForSubarray, currentSplitScore);
                }
                // Store the maximum score for the subarray stoneValue[i...j].
                dp[i][j] = maxScoreForSubarray;
            }
        }

        // The maximum score Alice can get from the entire row stoneValue[0...n-1].
        return dp[0][n - 1];
    }
};
```