/**
 * @summary Given an array of numbers, two players take turns picking numbers from either end.
 * Player 1 starts. Both play optimally. Return true if Player 1 can win (score >= Player 2's score).
 * @link https://leetcode.com/problems/predict-the-winner/
 * @approach This problem can be solved using recursion with memoization (dynamic programming).
 * We define a recursive function that calculates the maximum score difference a player can achieve
 * from a given subarray (defined by start and end indices).
 *
 * The function `maxDiff(i, j)` represents the maximum score Player 1 can get minus Player 2's score,
 * given the subarray `nums[i...j]`.
 *
 * Base Case: If `i == j`, there's only one element left, so the current player takes it, and the
 * score difference is `nums[i]`.
 *
 * Recursive Step:
 * If it's the current player's turn (to maximize their score difference):
 * They can choose `nums[i]` or `nums[j]`.
 * If they choose `nums[i]`: their score increases by `nums[i]`, and the remaining subarray is `nums[i+1...j]`.
 * The problem then becomes for the *next* player to maximize their score difference from `nums[i+1...j]`.
 * So, the current player's net score difference from this choice is `nums[i] - maxDiff(i+1, j)`.
 *
 * If they choose `nums[j]`: their score increases by `nums[j]`, and the remaining subarray is `nums[i...j-1]`.
 * Similarly, the current player's net score difference is `nums[j] - maxDiff(i, j-1)`.
 *
 * The current player will choose the option that maximizes their score difference:
 * `max(nums[i] - maxDiff(i+1, j), nums[j] - maxDiff(i, j-1))`
 *
 * Memoization: To avoid redundant calculations, we use a 2D array `memo` where `memo[i][j]` stores
 * the result of `maxDiff(i, j)`. If `memo[i][j]` is already computed, we return it directly.
 *
 * Finally, we call `maxDiff(0, nums.length - 1)`. If the result is >= 0, Player 1 can win.
 *
 * Time Complexity: O(n^2), where n is the length of the nums array. This is because there are n^2 possible states (i, j)
 * for our memoization table, and each state is computed once.
 * Space Complexity: O(n^2) for the memoization table. The recursion depth can also go up to O(n) in the worst case,
 * contributing to the call stack space, but the memoization table dominates.
 */
var predictTheWinner = function(nums) {
    const n = nums.length;
    // memo[i][j] will store the maximum score difference the current player can achieve
    // when considering the subarray from index i to j.
    const memo = Array(n).fill(null).map(() => Array(n).fill(null));

    /**
     * Calculates the maximum score difference the current player can achieve from subarray nums[i...j].
     * This function represents the score of the current player minus the score of the opponent.
     * @param {number} i - The starting index of the subarray.
     * @param {number} j - The ending index of the subarray.
     * @returns {number} The maximum score difference.
     */
    function maxDiff(i, j) {
        // Base case: If the subarray has only one element, the current player takes it.
        if (i === j) {
            return nums[i];
        }

        // If the result for this subproblem is already computed, return it.
        if (memo[i][j] !== null) {
            return memo[i][j];
        }

        // Option 1: The current player picks the element at index i.
        // Their score increases by nums[i]. The game continues with the subarray nums[i+1...j].
        // The next player will play optimally on nums[i+1...j], aiming to maximize THEIR score.
        // So, the score difference from the perspective of the *current* player is nums[i] minus
        // the maximum difference the *next* player can achieve from nums[i+1...j].
        const pickLeft = nums[i] - maxDiff(i + 1, j);

        // Option 2: The current player picks the element at index j.
        // Their score increases by nums[j]. The game continues with the subarray nums[i...j-1].
        // Similar to option 1, the score difference is nums[j] minus the max difference the next player gets.
        const pickRight = nums[j] - maxDiff(i, j - 1);

        // The current player chooses the option that maximizes their score difference.
        memo[i][j] = Math.max(pickLeft, pickRight);

        return memo[i][j];
    }

    // Call the recursive function for the entire array.
    // If the maximum difference Player 1 can achieve is non-negative, Player 1 wins.
    return maxDiff(0, n - 1) >= 0;
};
```