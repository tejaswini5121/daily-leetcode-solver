```cpp
// Problem: Stone Game III
// Link: https://leetcode.com/problems/stone-game-iii/
//
// Approach:
// This problem can be solved using dynamic programming. We define dp[i] as the maximum score the current player can get
// from the subarray of stones starting at index i.
//
// The game state can be represented by the starting index of the remaining stones.
// Let's consider the stones from right to left. For each index `i`, the current player has three choices:
// 1. Take 1 stone: The player gets stones[i] and the remaining game is for the other player starting from index i+1.
//    The current player's score will be stones[i] + (total sum from i+1 to end - dp[i+1]).
//    This is equivalent to total_sum[i] - dp[i+1] if dp[i+1] represents the *maximum difference* the next player can achieve.
//    However, it's easier to think about the *maximum score the current player can achieve* for the remaining stones.
//    So, if the current player takes stones[i], their score from this move is stones[i], and the opponent will play on the
//    remaining stones. The opponent will maximize their score from i+1. So, the current player's net gain from this state is
//    stones[i] + (sum from i+1 to end - opponent's max score from i+1).
//    If dp[i] represents the maximum score the current player can achieve from index `i` onwards, and the total sum from `i` to end is `S[i]`,
//    then if the current player takes `k` stones (1, 2, or 3), they get `sum(stones[i...i+k-1])`. The remaining stones are from `i+k` onwards.
//    The next player will play optimally on `stones[i+k...]`, achieving a maximum score of `dp[i+k]`.
//    So, the current player's score for taking `k` stones is `sum(stones[i...i+k-1]) + (total_sum_from_i+k_to_end - dp[i+k])`.
//    This simplifies to: `sum(stones[i...i+k-1]) + S[i+k] - dp[i+k]`.
//
//    A more intuitive DP state: Let `dp[i]` be the maximum *difference* between the current player's score and the opponent's score,
//    if the game starts with stones from index `i` to the end.
//    If the current player takes 1 stone (stones[i]): their score increases by stones[i]. The game continues from `i+1`. The opponent will then play optimally, and their best score difference will be `dp[i+1]`. So, the current player's score difference will be `stones[i] - dp[i+1]`.
//    If the current player takes 2 stones (stones[i] + stones[i+1]): their score increases by stones[i] + stones[i+1]. The game continues from `i+2`. The opponent will play optimally, and their best score difference will be `dp[i+2]`. So, the current player's score difference will be `stones[i] + stones[i+1] - dp[i+2]`.
//    If the current player takes 3 stones (stones[i] + stones[i+1] + stones[i+2]): their score increases by stones[i] + stones[i+1] + stones[i+2]. The game continues from `i+3`. The opponent will play optimally, and their best score difference will be `dp[i+3]`. So, the current player's score difference will be `stones[i] + stones[i+1] + stones[i+2] - dp[i+3]`.
//
//    The current player wants to maximize this difference. So,
//    `dp[i] = max(stones[i] - dp[i+1], stones[i] + stones[i+1] - dp[i+2], stones[i] + stones[i+1] + stones[i+2] - dp[i+3])`.
//
//    Base cases:
//    If `i + 1 >= n` (only 0 stones left): `dp[n] = 0`.
//    If `i + 2 >= n` (only 1 stone left): `dp[n-1] = stones[n-1]`.
//    If `i + 3 >= n` (only 2 stones left): `dp[n-2] = max(stones[n-2], stones[n-2] + stones[n-1])`.
//
//    We will iterate from `n-1` down to `0`.
//    `n` is the number of stones.
//    `dp` array of size `n + 1`. `dp[n] = 0`.
//    `dp[n-1] = stones[n-1]` (if current player can take 1 stone).
//    `dp[n-2] = max(stones[n-2], stones[n-2] + stones[n-1])` (if current player can take 1 or 2 stones).
//    `dp[n-3] = max(stones[n-3] - dp[n-2], stones[n-3] + stones[n-2] - dp[n-1], stones[n-3] + stones[n-2] + stones[n-1] - dp[n])`
//
//    We can precompute prefix sums to efficiently calculate the sum of stones taken.
//    Let `prefixSum[i]` be the sum of `stoneValue[0]` to `stoneValue[i-1]`. `prefixSum[0] = 0`.
//    Then, the sum of stones from `i` to `i+k-1` is `prefixSum[i+k] - prefixSum[i]`.
//
//    Revised DP state: `dp[i]` is the maximum score the current player can achieve minus the score the opponent achieves,
//    given the stones from index `i` to `n-1`.
//    For index `i`:
//    Current player can take 1 stone: `stoneValue[i]`. The remaining game is `i+1`. The next player gets `dp[i+1]` advantage.
//    So, current player's advantage is `stoneValue[i] - dp[i+1]`.
//    Current player can take 2 stones: `stoneValue[i] + stoneValue[i+1]`. The remaining game is `i+2`. The next player gets `dp[i+2]` advantage.
//    So, current player's advantage is `stoneValue[i] + stoneValue[i+1] - dp[i+2]`.
//    Current player can take 3 stones: `stoneValue[i] + stoneValue[i+1] + stoneValue[i+2]`. The remaining game is `i+3`. The next player gets `dp[i+3]` advantage.
//    So, current player's advantage is `stoneValue[i] + stoneValue[i+1] + stoneValue[i+2] - dp[i+3]`.
//
//    `dp[i] = max(value_taken - dp[next_index])` for allowed moves.
//
//    Let's use a `dp` array of size `n+1`. `dp[n] = 0`.
//    Iterate `i` from `n-1` down to `0`.
//    `dp[i]` = maximum score Alice can get minus maximum score Bob can get, starting from index `i`.
//    When it's Alice's turn at index `i`:
//    Alice takes 1 stone: `stoneValue[i]`. Remaining stones from `i+1`. Bob will play. Bob will get `dp[i+1]` advantage. Alice's net gain: `stoneValue[i] - dp[i+1]`.
//    Alice takes 2 stones: `stoneValue[i] + stoneValue[i+1]`. Remaining stones from `i+2`. Bob will play. Bob will get `dp[i+2]` advantage. Alice's net gain: `stoneValue[i] + stoneValue[i+1] - dp[i+2]`.
//    Alice takes 3 stones: `stoneValue[i] + stoneValue[i+1] + stoneValue[i+2]`. Remaining stones from `i+3`. Bob will play. Bob will get `dp[i+3]` advantage. Alice's net gain: `stoneValue[i] + stoneValue[i+1] + stoneValue[i+2] - dp[i+3]`.
//
//    `dp[i] = max(options)`
//
//    Boundary conditions:
//    If `i+1 >= n`, `dp[i+1]` is not defined. Treat `dp[k] = 0` for `k >= n`.
//    So, for `i = n-1`:
//    Alice takes 1 stone: `stoneValue[n-1] - dp[n] = stoneValue[n-1]`.
//    `dp[n-1] = stoneValue[n-1]`.
//
//    For `i = n-2`:
//    Alice takes 1 stone: `stoneValue[n-2] - dp[n-1] = stoneValue[n-2] - stoneValue[n-1]`.
//    Alice takes 2 stones: `stoneValue[n-2] + stoneValue[n-1] - dp[n] = stoneValue[n-2] + stoneValue[n-1]`.
//    `dp[n-2] = max(stoneValue[n-2] - stoneValue[n-1], stoneValue[n-2] + stoneValue[n-1])`.
//
//    For `i = n-3`:
//    Alice takes 1 stone: `stoneValue[n-3] - dp[n-2]`.
//    Alice takes 2 stones: `stoneValue[n-3] + stoneValue[n-2] - dp[n-1]`.
//    Alice takes 3 stones: `stoneValue[n-3] + stoneValue[n-2] + stoneValue[n-1] - dp[n]`.
//    `dp[n-3] = max(stoneValue[n-3] - dp[n-2], stoneValue[n-3] + stoneValue[n-2] - dp[n-1], stoneValue[n-3] + stoneValue[n-2] + stoneValue[n-1])`.
//
//    This approach seems correct.
//
//    Let's simplify the calculation of sum of stones taken.
//    We can use prefix sums. `prefixSum[i]` = sum of `stoneValue[0]` to `stoneValue[i-1]`.
//    `prefixSum[0] = 0`.
//    `prefixSum[k]` = `sum(stoneValue[0...k-1])`.
//    Sum of `stoneValue[i]` to `stoneValue[i+k-1]` is `prefixSum[i+k] - prefixSum[i]`.
//
//    Let's recalculate for `i` from `n-1` down to `0`:
//    `dp[i]` = max difference current player can achieve from index `i` onwards.
//
//    `dp[n] = 0`
//
//    For `i = n-1`:
//    Can take 1 stone: `stoneValue[n-1]`. Remaining sum = 0. `dp[n-1] = stoneValue[n-1] - dp[n] = stoneValue[n-1]`.
//
//    For `i = n-2`:
//    Can take 1 stone: `stoneValue[n-2]`. Remaining game at `n-1`. Bob gets `dp[n-1]` advantage.
//    Alice's score difference: `stoneValue[n-2] - dp[n-1]`.
//    Can take 2 stones: `stoneValue[n-2] + stoneValue[n-1]`. Remaining game at `n`. Bob gets `dp[n]` advantage.
//    Alice's score difference: `stoneValue[n-2] + stoneValue[n-1] - dp[n]`.
//    `dp[n-2] = max(stoneValue[n-2] - dp[n-1], stoneValue[n-2] + stoneValue[n-1] - dp[n])`.
//
//    For `i = n-3`:
//    Can take 1 stone: `stoneValue[n-3]`. Remaining at `n-2`. Alice's score diff: `stoneValue[n-3] - dp[n-2]`.
//    Can take 2 stones: `stoneValue[n-3] + stoneValue[n-2]`. Remaining at `n-1`. Alice's score diff: `stoneValue[n-3] + stoneValue[n-2] - dp[n-1]`.
//    Can take 3 stones: `stoneValue[n-3] + stoneValue[n-2] + stoneValue[n-1]`. Remaining at `n`. Alice's score diff: `stoneValue[n-3] + stoneValue[n-2] + stoneValue[n-1] - dp[n]`.
//    `dp[n-3] = max(stoneValue[n-3] - dp[n-2], stoneValue[n-3] + stoneValue[n-2] - dp[n-1], stoneValue[n-3] + stoneValue[n-2] + stoneValue[n-1] - dp[n])`.
//
//    This logic is consistent.
//
//    Let's implement this using `dp` of size `n+1`.
//    The `dp` array will store the maximum score difference the current player can achieve.
//    We iterate from `n-1` down to `0`.
//
//    For each `i`:
//    Initialize `current_max_diff = -infinity` (or a very small number).
//    Calculate `sum_stones` for taking 1, 2, or 3 stones.
//    For each `k` (1, 2, 3):
//        If `i + k <= n`:
//            `sum_stones = sum(stoneValue[i]...stoneValue[i+k-1])`
//            `diff = sum_stones - dp[i+k]`
//            `current_max_diff = max(current_max_diff, diff)`
//    `dp[i] = current_max_diff`
//
//    The `sum_stones` can be efficiently calculated using prefix sums.
//    Let `prefixSum[i]` be the sum of `stoneValue[0]` to `stoneValue[i-1]`.
//    `prefixSum` array will have size `n+1`.
//    `prefixSum[0] = 0`.
//    For `j` from `0` to `n-1`: `prefixSum[j+1] = prefixSum[j] + stoneValue[j]`.
//
//    Sum of `stoneValue[i]` to `stoneValue[i+k-1]` is `prefixSum[i+k] - prefixSum[i]`.
//
//    So, for `i` from `n-1` down to `0`:
//    `dp[i] = -inf`
//    For `k` from `1` to `3`:
//        If `i + k <= n`:
//            `stones_taken = prefixSum[i+k] - prefixSum[i]`
//            `dp[i] = max(dp[i], stones_taken - dp[i+k])`
//
//    After filling the `dp` array, `dp[0]` will be the maximum difference Alice can achieve over Bob.
//    If `dp[0] > 0`, Alice wins.
//    If `dp[0] < 0`, Bob wins.
//    If `dp[0] == 0`, it's a tie.
//
// Time Complexity:
// Building prefix sums: O(N), where N is the number of stones.
// Filling DP table: We have N states (i from 0 to N-1). For each state, we iterate at most 3 times (for k=1, 2, 3).
// So, filling DP table is O(N * 3) = O(N).
// Total Time Complexity: O(N).
//
// Space Complexity:
// Prefix sum array: O(N).
// DP array: O(N).
// Total Space Complexity: O(N).
//
// Optimization:
// Notice that to calculate `dp[i]`, we only need `dp[i+1]`, `dp[i+2]`, and `dp[i+3]`.
// This means we can optimize space by using a DP array of size 4 (or a rolling window).
// Let `dp[j]` represent `dp[i+j]`. When we move from `i` to `i-1`, the indices shift.
// `dp_new[0]` (for `i-1`) depends on `dp_old[1]` (for `i`), `dp_old[2]` (for `i+1`), `dp_old[3]` (for `i+2`).
// This is like a sliding window.
// If we use `dp[4]`, where `dp[0]` stores `dp[i]`, `dp[1]` stores `dp[i+1]`, `dp[2]` stores `dp[i+2]`, `dp[3]` stores `dp[i+3]`.
// When computing `dp[i-1]`, the new `dp[0]` depends on old `dp[1]`, `dp[2]`, `dp[3]`.
// We can use `dp[k % 4]` to store `dp[i]`.
// Let `dp[0]`, `dp[1]`, `dp[2]`, `dp[3]` store the values for `dp[i]`, `dp[i+1]`, `dp[i+2]`, `dp[i+3]` respectively.
// When we compute for `i-1`, we will compute `dp[(i-1) % 4]`.
// This new value depends on `dp[(i) % 4]`, `dp[(i+1) % 4]`, `dp[(i+2) % 4]`.
// The indices `i`, `i+1`, `i+2`, `i+3` wrap around modulo 4.
// Let `dp[0]` store `dp[i]`, `dp[1]` store `dp[i+1]`, `dp[2]` store `dp[i+2]`, `dp[3]` store `dp[i+3]`.
// When calculating `dp[i-1]`:
// The value for `dp[i-1]` will be stored at `dp[(i-1) % 4]`.
// It depends on `dp[i % 4]`, `dp[(i+1) % 4]`, `dp[(i+2) % 4]`.
// The mapping is:
// `dp[i]` -> `dp[i % 4]`
// `dp[i+1]` -> `dp[(i+1) % 4]`
// `dp[i+2]` -> `dp[(i+2) % 4]`
// `dp[i+3]` -> `dp[(i+3) % 4]`
//
// So, `dp[i % 4] = max(stones_taken_1 - dp[(i+1) % 4], stones_taken_2 - dp[(i+2) % 4], stones_taken_3 - dp[(i+3) % 4])`.
// The `dp` array size is 4. Initialize it with 0s.
// The prefix sum array is still needed, size N+1.
//
// Space Complexity with optimization: O(N) for prefix sums + O(1) for DP table = O(N).
// The problem constraints allow O(N) space. So, the unoptimized O(N) space DP is fine.
// The prefix sum calculation is crucial for efficiency.
//
// Let's double check the problem statement: "Alice and Bob play optimally." This is handled by taking the maximum.
// "Alice starting first." This is handled by the fact that `dp[0]` represents the first player's advantage.
//
// Example 1: stoneValue = [1,2,3,7]
// n = 4
// prefixSum = [0, 1, 3, 6, 13]
// dp array of size 5. dp[4] = 0.
//
// i = 3: stones[3] = 7
//   k=1: take 7. sum = 7. next_idx = 4. dp[4] = 0.
//   dp[3] = max(7 - dp[4]) = 7.
//
// i = 2: stones[2]=3, stones[3]=7.
//   k=1: take 3. sum = 3. next_idx = 3. dp[3] = 7.
//     diff = 3 - dp[3] = 3 - 7 = -4.
//   k=2: take 3+7. sum = 10. next_idx = 4. dp[4] = 0.
//     diff = 10 - dp[4] = 10 - 0 = 10.
//   dp[2] = max(-4, 10) = 10.
//
// i = 1: stones[1]=2, stones[2]=3, stones[3]=7.
//   k=1: take 2. sum = 2. next_idx = 2. dp[2] = 10.
//     diff = 2 - dp[2] = 2 - 10 = -8.
//   k=2: take 2+3. sum = 5. next_idx = 3. dp[3] = 7.
//     diff = 5 - dp[3] = 5 - 7 = -2.
//   k=3: take 2+3+7. sum = 12. next_idx = 4. dp[4] = 0.
//     diff = 12 - dp[4] = 12 - 0 = 12.
//   dp[1] = max(-8, -2, 12) = 12.
//
// i = 0: stones[0]=1, stones[1]=2, stones[2]=3, stones[3]=7.
//   k=1: take 1. sum = 1. next_idx = 1. dp[1] = 12.
//     diff = 1 - dp[1] = 1 - 12 = -11.
//   k=2: take 1+2. sum = 3. next_idx = 2. dp[2] = 10.
//     diff = 3 - dp[2] = 3 - 10 = -7.
//   k=3: take 1+2+3. sum = 6. next_idx = 3. dp[3] = 7.
//     diff = 6 - dp[3] = 6 - 7 = -1.
//   dp[0] = max(-11, -7, -1) = -1.
//
// dp[0] = -1. Since it's negative, Bob wins. Output: "Bob". Correct.
//
// Example 2: stoneValue = [1,2,3,-9]
// n = 4
// prefixSum = [0, 1, 3, 6, -3]
// dp array of size 5. dp[4] = 0.
//
// i = 3: stones[3] = -9
//   k=1: take -9. sum = -9. next_idx = 4. dp[4] = 0.
//   dp[3] = max(-9 - dp[4]) = -9.
//
// i = 2: stones[2]=3, stones[3]=-9.
//   k=1: take 3. sum = 3. next_idx = 3. dp[3] = -9.
//     diff = 3 - dp[3] = 3 - (-9) = 12.
//   k=2: take 3+(-9). sum = -6. next_idx = 4. dp[4] = 0.
//     diff = -6 - dp[4] = -6 - 0 = -6.
//   dp[2] = max(12, -6) = 12.
//
// i = 1: stones[1]=2, stones[2]=3, stones[3]=-9.
//   k=1: take 2. sum = 2. next_idx = 2. dp[2] = 12.
//     diff = 2 - dp[2] = 2 - 12 = -10.
//   k=2: take 2+3. sum = 5. next_idx = 3. dp[3] = -9.
//     diff = 5 - dp[3] = 5 - (-9) = 14.
//   k=3: take 2+3+(-9). sum = -4. next_idx = 4. dp[4] = 0.
//     diff = -4 - dp[4] = -4 - 0 = -4.
//   dp[1] = max(-10, 14, -4) = 14.
//
// i = 0: stones[0]=1, stones[1]=2, stones[2]=3, stones[3]=-9.
//   k=1: take 1. sum = 1. next_idx = 1. dp[1] = 14.
//     diff = 1 - dp[1] = 1 - 14 = -13.
//   k=2: take 1+2. sum = 3. next_idx = 2. dp[2] = 12.
//     diff = 3 - dp[2] = 3 - 12 = -9.
//   k=3: take 1+2+3. sum = 6. next_idx = 3. dp[3] = -9.
//     diff = 6 - dp[3] = 6 - (-9) = 15.
//   dp[0] = max(-13, -9, 15) = 15.
//
// dp[0] = 15. Since it's positive, Alice wins. Output: "Alice". Correct.
//
// Example 3: stoneValue = [1,2,3,6]
// n = 4
// prefixSum = [0, 1, 3, 6, 12]
// dp array of size 5. dp[4] = 0.
//
// i = 3: stones[3] = 6
//   k=1: take 6. sum = 6. next_idx = 4. dp[4] = 0.
//   dp[3] = max(6 - dp[4]) = 6.
//
// i = 2: stones[2]=3, stones[3]=6.
//   k=1: take 3. sum = 3. next_idx = 3. dp[3] = 6.
//     diff = 3 - dp[3] = 3 - 6 = -3.
//   k=2: take 3+6. sum = 9. next_idx = 4. dp[4] = 0.
//     diff = 9 - dp[4] = 9 - 0 = 9.
//   dp[2] = max(-3, 9) = 9.
//
// i = 1: stones[1]=2, stones[2]=3, stones[3]=6.
//   k=1: take 2. sum = 2. next_idx = 2. dp[2] = 9.
//     diff = 2 - dp[2] = 2 - 9 = -7.
//   k=2: take 2+3. sum = 5. next_idx = 3. dp[3] = 6.
//     diff = 5 - dp[3] = 5 - 6 = -1.
//   k=3: take 2+3+6. sum = 11. next_idx = 4. dp[4] = 0.
//     diff = 11 - dp[4] = 11 - 0 = 11.
//   dp[1] = max(-7, -1, 11) = 11.
//
// i = 0: stones[0]=1, stones[1]=2, stones[2]=3, stones[3]=6.
//   k=1: take 1. sum = 1. next_idx = 1. dp[1] = 11.
//     diff = 1 - dp[1] = 1 - 11 = -10.
//   k=2: take 1+2. sum = 3. next_idx = 2. dp[2] = 9.
//     diff = 3 - dp[2] = 3 - 9 = -6.
//   k=3: take 1+2+3. sum = 6. next_idx = 3. dp[3] = 6.
//     diff = 6 - dp[3] = 6 - 6 = 0.
//   dp[0] = max(-10, -6, 0) = 0.
//
// dp[0] = 0. Since it's zero, it's a tie. Output: "Tie". Correct.
//
// The implementation should handle edge cases correctly, especially when `i+k` goes beyond `n`.
// The `dp` array is defined up to `n`, and `dp[n]` is the base case.
// When calculating `dp[i]`, we access `dp[i+k]`.
// If `i+k == n`, we use `dp[n]`.
// If `i+k > n`, this move is not possible. For example, if `i=n-1` and `k=2`, then `i+k = n+1`.
// The loop `for k from 1 to 3` must check `i+k <= n`.
//
// The logic for calculating `sum_stones` using prefix sums is `prefixSum[i+k] - prefixSum[i]`.
// This requires `prefixSum` to be of size `n+1`.
// `prefixSum[0] = 0`
// `prefixSum[1] = stoneValue[0]`
// `prefixSum[2] = stoneValue[0] + stoneValue[1]`
// ...
// `prefixSum[n] = stoneValue[0] + ... + stoneValue[n-1]`
//
// So, sum of `stoneValue[i]` through `stoneValue[i+k-1]` is `prefixSum[i+k] - prefixSum[i]`.
// This is correct.
//
// The dp array should be `vector<long long> dp(n + 1, 0);`. Using `long long` for dp and prefix sum
// to avoid potential integer overflow, especially since stone values can be negative and `n` is up to `5*10^4`.
// The sum of stones can be `5*10^4 * 1000 = 5 * 10^7`, which fits in `int`.
// However, the difference can also be large. `long long` is safer.
//
// Consider `stoneValue.length()` can be 1.
// If `n=1`, `stoneValue = [10]`.
// `prefixSum = [0, 10]`
// `dp` size 2. `dp[1] = 0`.
// `i = 0`.
// `k=1`: `i+k = 1 <= n`. `stones_taken = prefixSum[1] - prefixSum[0] = 10 - 0 = 10`.
// `dp[0] = max(dp[0], stones_taken - dp[i+k]) = max(0, 10 - dp[1]) = max(0, 10 - 0) = 10`.
// `dp[0] = 10`. Alice wins. Correct.
//
// If `n=2`, `stoneValue = [10, -5]`
// `prefixSum = [0, 10, 5]`
// `dp` size 3. `dp[2] = 0`.
// `i = 1`:
// `k=1`: `i+k = 2 <= n`. `stones_taken = prefixSum[2] - prefixSum[1] = 5 - 10 = -5`.
// `dp[1] = max(dp[1], stones_taken - dp[i+k]) = max(0, -5 - dp[2]) = max(0, -5 - 0) = 0`.
// Wait, `dp[1]` should be initialized to a very small number if we are using `max`.
// Or, `dp[1]` should be calculated correctly.
// For `i = n-1`, there's only one choice (take 1 stone).
// If `n=1`, `dp[0] = stoneValue[0]`.
// If `n=2`, `i=1`. `dp[1] = stoneValue[1]`.
// If `n=3`, `i=2`. `dp[2] = max(stoneValue[2], stoneValue[2]+stoneValue[1])`.
//
// Let's refine the loop for `i`.
// For `i` from `n-1` down to `0`:
//  Initialize `max_diff_for_i = -infinity`.
//  For `k` from `1` to `3`:
//      If `i + k <= n`:
//          `current_sum = prefixSum[i+k] - prefixSum[i]`
//          `max_diff_for_i = max(max_diff_for_i, current_sum - dp[i+k])`
//  `dp[i] = max_diff_for_i`
//
// This initialization with `-infinity` is important. Use `LLONG_MIN` from `<climits>`.
//
// Example: `stoneValue = [10, -5]`, n=2.
// `prefixSum = [0, 10, 5]`
// `dp` size 3. `dp[2] = 0`.
//
// `i = 1`:
//   `max_diff_for_i = LLONG_MIN`
//   `k = 1`: `i+k = 2 <= n`.
//     `current_sum = prefixSum[2] - prefixSum[1] = 5 - 10 = -5`.
//     `max_diff_for_i = max(LLONG_MIN, -5 - dp[2]) = max(LLONG_MIN, -5 - 0) = -5`.
//   `k = 2`: `i+k = 3 > n`. break inner loop.
// `dp[1] = -5`.
//
// `i = 0`:
//   `max_diff_for_i = LLONG_MIN`
//   `k = 1`: `i+k = 1 <= n`.
//     `current_sum = prefixSum[1] - prefixSum[0] = 10 - 0 = 10`.
//     `max_diff_for_i = max(LLONG_MIN, 10 - dp[1]) = max(LLONG_MIN, 10 - (-5)) = 15`.
//   `k = 2`: `i+k = 2 <= n`.
//     `current_sum = prefixSum[2] - prefixSum[0] = 5 - 0 = 5`.
//     `max_diff_for_i = max(15, 5 - dp[2]) = max(15, 5 - 0) = 15`.
//   `k = 3`: `i+k = 3 > n`. break inner loop.
// `dp[0] = 15`.
//
// `dp[0] = 15`. Alice wins.
// If Alice takes 10, Bob takes -5. Alice=10, Bob=-5. Alice wins. Diff = 15.
// If Alice takes 10 and -5, Alice=5, Bob=0. Alice wins. Diff = 5.
// Alice plays optimally, takes 10.
//
// This seems correct.
// Use `std::vector<long long>` for `dp` and `prefixSum`.
//
```cpp
#include <vector>
#include <string>
#include <numeric>
#include <algorithm>
#include <climits> // For LLONG_MIN

class Solution {
public:
    std::string stoneGameIII(std::vector<int>& stoneValue) {
        int n = stoneValue.size();

        // prefixSum[i] will store the sum of stoneValue[0]...stoneValue[i-1]
        // prefixSum has size n+1. prefixSum[0] = 0.
        std::vector<long long> prefixSum(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            prefixSum[i + 1] = prefixSum[i] + stoneValue[i];
        }

        // dp[i] will store the maximum score difference the current player can achieve
        // if the game starts with stones from index i to n-1.
        // A positive dp[i] means the current player scores more than the opponent.
        // A negative dp[i] means the opponent scores more than the current player.
        // dp array size is n+1. dp[n] is the base case (no stones left), so difference is 0.
        std::vector<long long> dp(n + 1, 0);

        // Iterate from right to left, filling the dp table.
        // i represents the starting index of the remaining stones.
        for (int i = n - 1; i >= 0; --i) {
            // Initialize the maximum difference for the current state 'i' to a very small number.
            long long max_diff_for_i = LLONG_MIN;

            // The current player can take 1, 2, or 3 stones.
            // For each possible move (taking k stones):
            for (int k = 1; k <= 3; ++k) {
                // Check if taking k stones is possible (i.e., we don't go beyond the last stone).
                if (i + k <= n) {
                    // Calculate the sum of stones taken in this move (from index i to i+k-1).
                    // This is done efficiently using prefix sums: sum(i to i+k-1) = prefixSum[i+k] - prefixSum[i].
                    long long current_stones_taken = prefixSum[i + k] - prefixSum[i];

                    // The current player takes `current_stones_taken`.
                    // The game then continues from index `i+k`.
                    // `dp[i+k]` represents the maximum score difference the *next* player (opponent) can achieve
                    // from index `i+k` onwards.
                    // So, the current player's score difference for this move is `current_stones_taken - dp[i+k]`.
                    long long current_move_diff = current_stones_taken - dp[i + k];

                    // The current player wants to maximize their score difference, so we take the maximum.
                    max_diff_for_i = std::max(max_diff_for_i, current_move_diff);
                }
            }
            // Store the maximum difference achievable from state 'i'.
            dp[i] = max_diff_for_i;
        }

        // After filling the dp table, dp[0] represents the maximum score difference Alice (the first player)
        // can achieve over Bob for the entire game starting with all stones.
        if (dp[0] > 0) {
            return "Alice"; // Alice's score is greater than Bob's.
        } else if (dp[0] < 0) {
            return "Bob";   // Bob's score is greater than Alice's.
        } else {
            return "Tie";   // Scores are equal.
        }
    }
};
```