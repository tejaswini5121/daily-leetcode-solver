```javascript
/**
 * Problem Summary:
 * Given counts of zeros and ones, and a limit, find the number of stable binary arrays.
 * A stable array has exactly 'zero' zeros and 'one' ones, and every subarray larger than 'limit'
 * must contain at least one 0 and at least one 1.
 *
 * Problem Link:
 * https://leetcode.com/problems/find-all-possible-stable-binary-arrays-ii/
 *
 * Approach Explanation:
 * This problem can be solved using dynamic programming. We need to build arrays
 * while keeping track of the counts of zeros and ones, and ensuring the "stable" condition.
 *
 * Let dp[i][j][last_char_is_zero] be the number of stable binary arrays using 'i' zeros and 'j' ones,
 * where `last_char_is_zero` indicates if the last character added was a '0' (true) or '1' (false).
 *
 * The base cases are:
 * dp[0][0][true] = 0 (cannot end with 0 if no characters used)
 * dp[0][0][false] = 0 (cannot end with 1 if no characters used)
 *
 * If we want to start an array, we can place a '0' or a '1'.
 * dp[1][0][true] = 1 (array is [0])
 * dp[0][1][false] = 1 (array is [1])
 *
 * For the transition, consider dp[i][j][true] (arrays ending with '0'):
 * To form an array of 'i' zeros and 'j' ones ending with '0', the previous character must have been '1'
 * or it could have been a '0' if we are extending a run of '0's.
 * The crucial condition is "Each subarray of arr with a size greater than limit must contain both 0 and 1."
 * This means we cannot have a run of identical characters (0s or 1s) that exceeds 'limit'.
 *
 * Let's refine the DP state to explicitly handle the `limit` constraint.
 * dp[i][j][0] = number of stable arrays with `i` zeros and `j` ones, ending with '0'.
 * dp[i][j][1] = number of stable arrays with `i` zeros and `j` ones, ending with '1'.
 *
 * To calculate dp[i][j][0]:
 * We are adding a '0'. The previous character must have been '1', OR it was a '0'
 * and we are extending a run of '0's.
 *
 * If the previous character was '1': We can append a '0' to any stable array of `i-1` zeros and `j` ones ending with '1'.
 * The number of ways is dp[i-1][j][1].
 *
 * If the previous character was '0': We can append a '0' to an array of `i-k` zeros and `j` ones ending with '0',
 * where we added `k` zeros as the last block. The length of this block must not exceed `limit`.
 *
 * This suggests a more efficient way to compute:
 * To calculate dp[i][j][0] (ending with '0'):
 * We must have placed at least one '0'.
 * The last placed character is '0'. The previous character could be a '1'. In this case, we just append '0' to any valid array ending with '1'.
 * The number of ways to append a '0' after a '1' is sum(dp[i-k][j][1]) for k=1 to limit. No, this is wrong.
 *
 * A better DP state for the limit constraint:
 * dp[i][j][0] = number of arrays with `i` zeros and `j` ones, ending with a '0'.
 * dp[i][j][1] = number of arrays with `i` zeros and `j` ones, ending with a '1'.
 *
 * Modulo is 10^9 + 7.
 *
 * Base cases:
 * dp[0][0][0] = 0
 * dp[0][0][1] = 0
 *
 * Initialize dp[k][0][0] = 1 for 1 <= k <= limit (arrays of 'k' zeros, e.g., [0], [0,0], ..., up to [0...0] 'limit' times)
 * Initialize dp[0][k][1] = 1 for 1 <= k <= limit (arrays of 'k' ones, e.g., [1], [1,1], ..., up to [1...1] 'limit' times)
 *
 * Note: The problem asks for stable arrays, which means we must have both 0 and 1 if the length > limit.
 * The above base cases for single-character type arrays only satisfy the condition if their length is <= limit.
 *
 * Let's adjust the DP definition to capture the last block length implicitly via prefix sums.
 * Let dp[i][j][0] be the number of stable arrays with `i` zeros and `j` ones, ending with a '0'.
 * Let dp[i][j][1] be the number of stable arrays with `i` zeros and `j` ones, ending with a '1'.
 *
 * To compute dp[i][j][0]:
 * We want to add a block of `k` zeros (1 <= k <= limit) to an array that ends with '1' and has `i-k` zeros and `j` ones.
 * The number of such arrays is dp[i-k][j][1].
 * So, dp[i][j][0] = sum(dp[i-k][j][1] for k from 1 to min(i, limit)).
 *
 * To compute dp[i][j][1]:
 * We want to add a block of `k` ones (1 <= k <= limit) to an array that ends with '0' and has `i` zeros and `j-k` ones.
 * The number of such arrays is dp[i][j-k][0].
 * So, dp[i][j][1] = sum(dp[i][j-k][0] for k from 1 to min(j, limit)).
 *
 * These sums can be efficiently calculated using prefix sums (or sliding window sums).
 *
 * Let `sum_dp[i][j][0]` be the sum `dp[x][j][0]` for `x` from 1 to `i`.
 * Let `sum_dp[i][j][1]` be the sum `dp[i][x][1]` for `x` from 1 to `j`.
 *
 * More precisely, to calculate dp[i][j][0]:
 * If we are adding `k` zeros:
 * The total number of ways to end with `i` zeros and `j` ones, with the last character being '0',
 * is the sum of ways to form an array with `i-k` zeros and `j` ones ending with '1', and then append 'k' zeros.
 * The condition "each subarray of arr with a size greater than limit must contain both 0 and 1" means
 * we cannot have a contiguous block of more than `limit` zeros, nor more than `limit` ones.
 *
 * Base cases for the DP:
 * When j = 0 (only zeros present):
 * dp[i][0][0] = 1 if 1 <= i <= limit, else 0. (e.g., [0,0] for i=2, limit=2)
 * dp[i][0][1] = 0 for all i.
 *
 * When i = 0 (only ones present):
 * dp[0][j][1] = 1 if 1 <= j <= limit, else 0. (e.g., [1,1] for j=2, limit=2)
 * dp[0][j][0] = 0 for all j.
 *
 * The final answer is `(dp[zero][one][0] + dp[zero][one][1]) % MOD`.
 *
 * Let's set up the DP table and iterate.
 * `dp[i][j][0]` means `i` zeros, `j` ones, ends with 0.
 * `dp[i][j][1]` means `i` zeros, `j` ones, ends with 1.
 *
 * `MOD = 10^9 + 7`
 *
 * `dp` table size: `(zero + 1) x (one + 1) x 2`
 *
 * Loop for `i` from 0 to `zero`:
 *   Loop for `j` from 0 to `one`:
 *
 *     If `i == 0` and `j == 0`: continue (no chars yet)
 *
 *     // Calculate dp[i][j][0] (ending with '0')
 *     // This means we appended a block of 'k' zeros to an array ending with '1'.
 *     // The previous state was dp[i-k][j][1].
 *     // We can append 'k' zeros, where 1 <= k <= limit.
 *     // Also, we must have at least one '0', so i > 0.
 *     if (i > 0) {
 *       // The sum is (dp[i-1][j][1] + dp[i-2][j][1] + ... + dp[max(0, i-limit)][j][1])
 *       // This is (sum of dp[x][j][1] for x from i-limit to i-1)
 *       // Use prefix sums for dp[x][j][1] over x.
 *
 *       // Let prefix_sum_dp_ending_1[k][j] = sum(dp[x][j][1] for x from 0 to k)
 *       // Then sum(dp[x][j][1] for x from i-limit to i-1) = prefix_sum_dp_ending_1[i-1][j] - prefix_sum_dp_ending_1[max(-1, i-limit-1)][j]
 *       // This is tricky because the base cases dp[k][0][0] are not part of dp[k][j][1].
 *
 *       // Consider the values directly:
 *       // dp[i][j][0] = sum(dp[i-k][j][1] for k = 1 to min(i, limit))
 *       // Simplified:
 *       // dp[i][j][0] = (dp[i-1][j][1] + dp[i-2][j][1] + ... + dp[i-limit][j][1])
 *       // This sum can be maintained with a sliding window sum.
 *       // If `i` is current number of zeros, and we are trying to add a block of '0's.
 *       // The state `dp[i][j][0]` implies ending with '0'.
 *       //
 *       // if i <= limit and j == 0: dp[i][0][0] = 1 (e.g., [0,0])
 *       // for other cases, it must end with '0' after some '1's.
 *       if (j == 0) { // Only zeros
 *         if (i <= limit) dp[i][j][0] = 1; // Array of only zeros, length i, e.g., [0,0,0]
 *         // else 0 (e.g., [0,0,0,0] with limit=3 is invalid)
 *       } else { // Contains both 0s and 1s, and ends with 0
 *         // Add to dp[i][j][0] values from previous states ending with '1'
 *         // Sum up dp[i-k][j][1] for k from 1 to min(i, limit)
 *         // This can be computed as (dp[i-1][j][0] + dp[i-1][j][1]) - (dp[i-limit-1][j][1]) if i-limit-1 >= 0
 *         // No, this is not directly (prev_dp_value - value_exiting_window).
 *         // This is (sum_dp_ending_1[i-1][j] - sum_dp_ending_1[max(-1, i-limit-1)][j])
 *         // Let's use two helper prefix sum arrays.
 *
 *         // `prev_sum_zero` will store sum of dp[x][j][0] for x up to current `i`.
 *         // `prev_sum_one` will store sum of dp[i][x][1] for x up to current `j`.
 *
 *         // To calculate dp[i][j][0] (ending in 0s):
 *         // We need to sum up dp[i-k][j][1] for k=1 to limit (provided i-k >= 0)
 *         // This sum is essentially:
 *         // (current sum of dp[x][j][1] from previous iteration (i-1))
 *         // minus (dp[i-limit-1][j][1] if i-limit-1 >= 0 and was part of the sum)
 *         //
 *         // Let's define:
 *         // sum_ending_1[i][j] = sum(dp[i'][j][1] for i' = 0 to i)
 *         // sum_ending_0[i][j] = sum(dp[i][j'][0] for j' = 0 to j)
 *
 *         // dp[i][j][0] = sum(dp[i-k][j][1] for k from 1 to limit)
 *         // If we define `pref_sum_1[c0]` as sum of `dp[c0][j][1]` for all valid `c0`.
 *         // `pref_sum_1[i-1]` is the sum of ending_1 states up to `i-1`.
 *         // For `dp[i][j][0]`, we need to sum `dp[x][j][1]` for `x` from `i - limit` to `i - 1`.
 *         // Let `s0[c0][c1]` be the sum of ways to make `c0` zeros and `c1` ones, ending with 0.
 *         // Let `s1[c0][c1]` be the sum of ways to make `c0` zeros and `c1` ones, ending with 1.
 *         //
 *         // For `dp[i][j][0]`:
 *         //  It's the sum of `dp[i-k][j][1]` for `1 <= k <= limit`.
 *         //  This implies that for `k=1`, we take `dp[i-1][j][1]`. This is valid if `i-1 >= 0`.
 *         //  If `i-1 < 0`, it's 0.
 *         //
 *         // To simplify prefix sums, let's observe the recurrence:
 *         // `dp[i][j][0] = (dp[i-1][j][1] + dp[i-2][j][1] + ... + dp[max(0, i-limit)][j][1]) % MOD`
 *         // `dp[i][j][0] = (dp[i-1][j][0] + dp[i-1][j][1] - dp[i-limit-1][j][1]) % MOD`
 *         // This is a common optimization for `sum(dp[prev_state][j][other_char])`
 *         // when adding characters of type `X` to previous states of `Y`.
 *         // The sum we need for `dp[i][j][0]` is: `Sum_k=1_to_limit (dp[i-k][j][1])`.
 *         // Let `sum_ending_1_at_i_minus_1_j = dp[i-1][j][1] + dp[i-2][j][1] + ... + dp[i-limit][j][1]`.
 *         // So `dp[i][j][0]` can be written as:
 *         // `dp[i][j][0] = ( (dp[i-1][j][0] if i-1 >= 0) + (dp[i-1][j][1] if i-1 >= 0) ) % MOD` (if we just allow any previous)
 *         // No, this is incorrect. The restriction is about *last run* length.
 *         //
 *         // Correct DP transitions with prefix sums for sliding window:
 *         //
 *         // Let `dp0[i][j]` be the number of stable arrays with `i` zeros and `j` ones, ending with '0'.
 *         // Let `dp1[i][j]` be the number of stable arrays with `i` zeros and `j` ones, ending with '1'.
 *         //
 *         // Initialize `dp0[0][0] = 0`, `dp1[0][0] = 0`.
 *         // Initialize `dp0[k][0] = 1` for `1 <= k <= limit`. (Arrays like `[0]`, `[0,0]`, etc.)
 *         // Initialize `dp1[0][k] = 1` for `1 <= k <= limit`. (Arrays like `[1]`, `[1,1]`, etc.)
 *
 *         // `dp0_prefix_sum[j][i]` = sum of `dp1[k][j]` for `k` from `0` to `i`. (Sum of ways to end with 1, given j ones, and up to i zeros)
 *         // `dp1_prefix_sum[i][j]` = sum of `dp0[i][k]` for `k` from `0` to `j`. (Sum of ways to end with 0, given i zeros, and up to j ones)
 *
 *         // Iterate `i` from 0 to `zero`
 *         //   Iterate `j` from 0 to `one`
 *         //     Handle base cases:
 *         //     if i=0, j=0: continue
 *         //     if i > 0 && j == 0: dp0[i][0] = (i <= limit ? 1 : 0);
 *         //     if j > 0 && i == 0: dp1[0][j] = (j <= limit ? 1 : 0);
 *         //
 *         //     For `dp0[i][j]` (ending with 0), we need to append a block of `k` zeros (1 <= k <= limit)
 *         //     to `dp1[i-k][j]`.
 *         //     `dp0[i][j] = (dp1_prefix_sum[j][i-1] - dp1_prefix_sum[j][i-limit-1] + MOD) % MOD` (if using 2D prefix sums)
 *         //     This becomes complex with array indexing.
 *
 *         // Let's use `dp_sum0` and `dp_sum1` to optimize the sums.
 *         // `dp_sum0[j]` will store `sum(dp1[k][j])` for `k` from `i-limit` to `i-1`. (for current `i`)
 *         // `dp_sum1[i]` will store `sum(dp0[i][k])` for `k` from `j-limit` to `j-1`. (for current `j`)
 *
 *         // Let `dp[i][j][0]` be ways for `i` zeros, `j` ones, ending in 0.
 *         // Let `dp[i][j][1]` be ways for `i` zeros, `j` ones, ending in 1.
 *         // `MOD = 10^9 + 7`
 *
 *         // dp_zero_val[i][j]: The actual DP value for `i` zeros, `j` ones, ending with 0.
 *         // dp_one_val[i][j]: The actual DP value for `i` zeros, `j` ones, ending with 1.
 *
 *         // dp_zero_sum[i][j]: Sum of `dp_one_val[x][j]` for `x` from 0 to `i`.
 *         // dp_one_sum[i][j]: Sum of `dp_zero_val[i][x]` for `x` from 0 to `j`.
 *
 *         // Initialize 2D arrays `dp_zero_val`, `dp_one_val`, `dp_zero_sum`, `dp_one_sum` with 0.
 *
 *         // Base cases for single character type arrays (length <= limit)
 *         // dp_zero_val[k][0] = 1 for 1 <= k <= limit
 *         // dp_one_val[0][k] = 1 for 1 <= k <= limit
 *
 *         // The prefix sums also need to incorporate these base cases.
 *         // `dp_zero_sum[k][0]` for `k` up to `limit` should be `1`.
 *         // This means `dp_zero_sum[k][0]` sums `dp_one_val[x][0]`. But `dp_one_val[x][0]` is 0 for x > 0.
 *         // The prefix sum needs to be over the *other* index.
 *         // `dp_zero_sum[i][j]` = Sum of `dp_one_val[x][j]` for `x` from 0 to `i-1`.
 *         // No, this is confusing. Let's simplify the sum calculation.
 *
 *         // dp[i][j][0] (ending in 0): Sum of dp[i-k][j][1] for k from 1 to limit.
 *         // This means it is (dp[i-1][j][1] + dp[i-2][j][1] + ... + dp[i-limit][j][1])
 *         // Let `S0[i][j]` be the sum required for `dp[i][j][0]`.
 *         // `S0[i][j] = dp[i-1][j][1] + S0[i-1][j] - (dp[i-limit-1][j][1] if i-limit-1 >= 0 else 0)`
 *         // This is the correct sliding window sum logic.
 *
 *         // Let `S0[i][j]` be the sum of `dp[x][j][1]` for `x` from `i-limit` to `i-1`.
 *         // `dp[i][j][0] = S0[i][j]`
 *         // Let `S1[i][j]` be the sum of `dp[i][y][0]` for `y` from `j-limit` to `j-1`.
 *         // `dp[i][j][1] = S1[i][j]`
 *
 *         // Initialize dp tables: `dp[MAX_Z + 1][MAX_O + 1][2]`
 *         // `sum_dp[MAX_Z + 1][MAX_O + 1][2]` to store cumulative sums for sliding window optimization.
 *         // `sum_dp[i][j][0]` = sum of `dp[i][k][0]` for `k` from `0` to `j`. (For calculating `dp[i][j][1]`)
 *         // `sum_dp[i][j][1]` = sum of `dp[k][j][1]` for `k` from `0` to `i`. (For calculating `dp[i][j][0]`)
 *
 *         // Modulo constant
 *         const MOD = 10**9 + 7;
 *
 *         // dp[i][j][0] stores ways to form i zeros, j ones, ending with 0.
 *         // dp[i][j][1] stores ways to form i zeros, j ones, ending with 1.
 *         const dp = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0).map(() => Array(2).fill(0)));
 *
 *         // prefix_sum_ending_0[i][j] = sum(dp[i][k][0] for k=0 to j)
 *         // prefix_sum_ending_1[i][j] = sum(dp[k][j][1] for k=0 to i)
 *         const prefix_sum_ending_0 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));
 *         const prefix_sum_ending_1 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));
 *
 *         // Base cases for single-character runs that are valid
 *         // An array of `k` zeros is valid if `k <= limit`. There's 1 way: `[0,0,...,0]`
 *         for (let k = 1; k <= limit; k++) {
 *             if (k <= zero) {
 *                 dp[k][0][0] = 1;
 *             }
 *             if (k <= one) {
 *                 dp[0][k][1] = 1;
 *             }
 *         }
 *
 *         // Initialize prefix sums based on base cases (for k=0, not yet for general i,j)
 *         // prefix_sum_ending_0[i][0]
 *         for (let i = 0; i <= zero; i++) {
 *             prefix_sum_ending_0[i][0] = (i > 0 ? prefix_sum_ending_0[i-1][0] : 0); // No items ending in 0 and 0 ones
 *         }
 *         // prefix_sum_ending_1[0][j]
 *         for (let j = 0; j <= one; j++) {
 *             prefix_sum_ending_1[0][j] = (j > 0 ? prefix_sum_ending_1[0][j-1] : 0); // No items ending in 1 and 0 zeros
 *         }
 *
 *         // For `dp[i][0][0] = 1` if `1 <= i <= limit`.
 *         // `prefix_sum_ending_1[i][0]` sums `dp[k][0][1]` for `k <= i`. `dp[k][0][1]` is always 0. So `prefix_sum_ending_1[i][0]` is 0.
 *         // `prefix_sum_ending_0[0][j]` sums `dp[0][k][0]` for `k <= j`. `dp[0][k][0]` is always 0. So `prefix_sum_ending_0[0][j]` is 0.
 *
 *         // Recalculate prefix sums incorporating the initial dp values for single-type runs.
 *         // dp[k][0][0] = 1 implies we add this to `prefix_sum_ending_0[k][0]`? No.
 *         // `prefix_sum_ending_0[i][j]` helps calculate `dp[i][j][1]` by summing up `dp[i][k][0]`.
 *         // `prefix_sum_ending_1[i][j]` helps calculate `dp[i][j][0]` by summing up `dp[k][j][1]`.
 *
 *         // Let's first populate the base cases for dp_zero_val and dp_one_val.
 *         // Then calculate prefix sums based on these.
 *
 *         // Iterate through all possible counts of zeros and ones.
 *         for (let i = 0; i <= zero; i++) {
 *             for (let j = 0; j <= one; j++) {
 *                 if (i === 0 && j === 0) continue;
 *
 *                 // Calculate dp[i][j][0] (ending with '0')
 *                 if (i > 0) {
 *                     // Case 1: Array consists only of zeros. Valid if i <= limit.
 *                     if (j === 0) {
 *                         if (i <= limit) {
 *                             dp[i][j][0] = 1;
 *                         }
 *                     } else {
 *                         // Case 2: Array ends with '0' block, preceded by a '1' block.
 *                         // We need to sum dp[i-k][j][1] for k from 1 to limit.
 *                         // This sum is prefix_sum_ending_1[i-1][j] - prefix_sum_ending_1[i-limit-1][j]
 *                         let ways = prefix_sum_ending_1[i - 1][j];
 *                         if (i - limit - 1 >= 0) {
 *                             ways = (ways - prefix_sum_ending_1[i - limit - 1][j] + MOD) % MOD;
 *                         }
 *                         dp[i][j][0] = ways;
 *                     }
 *                 }
 *
 *                 // Calculate dp[i][j][1] (ending with '1')
 *                 if (j > 0) {
 *                     // Case 1: Array consists only of ones. Valid if j <= limit.
 *                     if (i === 0) {
 *                         if (j <= limit) {
 *                             dp[i][j][1] = 1;
 *                         }
 *                     } else {
 *                         // Case 2: Array ends with '1' block, preceded by a '0' block.
 *                         // We need to sum dp[i][j-k][0] for k from 1 to limit.
 *                         // This sum is prefix_sum_ending_0[i][j-1] - prefix_sum_ending_0[i][j-limit-1]
 *                         let ways = prefix_sum_ending_0[i][j - 1];
 *                         if (j - limit - 1 >= 0) {
 *                             ways = (ways - prefix_sum_ending_0[i][j - limit - 1] + MOD) % MOD;
 *                         }
 *                         dp[i][j][1] = ways;
 *                     }
 *                 }
 *
 *                 // Update prefix sums for current (i, j)
 *                 // prefix_sum_ending_0[i][j] = dp[i][j][0] + prefix_sum_ending_0[i][j-1]
 *                 // This isn't quite right. prefix_sum_ending_0[i][j] is sum of dp[i][k][0] for k from 0 to j.
 *                 // prefix_sum_ending_1[i][j] is sum of dp[k][j][1] for k from 0 to i.
 *
 *                 // Update prefix_sum_ending_0 for row i, column j
 *                 prefix_sum_ending_0[i][j] = (dp[i][j][0] + (j > 0 ? prefix_sum_ending_0[i][j-1] : 0)) % MOD;
 *
 *                 // Update prefix_sum_ending_1 for row i, column j
 *                 prefix_sum_ending_1[i][j] = (dp[i][j][1] + (i > 0 ? prefix_sum_ending_1[i-1][j] : 0)) % MOD;
 *             }
 *         }
 *
 *         // The final answer is the sum of ways ending with '0' and ways ending with '1'
 *         // using `zero` zeros and `one` ones.
 *         const ans = (dp[zero][one][0] + dp[zero][one][1]) % MOD;
 *         return ans;
 *
 * Time Complexity:
 * The DP table has dimensions (zero + 1) x (one + 1).
 * Each state calculation involves constant time operations (arithmetic and array lookups)
 * because the sliding window sums (prefix sums) reduce the inner loop from `limit` to O(1).
 * Therefore, the total time complexity is O(zero * one).
 * Given zero, one <= 1000, this is 1000 * 1000 = 10^6 operations, which is acceptable.
 *
 * Space Complexity:
 * We use three 2D DP tables: `dp` (size `(zero+1) x (one+1) x 2`), `prefix_sum_ending_0` (size `(zero+1) x (one+1)`),
 * and `prefix_sum_ending_1` (size `(zero+1) x (one+1)`).
 * The total space complexity is O(zero * one).
 * Given zero, one <= 1000, this is 1000 * 1000 entries per table, which is 10^6 * sizeof(int) * 4 bytes ~ 4MB, acceptable.
 */
function solve(zero, one, limit) {
    const MOD = 10**9 + 7;

    // dp[i][j][0]: Number of stable arrays with i zeros and j ones, ending with '0'.
    // dp[i][j][1]: Number of stable arrays with i zeros and j ones, ending with '1'.
    const dp = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0).map(() => Array(2).fill(0)));

    // prefix_sum_ending_0[i][j]: Sum of dp[i][k][0] for k from 0 to j.
    // This helps calculate dp[i][j][1] efficiently (summing dp[i][j-k][0] for k from 1 to limit).
    const prefix_sum_ending_0 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

    // prefix_sum_ending_1[i][j]: Sum of dp[k][j][1] for k from 0 to i.
    // This helps calculate dp[i][j][0] efficiently (summing dp[i-k][j][1] for k from 1 to limit).
    const prefix_sum_ending_1 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

    // Initialize base cases for arrays consisting of only zeros or only ones.
    // An array like [0, 0, ..., 0] (length k) is stable if k <= limit. There's 1 such array.
    // Similarly for [1, 1, ..., 1].
    for (let k = 1; k <= limit; k++) {
        if (k <= zero) {
            dp[k][0][0] = 1;
        }
        if (k <= one) {
            dp[0][k][1] = 1;
        }
    }

    // Populate the prefix sum tables based on initial dp values (for i=0 or j=0).
    // This is crucial because dp values for (i,0,0) and (0,j,1) need to be included in sums.
    for (let i = 0; i <= zero; i++) {
        for (let j = 0; j <= one; j++) {
            // Update prefix_sum_ending_0 for (i,j)
            prefix_sum_ending_0[i][j] = dp[i][j][0];
            if (j > 0) {
                prefix_sum_ending_0[i][j] = (prefix_sum_ending_0[i][j] + prefix_sum_ending_0[i][j-1]) % MOD;
            }

            // Update prefix_sum_ending_1 for (i,j)
            prefix_sum_ending_1[i][j] = dp[i][j][1];
            if (i > 0) {
                prefix_sum_ending_1[i][j] = (prefix_sum_ending_1[i][j] + prefix_sum_ending_1[i-1][j]) % MOD;
            }
        }
    }

    // Iterate through all possible counts of zeros (i) and ones (j)
    for (let i = 1; i <= zero; i++) {
        for (let j = 1; j <= one; j++) {
            // If i=0 or j=0, these were handled in the base case initialization,
            // so we only need to compute for states where both i > 0 and j > 0.
            // (The outer loops start from i=1, j=1 to avoid re-calculating base cases and ensure correct prefix sums access)
            
            // Calculate dp[i][j][0] (ending with '0'):
            // This means we are appending a block of 'k' zeros to an array of (i-k) zeros and j ones,
            // which must have ended with a '1'. 'k' must be between 1 and limit.
            // The number of ways is sum(dp[i-k][j][1] for k from 1 to min(i, limit)).
            // Using prefix_sum_ending_1: sum(dp[x][j][1] for x from i - limit to i - 1)
            let ways_ending_0 = prefix_sum_ending_1[i - 1][j];
            if (i - limit - 1 >= 0) {
                ways_ending_0 = (ways_ending_0 - prefix_sum_ending_1[i - limit - 1][j] + MOD) % MOD;
            }
            dp[i][j][0] = ways_ending_0;

            // Calculate dp[i][j][1] (ending with '1'):
            // This means we are appending a block of 'k' ones to an array of i zeros and (j-k) ones,
            // which must have ended with a '0'. 'k' must be between 1 and limit.
            // The number of ways is sum(dp[i][j-k][0] for k from 1 to min(j, limit)).
            // Using prefix_sum_ending_0: sum(dp[i][x][0] for x from j - limit to j - 1)
            let ways_ending_1 = prefix_sum_ending_0[i][j - 1];
            if (j - limit - 1 >= 0) {
                ways_ending_1 = (ways_ending_1 - prefix_sum_ending_0[i][j - limit - 1] + MOD) % MOD;
            }
            dp[i][j][1] = ways_ending_1;

            // Update prefix sums for current (i, j) based on newly calculated dp values.
            // prefix_sum_ending_0[i][j] = dp[i][j][0] + prefix_sum_ending_0[i][j-1]
            prefix_sum_ending_0[i][j] = (dp[i][j][0] + prefix_sum_ending_0[i][j-1]) % MOD;
            
            // prefix_sum_ending_1[i][j] = dp[i][j][1] + prefix_sum_ending_1[i-1][j]
            prefix_sum_ending_1[i][j] = (dp[i][j][1] + prefix_sum_ending_1[i-1][j]) % MOD;
        }
    }

    // The final answer is the total number of stable arrays with `zero` zeros and `one` ones,
    // which can either end with '0' or '1'.
    const ans = (dp[zero][one][0] + dp[zero][one][1]) % MOD;
    return ans;
}
```