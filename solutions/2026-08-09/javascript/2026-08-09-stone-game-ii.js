// /**
//  * @param {number[]} piles
//  * @return {number}
//  */
// /*
//  Problem: Stone Game II
//  Link: https://leetcode.com/problems/stone-game-ii/
//  Summary: Alice and Bob play a game with piles of stones. On each turn, a player can take X piles from the front (1 <= X <= 2M, where M is updated to max(M, X)). Alice starts, and both play optimally to maximize their stones. Return Alice's maximum possible stones.
//
//  Approach:
//  This problem can be solved using dynamic programming with memoization. The state of the game can be defined by the current starting index `i` of the piles and the current value of `M`.
//  We define a recursive function `dp(i, m)` that returns the maximum number of stones the current player can get starting from pile `i` with the current `M` value.
//  The base case is when `i` is out of bounds, in which case the current player gets 0 stones.
//  For a given state `(i, m)`, the current player can choose to take `x` piles, where `1 <= x <= 2 * m`.
//  If the current player takes `x` piles, they get `sum(piles[i...i+x-1])` stones. The remaining piles start from index `i + x`, and the new `M` value becomes `max(m, x)`.
//  The opponent will then play optimally from the new state `(i + x, max(m, x))`. The opponent will try to maximize their stones, which means they will get `dp(i + x, max(m, x))` stones.
//  Therefore, the current player's score for taking `x` piles is `sum(piles[i...i+x-1]) - dp(i + x, max(m, x))`. The current player wants to maximize this score.
//  The `dp` function will iterate through all possible values of `x`, calculate the score for each `x`, and return the maximum score.
//  To optimize sum calculations, we can use prefix sums.
//  We use memoization (a 2D array or map) to store the results of `dp(i, m)` to avoid redundant calculations.
//
//  Time Complexity:
//  The state is defined by `(i, m)`.
//  `i` can range from 0 to `n` (where `n` is the number of piles).
//  `m` can range from 1 up to `n/2` (since `2M` cannot exceed `n` if we want to take at least one pile). A more precise upper bound for `M` is `n`. For example, if `n=100`, `M` can go up to 50. If we take `X=100` piles, `M` becomes 100.
//  So, the number of states is approximately O(n * n).
//  For each state, we iterate through possible values of `x`, which can be up to `2 * m`. In the worst case, `2 * m` can be up to `n`.
//  Therefore, the time complexity is roughly O(n^3).
//  With prefix sums, calculating the sum of piles takes O(1).
//  So, the overall time complexity is O(n^3).
//
//  Space Complexity:
//  The memoization table `memo` will store results for O(n * n) states.
//  Therefore, the space complexity is O(n^2).
// */
//
// // Helper function to calculate prefix sums
// const calculatePrefixSums = (piles) => {
//     const n = piles.length;
//     const prefixSum = new Array(n + 1).fill(0);
//     for (let i = 0; i < n; i++) {
//         prefixSum[i + 1] = prefixSum[i] + piles[i];
//     }
//     return prefixSum;
// };
//
// // Helper function to get the sum of stones in a range [start, end)
// const getSum = (prefixSum, start, end) => {
//     return prefixSum[end] - prefixSum[start];
// };
//
// const stoneGameII = (piles) => {
//     const n = piles.length;
//     // Memoization table: memo[i][m] stores the maximum stones the current player can get
//     // starting from pile i with M = m. Initialize with -1 to indicate not computed.
//     // M can go up to n, so we need a size of n+1 for m.
//     const memo = Array(n).fill(null).map(() => Array(n + 1).fill(-1));
//
//     // Calculate prefix sums for efficient sum calculation
//     const prefixSum = calculatePrefixSums(piles);
//
//     // Recursive function with memoization
//     const dp = (i, m) => {
//         // If the result is already computed, return it
//         if (memo[i][m] !== -1) {
//             return memo[i][m];
//         }
//
//         // Base case: If there are no piles left, the current player gets 0 stones.
//         // This condition is implicitly handled by the loop bounds. If i >= n, the loop for x won't run.
//         // However, it's good practice to consider it. If i is already beyond the last pile, it means
//         // the previous player took all the stones.
//         if (i >= n) {
//             return 0;
//         }
//
//         // If the remaining piles are fewer than or equal to 2*m, the current player can take all of them.
//         // This is an optimization and also a base case for when the current player can win regardless of opponent's play.
//         if (n - i <= 2 * m) {
//             memo[i][m] = getSum(prefixSum, i, n);
//             return memo[i][m];
//         }
//
//         // Initialize the maximum stones the current player can get to a very small number.
//         let maxStones = 0;
//
//         // Iterate through all possible numbers of piles the current player can take (X)
//         // X must be at least 1 and at most 2 * m.
//         for (let x = 1; x <= 2 * m; x++) {
//             // Calculate the number of stones the current player gets by taking x piles.
//             const currentGains = getSum(prefixSum, i, i + x);
//
//             // The opponent will play from the next state: starting index i + x, and new M = max(m, x).
//             // The opponent will try to maximize their stones, so they will get dp(i + x, Math.max(m, x)) stones.
//             // The current player's net gain for this move is currentGains minus what the opponent gets.
//             // Since dp(i, m) returns the maximum stones the *current* player can get, we need to think about the total stones.
//             // The total stones from index i onwards is getSum(prefixSum, i, n).
//             // If the current player takes `currentGains`, the opponent will get `dp(i + x, Math.max(m, x))` from the *remaining* piles.
//             // The current player wants to maximize their score.
//             // The opponent will play optimally to maximize their score from `i+x`.
//             // The total stones remaining from index `i` is `getSum(prefixSum, i, n)`.
//             // If the current player takes `currentGains`, the opponent will get `dp(i + x, Math.max(m, x))`.
//             // The total score of the current player is `currentGains + (total_stones_from_i_onwards - currentGains - opponent_score)`.
//             // This seems complicated. Let's redefine `dp(i, m)` as the maximum stones the FIRST player can get from piles `i` to `n-1` given `M=m`.
//             // Then, the current player's score by taking `x` piles is `currentGains + (total_stones_from_i+x_onwards - dp(i+x, new_m))`.
//             // No, the DP state should represent the maximum difference the current player can achieve.
//             // A simpler approach for min-max games is to define `dp(i, m)` as the maximum score the *current player* can obtain *from this point onwards*.
//             // This implies that the total stones available from pile `i` onwards is `sum(piles[i...n-1])`.
//             // If the current player takes `x` piles (gaining `currentGains`), the opponent will get `dp(i+x, max(m, x))` from the remaining piles.
//             // The current player's final score will be `currentGains + (total_stones_from_i_onwards - currentGains - opponent_score)`.
//             // This is equivalent to `currentGains + (total_stones_from_i_onwards - (currentGains + opponent_score))`.
//             // A cleaner DP definition: `dp(i, m)` = the maximum number of stones the current player can get starting from pile `i` with M = `m`.
//             // The total stones from index `i` to `n-1` is `S_i = getSum(prefixSum, i, n)`.
//             // If the current player takes `x` piles, they get `currentGains = getSum(prefixSum, i, i+x)`.
//             // The remaining stones are `S_{i+x} = getSum(prefixSum, i+x, n)`.
//             // The opponent will play from `i+x` with `new_m = max(m, x)`, and get `dp(i+x, new_m)` stones.
//             // The current player gets `currentGains` and whatever is left after the opponent plays from `i+x`.
//             // The total stones available from `i` are `getSum(prefixSum, i, n)`.
//             // If current player takes `currentGains`, opponent gets `dp(i+x, max(m,x))`.
//             // Current player's score = `currentGains` + (Total stones from `i+x` - Opponent's score from `i+x`)
//             // This is `currentGains + (getSum(prefixSum, i+x, n) - dp(i+x, max(m,x)))`.
//
//             const nextM = Math.max(m, x);
//             // We want to maximize the current player's score.
//             // The current player takes `currentGains`.
//             // The *opponent* will play from `i + x` with `nextM` and get `dp(i + x, nextM)` stones from the remaining piles.
//             // The total stones available from `i` is `getSum(prefixSum, i, n)`.
//             // If the current player gets `currentGains`, the opponent gets `dp(i + x, nextM)`.
//             // The current player's score is `currentGains` + (total stones from `i+x` onwards - opponent's score from `i+x`).
//             // Which is `currentGains + (getSum(prefixSum, i+x, n) - dp(i+x, nextM))`.
//             // This is equivalent to: `getSum(prefixSum, i, n) - dp(i+x, nextM)`.
//             // This means the current player wants to minimize the stones the *next* player gets.
//             // Let `dp(i, m)` be the maximum score the current player can get from piles `i` to `n-1` given M = `m`.
//             // If the current player takes `x` piles, they get `currentGains = getSum(prefixSum, i, i+x)`.
//             // The total stones available from `i` onwards is `getSum(prefixSum, i, n)`.
//             // The opponent will play from `i+x` with `new_m = max(m, x)`. The opponent will get `dp(i+x, new_m)` stones.
//             // The current player's score is `currentGains` + (total stones from `i` - currentGains - opponent's score).
//             // This is `currentGains` + `getSum(prefixSum, i+x, n)` - `dp(i+x, new_m)`.
//             // So, `dp(i, m) = max over x of (getSum(prefixSum, i, i+x) + getSum(prefixSum, i+x, n) - dp(i+x, max(m, x)))`.
//             // This simplifies to: `dp(i, m) = max over x of (getSum(prefixSum, i, n) - dp(i+x, max(m, x)))`.
//             // This form implies that the current player wants to maximize their score by minimizing what the *next* player gets.
//
//             const stonesTakenByCurrentPlayer = getSum(prefixSum, i, i + x);
//             const remainingStonesIfOpponentPlaysOptimally = dp(i + x, nextM);
//             const totalStonesFromCurrentIndex = getSum(prefixSum, i, n);
//
//             // The score for the current player for this choice of x is:
//             // (Stones taken by current player) + (Total stones from i+x onwards - what the opponent gets from i+x onwards)
//             // This is `stonesTakenByCurrentPlayer + (getSum(prefixSum, i+x, n) - remainingStonesIfOpponentPlaysOptimally)`.
//             // Let's consider the total stones from `i` onwards: `totalStonesFromCurrentIndex`.
//             // If the current player takes `stonesTakenByCurrentPlayer`, the opponent will get `remainingStonesIfOpponentPlaysOptimally` from the remaining piles.
//             // So the current player's score is `stonesTakenByCurrentPlayer` + (total stones from `i+x` onwards - `remainingStonesIfOpponentPlaysOptimally`).
//             // This can be rewritten as: `totalStonesFromCurrentIndex - remainingStonesIfOpponentPlaysOptimally`.
//             // This is because the current player takes some stones, and the opponent plays optimally from the rest.
//             // So, the current player aims to leave the minimum possible for the opponent.
//
//             // The score the current player gets if they choose to take `x` piles is:
//             // `currentGains` + (total stones from `i+x` onwards - `dp(i+x, nextM)`), where `dp(i+x, nextM)` is the max score the *next* player gets from `i+x`.
//             // This implies that `dp(i, m)` should return the maximum score the *current* player can get.
//             // If current player takes `x` piles:
//             // Their score is `currentGains = getSum(prefixSum, i, i+x)`.
//             // The opponent will play from `i+x` with `nextM`. The opponent will get `dp(i+x, nextM)`.
//             // The total stones from `i` onwards is `getSum(prefixSum, i, n)`.
//             // Alice's score = `currentGains` + (Total stones from `i+x` onwards - Opponent's score from `i+x`)
//             // Alice's score = `currentGains` + `getSum(prefixSum, i+x, n)` - `dp(i+x, nextM)`
//             // Alice wants to maximize this.
//
//             // The current player's score in this scenario is the stones they take (`stonesTakenByCurrentPlayer`)
//             // plus the stones they *can* get from the remaining piles after the opponent plays optimally.
//             // The total stones available from index `i+x` onwards is `getSum(prefixSum, i+x, n)`.
//             // The opponent will play from `i+x` with `nextM` and get `dp(i+x, nextM)`.
//             // So, the current player will get `getSum(prefixSum, i+x, n) - dp(i+x, nextM)` from the piles starting at `i+x`.
//             // The total score for the current player for this move is `stonesTakenByCurrentPlayer + (getSum(prefixSum, i+x, n) - dp(i+x, nextM))`.
//             const scoreForThisMove = stonesTakenByCurrentPlayer + (getSum(prefixSum, i+x, n) - remainingStonesIfOpponentPlaysOptimally);
//
//             // Update maxStones for the current player
//             maxStones = Math.max(maxStones, scoreForThisMove);
//         }
//
//         // Store the computed result in the memoization table
//         memo[i][m] = maxStones;
//         return maxStones;
//     };
//
//     // Alice starts the game from pile 0 with M = 1.
//     return dp(0, 1);
// };
//
// // Example Usage:
// // const piles1 = [2, 7, 9, 4, 4];
// // console.log(stoneGameII(piles1)); // Output: 10
// //
// // const piles2 = [1, 2, 3, 4, 5, 100];
// // console.log(stoneGameII(piles2)); // Output: 104
```
// /**
//  * @param {number[]} piles
//  * @return {number}
//  */
/*
 Problem: Stone Game II
 Link: https://leetcode.com/problems/stone-game-ii/
 Summary: Alice and Bob play a game with piles of stones. On each turn, a player can take X piles from the front (1 <= X <= 2M, where M is updated to max(M, X)). Alice starts, and both play optimally to maximize their stones. Return Alice's maximum possible stones.

 Approach:
 This problem can be solved using dynamic programming with memoization. The state of the game can be defined by the current starting index `i` of the piles and the current value of `M`.
 We define a recursive function `dp(i, m)` that returns the maximum number of stones the current player can get starting from pile `i` with the current `M` value.
 The base case is when `i` is out of bounds, in which case the current player gets 0 stones.
 For a given state `(i, m)`, the current player can choose to take `x` piles, where `1 <= x <= 2 * m`.
 If the current player takes `x` piles, they get `sum(piles[i...i+x-1])` stones. The remaining piles start from index `i + x`, and the new `M` value becomes `max(m, x)`.
 The opponent will then play optimally from the new state `(i + x, max(m, x))`. The opponent will try to maximize their stones, which means they will get `dp(i + x, max(m, x))` stones.
 The current player's score for taking `x` piles is `sum(piles[i...i+x-1])` + (total stones remaining from `i+x` onwards - stones opponent gets from `i+x` onwards).
 This can be expressed as: `getSum(prefixSum, i, i+x) + (getSum(prefixSum, i+x, n) - dp(i+x, max(m, x)))`.
 This is equivalent to `getSum(prefixSum, i, n) - dp(i+x, max(m, x))`.
 So, the current player wants to maximize `getSum(prefixSum, i, n) - dp(i+x, max(m, x))`, which means they want to minimize `dp(i+x, max(m, x))`.
 The `dp` function will iterate through all possible values of `x`, calculate the score for each `x`, and return the maximum score.
 To optimize sum calculations, we can use prefix sums.
 We use memoization (a 2D array) to store the results of `dp(i, m)` to avoid redundant calculations.

 Time Complexity:
 The state is defined by `(i, m)`.
 `i` can range from 0 to `n` (where `n` is the number of piles).
 `m` can range from 1 up to `n` (a loose upper bound, as `2*m` cannot exceed `n` to make progress, but `m` itself can grow). A tighter bound is `m` up to `n/2 + 1` approximately.
 So, the number of states is O(n^2).
 For each state `(i, m)`, we iterate through possible values of `x`, which can be up to `2 * m`. In the worst case, `2 * m` can be up to `n`.
 Therefore, the time complexity is roughly O(n^3).
 With prefix sums, calculating the sum of piles takes O(1).
 So, the overall time complexity is O(n^3).

 Space Complexity:
 The memoization table `memo` will store results for O(n^2) states.
 Therefore, the space complexity is O(n^2).
*/

// Helper function to calculate prefix sums
const calculatePrefixSums = (piles) => {
    const n = piles.length;
    const prefixSum = new Array(n + 1).fill(0);
    // prefixSum[k] will store the sum of piles[0] to piles[k-1]
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + piles[i];
    }
    return prefixSum;
};

// Helper function to get the sum of stones in a range [start, end)
// This means sum of piles[start] to piles[end-1]
const getSum = (prefixSum, start, end) => {
    // If end is beyond array bounds, it should be n.
    // But in our context, end will be at most n.
    if (start >= end) return 0; // No piles in range
    return prefixSum[end] - prefixSum[start];
};

/**
 * @param {number[]} piles
 * @return {number}
 */
const stoneGameII = (piles) => {
    const n = piles.length;

    // Memoization table: memo[i][m] stores the maximum stones the current player
    // can get starting from pile index `i` with the current M value `m`.
    // Initialize with -1 to indicate that the state has not been computed yet.
    // `i` goes from 0 to n-1.
    // `m` can theoretically go up to n, as 2*M can be equal to n.
    // We use n+1 for the second dimension of memo to accommodate M values up to n.
    const memo = Array(n).fill(null).map(() => Array(n + 1).fill(-1));

    // Calculate prefix sums for efficient calculation of sums of ranges of piles.
    const prefixSum = calculatePrefixSums(piles);

    // Recursive function with memoization to find the maximum stones the current player can get.
    // i: The starting index of the current subproblem (piles from index i to n-1 are remaining).
    // m: The current value of M. The player can take X piles, where 1 <= X <= 2*m.
    const dp = (i, m) => {
        // If the result for this state (i, m) has already been computed, return it.
        if (memo[i][m] !== -1) {
            return memo[i][m];
        }

        // Base case: If the remaining piles (from index i to n-1) can all be taken by the current player.
        // This happens when the number of remaining piles (n - i) is less than or equal to 2*m.
        // In this case, the current player takes all remaining stones to maximize their score.
        if (n - i <= 2 * m) {
            // The total sum of stones from index i to n-1.
            memo[i][m] = getSum(prefixSum, i, n);
            return memo[i][m];
        }

        // Initialize the maximum stones the current player can get to 0.
        // We will try all possible moves and find the maximum.
        let maxStonesForCurrentPlayer = 0;

        // Iterate through all possible numbers of piles (X) the current player can take.
        // X must be at least 1 and at most 2*m.
        for (let x = 1; x <= 2 * m; x++) {
            // The number of stones the current player gets by taking `x` piles from index `i`.
            const stonesTakenByCurrentPlayer = getSum(prefixSum, i, i + x);

            // The new value of M for the next turn.
            const nextM = Math.max(m, x);

            // Recursively call dp for the next state:
            // The next player starts from index `i + x`.
            // The new M value is `nextM`.
            // `dp(i + x, nextM)` returns the maximum stones the *next* player can get from the remaining piles.
            const stonesOpponentGets = dp(i + x, nextM);

            // The total number of stones from the current index `i` to the end `n-1`.
            const totalStonesFromCurrentIndex = getSum(prefixSum, i, n);

            // The current player's score for choosing to take `x` piles is:
            // (Stones taken by current player) + (Total stones from index i+x onwards - What the opponent gets from i+x onwards).
            // This simplifies to: Total stones from index `i` onwards - What the opponent gets from index `i+x` onwards.
            // The current player wants to maximize this score.
            const currentPlayersScore = totalStonesFromCurrentIndex - stonesOpponentGets;

            // Update the maximum stones the current player can get if this move is chosen.
            maxStonesForCurrentPlayer = Math.max(maxStonesForCurrentPlayer, currentPlayersScore);
        }

        // Store the computed maximum stones for the current state (i, m) in the memoization table.
        memo[i][m] = maxStonesForCurrentPlayer;
        return maxStonesForCurrentPlayer;
    };

    // Alice starts the game from index 0 with M = 1.
    // The dp function returns the maximum stones Alice can get.
    return dp(0, 1);
};
```