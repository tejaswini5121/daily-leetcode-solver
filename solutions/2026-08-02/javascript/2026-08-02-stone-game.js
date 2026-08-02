/**
 * @param {number[]} piles
 * @return {boolean}
 */

/*
Problem Summary: Alice and Bob play a game with an even number of stone piles. They take turns taking a pile from either end. The player with more stones wins. Alice goes first.
Link: https://leetcode.com/problems/stone-game/

Approach:
This is a classic game theory problem that can be solved using dynamic programming. Since the total number of stones is odd and there are an even number of piles, there will always be a winner, and no ties. Alice goes first.

The core idea is to determine the maximum difference in scores Alice can achieve over Bob. If Alice can guarantee a positive difference, she wins.

We can use a 2D DP array `dp[i][j]` to store the maximum difference in scores a player can achieve when considering the piles from index `i` to `j` (inclusive).

The state transition would be:
When it's a player's turn to pick from `piles[i...j]`:
1. If the player picks `piles[i]`, their score increases by `piles[i]`, and the remaining piles are `piles[i+1...j]`. The opponent will then play optimally on these remaining piles, aiming to maximize *their* score difference. From the current player's perspective, this means their score difference will be `piles[i] - dp[i+1][j]`.
2. If the player picks `piles[j]`, their score increases by `piles[j]`, and the remaining piles are `piles[i...j-1]`. The opponent will then play optimally on these remaining piles. From the current player's perspective, this means their score difference will be `piles[j] - dp[i][j-1]`.

The player will choose the move that maximizes their score difference:
`dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])`

Base cases:
- When `i == j` (a single pile), the player takes that pile, and the difference is `piles[i]`. So, `dp[i][i] = piles[i]`.

The DP table will be filled diagonally, starting with length 1 subarrays, then length 2, and so on, up to the full array.

Since Alice starts, we are interested in `dp[0][n-1]`, which represents the maximum score difference Alice can achieve over Bob for the entire array of piles. If `dp[0][n-1] > 0`, Alice wins.

However, a key observation for this specific problem is that because the number of piles is even and Alice goes first, Alice can always choose to take either all the odd-indexed piles or all the even-indexed piles.
Let's say Alice decides to take all the odd-indexed piles (0-indexed: 0, 2, 4, ...). Bob will be left with the even-indexed piles (1, 3, 5, ...).
Similarly, Alice can decide to take all the even-indexed piles (1, 3, 5, ...). Bob will be left with the odd-indexed piles (0, 2, 4, ...).

Since Alice can choose her strategy beforehand and play optimally, she can always ensure she gets more stones than Bob. The total sum of stones is odd, so there are no ties. Therefore, Alice will always win.

This means the answer is always true. The problem is designed to test if you recognize this game theory aspect rather than just implementing DP.
If we were to implement the DP, it would look like this:

Let n be the number of piles.
Initialize dp[n][n] with 0.

For length = 1 to n:
  For i = 0 to n - length:
    j = i + length - 1
    If length == 1:
      dp[i][j] = piles[i]
    Else:
      dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])

Return dp[0][n-1] > 0.

Given the problem constraints and the nature of the game, Alice *always* wins. This is because she can choose to take either all the piles at even indices or all the piles at odd indices. She can calculate the total sum of stones at even indices and the total sum of stones at odd indices and choose the strategy that yields more stones. Since the total sum of stones is odd, one of these sums must be greater than the other.

Time Complexity: O(1) - Because the problem guarantees Alice wins due to the game's structure. If we were to implement the DP solution: O(n^2), where n is the number of piles.
Space Complexity: O(1) - Because the problem guarantees Alice wins. If we were to implement the DP solution: O(n^2) for the DP table.

Given the context of competitive programming problems, sometimes there's a trick or a mathematical property that simplifies the solution significantly. This problem is one such case. Alice can always win.
*/

var stoneGame = function(piles) {
    // In this game, Alice always wins.
    // Here's why:
    // The total number of piles is even (let's say 2k).
    // Alice goes first.
    // Alice can choose to take only piles at even indices (0, 2, 4, ...)
    // OR Alice can choose to take only piles at odd indices (1, 3, 5, ...).
    //
    // Consider two scenarios:
    // 1. Alice aims for even-indexed piles, Bob gets odd-indexed piles.
    // 2. Alice aims for odd-indexed piles, Bob gets even-indexed piles.
    //
    // Alice can calculate the sum of stones at all even indices and the sum of stones
    // at all odd indices.
    //
    // Let S_even = sum of piles[i] where i is even.
    // Let S_odd = sum of piles[i] where i is odd.
    //
    // Total stones = S_even + S_odd.
    // The problem states the total sum is odd, so S_even != S_odd.
    //
    // Alice can choose to target the set of piles (either even-indexed or odd-indexed)
    // that has a larger sum.
    //
    // For example, if S_even > S_odd:
    // Alice strategy:
    // On her first turn, if piles[0] is part of the "even" set she wants and
    // piles[n-1] is part of the "odd" set Bob would get, she takes piles[0].
    // This leaves piles[1...n-1]. Bob now has to pick from piles[1] or piles[n-1].
    //
    // The key is that Alice, by making her initial choice (take from left or right),
    // dictates which "parity" of pile index she will eventually have access to on
    // subsequent turns.
    //
    // More formally:
    // Alice can always ensure she gets either all the piles originally at even indices
    // or all the piles originally at odd indices.
    //
    // Example: piles = [5, 3, 4, 5]
    // Even indices: piles[0]=5, piles[2]=4. Total = 9.
    // Odd indices: piles[1]=3, piles[3]=5. Total = 8.
    //
    // Alice can choose to target the even-indexed piles (sum 9).
    // Turn 1 (Alice): She wants the 5 at index 0 or the 4 at index 2.
    // If she takes piles[0] (5), remaining: [3, 4, 5]. Bob's turn.
    //   Bob can take 3 or 5.
    //   If Bob takes 3, remaining: [4, 5]. Alice wants the 4 (even index). Alice takes 4. Alice's total: 5+4=9. Bob's total: 3+5=8. Alice wins.
    //   If Bob takes 5, remaining: [3, 4]. Alice wants the 4 (even index). Alice takes 4. Alice's total: 5+4=9. Bob's total: 5+3=8. Alice wins.
    //
    // If Alice takes piles[3] (5) initially, remaining: [5, 3, 4]. Bob's turn.
    //   Bob can take 5 or 4.
    //   If Bob takes 5, remaining: [3, 4]. Alice wants the 4. Alice takes 4. Alice's total: 5+4=9. Bob's total: 5+3=8. Alice wins.
    //   If Bob takes 4, remaining: [5, 3]. Alice wants the 5. Alice takes 5. Alice's total: 5+5=10. Bob's total: 4+3=7. Alice wins.
    //
    // In all optimal play scenarios, Alice can secure more stones.
    // Therefore, Alice always wins.

    return true;

    /*
    // This is the DP approach if one were to solve it without the game theory insight.
    // It's more complex than needed for this specific LeetCode problem.

    const n = piles.length;
    // dp[i][j] will store the maximum difference in score the current player
    // can achieve over the other player when considering piles from index i to j.
    // The current player is the one whose turn it is to pick from piles[i...j].
    const dp = Array(n).fill(0).map(() => Array(n).fill(0));

    // Base case: When there's only one pile, the current player takes it.
    for (let i = 0; i < n; i++) {
        dp[i][i] = piles[i];
    }

    // Fill the dp table diagonally.
    // 'len' represents the length of the subarray of piles being considered.
    for (let len = 2; len <= n; len++) {
        // 'i' is the starting index of the subarray.
        for (let i = 0; i <= n - len; i++) {
            // 'j' is the ending index of the subarray.
            const j = i + len - 1;

            // Option 1: The current player takes the pile at index 'i'.
            // Their score increases by piles[i].
            // The opponent then plays on the remaining piles from i+1 to j.
            // The opponent will try to maximize their score, meaning they will
            // achieve a difference of dp[i+1][j] from their perspective.
            // From the current player's perspective, this difference is piles[i] - dp[i+1][j].
            const takeLeft = piles[i] - dp[i + 1][j];

            // Option 2: The current player takes the pile at index 'j'.
            // Their score increases by piles[j].
            // The opponent then plays on the remaining piles from i to j-1.
            // From the current player's perspective, this difference is piles[j] - dp[i][j-1].
            const takeRight = piles[j] - dp[i][j - 1];

            // The current player chooses the option that maximizes their score difference.
            dp[i][j] = Math.max(takeLeft, takeRight);
        }
    }

    // dp[0][n-1] stores the maximum score difference Alice can achieve over Bob
    // for the entire array of piles. If this difference is positive, Alice wins.
    return dp[0][n - 1] > 0;
    */
};
```