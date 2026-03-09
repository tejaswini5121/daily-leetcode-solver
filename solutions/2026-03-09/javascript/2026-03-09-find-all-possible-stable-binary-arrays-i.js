/**
 * @param {number} zero
 * @param {number} one
 * @param {number} limit
 * @return {number}
 */
// Problem: Find All Possible Stable Binary Arrays I
// Link: https://leetcode.com/problems/find-all-possible-stable-binary-arrays-i/
// Approach:
// This problem can be solved using dynamic programming. We define dp[i][j] as the number of stable binary arrays with 'i' zeros and 'j' ones.
// The base cases are:
// dp[0][0] = 1 (empty array, though not directly reachable by problem constraints)
// dp[i][0] = 1 if i <= limit (an array of only zeros where no subarray longer than limit has only zeros)
// dp[0][j] = 1 if j <= limit (an array of only ones where no subarray longer than limit has only ones)
//
// The transitions are:
// To form a stable array with 'i' zeros and 'j' ones, the last element can be either '0' or '1'.
//
// If the last element is '0':
// The previous state could be dp[i-1][j]. However, we need to ensure that adding a '0' doesn't violate the limit condition.
// This means that the subarray of length (limit + 1) ending with this '0' must not consist of all '0's.
// This implies that if we add a '0', the number of preceding zeros cannot exceed 'limit'.
// So, if we add a '0' at the end, the number of zeros before it can range from max(0, i - limit) to i - 1.
// The number of ways to form dp[i][j] ending with '0' is the sum of dp[k][j] for k from max(0, i - limit) to i - 1.
//
// If the last element is '1':
// Similarly, if we add a '1' at the end, the number of preceding ones can range from max(0, j - limit) to j - 1.
// The number of ways to form dp[i][j] ending with '1' is the sum of dp[i][k] for k from max(0, j - limit) to j - 1.
//
// dp[i][j] = (sum of dp[k][j] for k in [max(0, i-limit), i-1]) + (sum of dp[i][k] for k in [max(0, j-limit), j-1])
//
// To optimize the sum calculation, we can use prefix sums. Let
// prefix_zeros[i][j] be the sum of dp[k][j] for k from 0 to i.
// prefix_ones[i][j] be the sum of dp[i][k] for k from 0 to j.
//
// Then, the sum of dp[k][j] for k in [max(0, i-limit), i-1] is prefix_zeros[i-1][j] - prefix_zeros[max(0, i-limit)-1][j].
// And, the sum of dp[i][k] for k in [max(0, j-limit), j-1] is prefix_ones[i][j-1] - prefix_ones[i][max(0, j-limit)-1].
//
// The state space is zero * one.
// The calculation for each state involves iterating up to 'limit' for prefix sums.
// Time Complexity: O(zero * one * limit) due to prefix sum calculations within each DP state.
// Space Complexity: O(zero * one) for the DP table and prefix sum tables.
//
// We can further optimize the DP transition by noticing that:
// To calculate dp[i][j], we need sums of previous values.
// If the array ends with '0', the previous state was an array with i-1 zeros and j ones, and the last element was either '0' or '1'.
// The condition is that no subarray of length limit+1 can have only '0's. This means if we have 'i' zeros, the previous 'limit' elements cannot all be '0' if we are adding another '0'.
//
// Let dp[i][j][0] be the number of stable arrays with 'i' zeros and 'j' ones, ending with '0'.
// Let dp[i][j][1] be the number of stable arrays with 'i' zeros and 'j' ones, ending with '1'.
//
// dp[i][j][0] = sum(dp[k][j][0] + dp[k][j][1]) for k from max(0, i-limit) to i-1
// dp[i][j][1] = sum(dp[i][k][0] + dp[i][k][1]) for k from max(0, j-limit) to j-1
//
// Base cases:
// dp[1][0][0] = 1 (for [0])
// dp[0][1][1] = 1 (for [1])
//
// We can use prefix sums to optimize the summation:
// Let S[i][j] = dp[i][j][0] + dp[i][j][1]
//
// dp[i][j][0] = sum(S[k][j]) for k from max(0, i-limit) to i-1
// dp[i][j][1] = sum(S[i][k]) for k from max(0, j-limit) to j-1
//
// This still seems to lead to O(zero * one * limit).
//
// Let's reconsider the problem constraints and the "each subarray of arr with a size greater than limit must contain both 0 and 1".
// This means we cannot have `limit + 1` consecutive identical elements.
//
// Let dp[i][j] be the number of stable binary arrays using 'i' zeros and 'j' ones.
//
// To build a stable array of length `i + j` with `i` zeros and `j` ones:
//
// 1. The array can end with a '0'. The previous state was an array with `i-1` zeros and `j` ones.
//    For this to be valid, the last `limit` elements of the array ending with '0' cannot all be '0'.
//    This means if we are adding a '0', the number of zeros immediately preceding it must be at most `limit - 1`.
//    So, the number of zeros in the prefix can range from `max(0, i - limit)` to `i - 1`.
//    The number of such arrays ending with '0' is `sum(dp[k][j])` for `k` from `max(0, i - limit)` to `i - 1`.
//
// 2. The array can end with a '1'. The previous state was an array with `i` zeros and `j-1` ones.
//    Similarly, the number of ones immediately preceding it must be at most `limit - 1`.
//    The number of ones in the prefix can range from `max(0, j - limit)` to `j - 1`.
//    The number of such arrays ending with '1' is `sum(dp[i][k])` for `k` from `max(0, j - limit)` to `j - 1`.
//
// `dp[i][j] = (sum(dp[k][j] for k in [max(0, i - limit), i - 1])) + (sum(dp[i][k] for k in [max(0, j - limit), j - 1]))`
//
// The total length of the array is `zero + one`. We need `dp[zero][one]`.
//
// We can use prefix sums to compute these sums efficiently.
// Let `ps_zeros[i][j]` be the sum of `dp[k][j]` for `k` from `0` to `i`.
// Let `ps_ones[i][j]` be the sum of `dp[i][k]` for `k` from `0` to `j`.
//
// Then, `sum(dp[k][j] for k in [max(0, i - limit), i - 1])` = `ps_zeros[i - 1][j] - ps_zeros[max(0, i - limit) - 1][j]`.
// And, `sum(dp[i][k] for k in [max(0, j - limit), j - 1])` = `ps_ones[i][j - 1] - ps_ones[i][max(0, j - limit) - 1]`.
//
// The modulo is 10^9 + 7.
//
// Initialize DP table `dp[zero+1][one+1]` with 0.
// Initialize prefix sum tables `ps_zeros[zero+1][one+1]` and `ps_ones[zero+1][one+1]` with 0.
//
// Base cases:
// For `i` from 0 to `zero`: if `i <= limit`, `dp[i][0] = 1`.
// For `j` from 0 to `one`: if `j <= limit`, `dp[0][j] = 1`.
//
// After initializing the base cases in `dp`, populate the prefix sum tables.
// `ps_zeros[i][j] = (dp[i][j] + ps_zeros[i-1][j]) % MOD`
// `ps_ones[i][j] = (dp[i][j] + ps_ones[i][j-1]) % MOD`
//
// Iterate `i` from 0 to `zero` and `j` from 0 to `one`.
// If `i == 0` and `j == 0`, `dp[0][0] = 1` (conceptually for an empty prefix, though not directly used).
// If `i > 0` and `j == 0`: if `i <= limit`, `dp[i][0] = 1`. Else `dp[i][0] = 0`.
// If `i == 0` and `j > 0`: if `j <= limit`, `dp[0][j] = 1`. Else `dp[0][j] = 0`.
//
// For `i > 0` and `j > 0`:
// `count_ending_with_0 = 0`
// If `i - 1 >= 0`:
//   `lower_bound_zeros = max(0, i - limit)`
//   `upper_bound_zeros = i - 1`
//   `term1 = (ps_zeros[upper_bound_zeros][j] - (lower_bound_zeros > 0 ? ps_zeros[lower_bound_zeros - 1][j] : 0) + MOD) % MOD`
//   `count_ending_with_0 = term1`
//
// `count_ending_with_1 = 0`
// If `j - 1 >= 0`:
//   `lower_bound_ones = max(0, j - limit)`
//   `upper_bound_ones = j - 1`
//   `term2 = (ps_ones[i][upper_bound_ones] - (lower_bound_ones > 0 ? ps_ones[i][lower_bound_ones - 1] : 0) + MOD) % MOD`
//   `count_ending_with_1 = term2`
//
// `dp[i][j] = (count_ending_with_0 + count_ending_with_1) % MOD`
//
// The iteration order matters. We need to fill DP table and prefix sums in increasing order of `i` and `j`.
//
// Let's refine the DP state and transitions.
// `dp[i][j]` = number of stable arrays with `i` zeros and `j` ones.
//
// Base cases:
// `dp[0][0] = 1` (This represents an empty array or a neutral state to start building from. It won't be the final answer unless zero=0 and one=0, which is not allowed by constraints.)
//
// For `i` from 1 to `zero`:
//   If `i <= limit`, `dp[i][0] = 1` (array of `i` zeros is stable).
// For `j` from 1 to `one`:
//   If `j <= limit`, `dp[0][j] = 1` (array of `j` ones is stable).
//
// We can use a single DP table `dp[zero+1][one+1]` and compute it row by row or column by column.
// However, the prefix sum optimization suggests filling the table and using prefix sums for transitions.
//
// Let's use two DP tables to store counts ending in 0 and 1.
// `dp0[i][j]` = number of stable arrays with `i` zeros and `j` ones, ending in '0'.
// `dp1[i][j]` = number of stable arrays with `i` zeros and `j` ones, ending in '1'.
//
// Modulo constant.
const MOD = 1e9 + 7;

// Initialize DP tables.
// `dp0[i][j]` will store the number of stable arrays with `i` zeros and `j` ones ending in '0'.
// `dp1[i][j]` will store the number of stable arrays with `i` zeros and `j` ones ending in '1'.
// The dimensions are (zero + 1) x (one + 1).
let dp0 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));
let dp1 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

// Base cases:
// For an array with one '0' and zero '1's, ending in '0'.
if (zero >= 1) {
    dp0[1][0] = 1;
}
// For an array with zero '0's and one '1', ending in '1'.
if (one >= 1) {
    dp1[0][one] = 1; // Oops, this should be dp1[0][1] not dp1[0][one]. Correcting this.
    // Correcting base case for dp1: An array with 0 zeros and 1 one, ending in 1.
    if (one >= 1) {
        dp1[0][1] = 1;
    }
}
// The problem statement implies we are looking for arrays *exactly* with `zero` zeros and `one` ones.
// So, the DP states should reflect this.
// `dp0[i][j]` = count of stable arrays with `i` zeros and `j` ones, ending in '0'.
// `dp1[i][j]` = count of stable arrays with `i` zeros and `j` ones, ending in '1'.

// Re-initializing DP tables to simplify logic.
// We will iterate through all possible counts of zeros (i) and ones (j) up to the target `zero` and `one`.
// `dp0[i][j]` = number of stable arrays using `i` zeros and `j` ones, ending with '0'.
// `dp1[i][j]` = number of stable arrays using `i` zeros and `j` ones, ending with '1'.
dp0 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));
dp1 = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

// Base case: An array with only one '0'. It must be stable as limit >= 1.
// For i=1, j=0, the array is [0]. It ends with '0'.
if (zero >= 1) {
    dp0[1][0] = 1;
}

// Base case: An array with only one '1'. It must be stable as limit >= 1.
// For i=0, j=1, the array is [1]. It ends with '1'.
if (one >= 1) {
    dp1[0][1] = 1;
}

// Iterate through all possible counts of zeros (i) and ones (j).
for (let i = 0; i <= zero; i++) {
    for (let j = 0; j <= one; j++) {
        // Skip base cases that have already been initialized.
        if (i === 1 && j === 0) continue;
        if (i === 0 && j === 1) continue;
        if (i === 0 && j === 0) continue; // No elements means 0 stable arrays unless zero=0, one=0

        // Calculate `dp0[i][j]`: number of stable arrays with `i` zeros and `j` ones, ending in '0'.
        // To form such an array, the previous state must have `i-1` zeros and `j` ones.
        // The last element added was '0'.
        // The condition is that no subarray of length `limit + 1` can consist of only '0's.
        // This means the sequence of '0's ending at the current position cannot be longer than `limit`.
        // So, if we add a '0', the previous `limit` elements cannot all be '0'.
        // This implies that the number of zeros in the prefix (before the last '0') cannot exceed `limit - 1`.
        // If the last added element is '0', then the previous `limit` elements must not all be '0'.
        // This means the previous state must have had `i-1` zeros and `j` ones, and the last element was NOT one of `limit` consecutive zeros.
        //
        // A simpler way to think:
        // If we end with a '0', the prefix array had `i-1` zeros and `j` ones.
        // The constraint is that the current sequence of `0`s cannot be longer than `limit`.
        // This means the array of `i` zeros and `j` ones ending with `0` can be formed by:
        // - Appending a `0` to a stable array with `i-1` zeros and `j` ones, AS LONG AS adding this `0` does not create `limit+1` consecutive `0`s.
        //
        // The DP transition needs to consider the sum of states from the previous counts.
        //
        // To get to `dp0[i][j]` (ending in '0'):
        // The previous state must have had `i-1` zeros and `j` ones.
        // The last added element was '0'.
        // The number of consecutive zeros ending at `i-1` must be less than `limit`.
        //
        // This implies that any stable array with `i-1` zeros and `j` ones, ending in '0' or '1', can be extended by a '0', provided that adding this '0' doesn't violate the limit.
        // The violation occurs if we have `limit` consecutive zeros and add one more.
        //
        // So, to form `dp0[i][j]`:
        // We consider all stable arrays with `i-1` zeros and `j` ones.
        // If we append '0' to a stable array with `i-1` zeros and `j` ones, we get an array with `i` zeros and `j` ones ending in '0'.
        // The only restriction is if this creates `limit + 1` consecutive `0`s.
        // This means if the array of `i-1` zeros and `j` ones already ended in `limit` zeros, we cannot append another zero.
        //
        // Let's use prefix sums.
        // `sum_dp0_prev_i[i_val][j_val]` = sum of `dp0[k][j_val]` for `k` from 0 to `i_val`.
        // `sum_dp1_prev_j[i_val][j_val]` = sum of `dp1[i_val][k]` for `k` from 0 to `j_val`.
        //
        // To calculate `dp0[i][j]`:
        // We need to sum up counts of stable arrays with `k` zeros and `j` ones, where `i - limit <= k <= i - 1`.
        // These are the states that can transition to `dp0[i][j]` by adding a '0'.
        //
        // The number of stable arrays with `k` zeros and `j` ones ending in '0' or '1' is `dp0[k][j] + dp1[k][j]`.
        // So, `dp0[i][j] = sum(dp0[k][j] + dp1[k][j])` for `k` from `max(0, i - limit)` to `i - 1`.
        //
        // Similarly, for `dp1[i][j]`:
        // `dp1[i][j] = sum(dp0[i][k] + dp1[i][k])` for `k` from `max(0, j - limit)` to `j - 1`.

        // Pre-calculate sums to optimize transitions.
        // `sum_prev_zeros[i][j]` = sum of `dp0[k][j] + dp1[k][j]` for `k` from 0 to `i`.
        // `sum_prev_ones[i][j]` = sum of `dp0[i][k] + dp1[i][k]` for `k` from 0 to `j`.

        // This approach would require pre-calculating these sums for all `i` and `j`.
        // The current loop structure is iterating `i` and `j` and calculating `dp0[i][j]` and `dp1[i][j]` based on prior values.
        // We can maintain these sums as we iterate.

        // To calculate `dp0[i][j]`:
        // We need the sum of (dp0[k][j] + dp1[k][j]) for k in [max(0, i-limit), i-1].
        // If we iterate `i` and `j` in increasing order, we need these prefix sums.
        // Let's create prefix sum arrays.
        // `prefix_sum_col[i_val][j_val]` stores sum of `dp0[k][j_val] + dp1[k][j_val]` for `k` from 0 to `i_val`.
        // `prefix_sum_row[i_val][j_val]` stores sum of `dp0[i_val][k] + dp1[i_val][k]` for `k` from 0 to `j_val`.

        // We can do this within the loop.
        // For `dp0[i][j]`:
        // This state is reached by adding a '0' to a stable array with `i-1` zeros and `j` ones.
        // The number of such arrays is `dp0[i-1][j] + dp1[i-1][j]`.
        // However, this is for the count ending with `i-1` zeros and `j` ones.
        // The constraint: no `limit+1` consecutive identical elements.
        // If we are calculating `dp0[i][j]`, we are adding a '0'.
        // This '0' can extend any stable array with `i-1` zeros and `j` ones, UNLESS the original array ended with `limit` zeros.
        //
        // Consider state `dp0[i][j]`:
        // It is formed by taking a stable array with `i-1` zeros and `j` ones, and appending a '0'.
        // The number of ways to form a stable array with `i-1` zeros and `j` ones is `dp0[i-1][j] + dp1[i-1][j]`.
        // BUT, if `i > limit`, we cannot simply add `dp0[i-1][j] + dp1[i-1][j]`.
        // We need to subtract the cases that would lead to `limit+1` consecutive zeros.
        // This happens if the array of `i-1` zeros and `j` ones ENDED in `limit` zeros.
        // The number of stable arrays with `i-1` zeros and `j` ones, ENDING IN `limit` zeros, is what we need to exclude.
        //
        // This suggests a DP state that includes the count of consecutive identical elements at the end. This becomes too complex.

        // Let's use the prefix sum approach.
        // `dp[i][j]` = total stable arrays with `i` zeros and `j` ones.
        // `dp[i][j] = (sum_{k=max(0, i-limit)}^{i-1} dp[k][j]) + (sum_{k=max(0, j-limit)}^{j-1} dp[i][k])`
        //
        // `dp[i][0]` for `i` from 1 to `limit` is 1.
        // `dp[0][j]` for `j` from 1 to `limit` is 1.

        // Initialize DP table.
        let dp = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

        // Base cases: Arrays with only zeros or only ones, up to length `limit`.
        for (let i = 0; i <= zero; i++) {
            if (i <= limit) {
                dp[i][0] = 1;
            } else {
                break; // No more stable arrays with only zeros if length > limit
            }
        }
        for (let j = 0; j <= one; j++) {
            if (j <= limit) {
                dp[0][j] = 1;
            } else {
                break; // No more stable arrays with only ones if length > limit
            }
        }

        // Now, iterate to fill the rest of the DP table.
        // For each cell `dp[i][j]`, we need prefix sums of columns `j` and rows `i`.
        // We can calculate these prefix sums on the fly or use separate tables.
        // Let's calculate prefix sums for columns first, then for rows.

        // `col_prefix_sum[i][j]` = sum of `dp[k][j]` for `k` from 0 to `i`.
        let col_prefix_sum = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

        // Populate initial col_prefix_sum based on base cases.
        for (let j = 0; j <= one; j++) {
            for (let i = 0; i <= zero; i++) {
                col_prefix_sum[i][j] = dp[i][j];
                if (i > 0) {
                    col_prefix_sum[i][j] = (col_prefix_sum[i][j] + col_prefix_sum[i - 1][j]) % MOD;
                }
            }
        }

        // Now, fill the DP table and update col_prefix_sum.
        for (let i = 1; i <= zero; i++) {
            for (let j = 1; j <= one; j++) {
                // Calculate `dp[i][j]` using prefix sums of column `j` and row `i`.

                // Term 1: Sum of dp[k][j] for k in [max(0, i-limit), i-1]
                // This represents arrays ending with '0'.
                let term1_count = 0;
                let lower_bound_zeros = Math.max(0, i - limit);
                let upper_bound_zeros = i - 1; // The state we transition FROM

                if (upper_bound_zeros >= 0) { // We need at least one element to transition from
                    // Sum dp[k][j] for k from lower_bound_zeros to upper_bound_zeros
                    // Using col_prefix_sum[upper_bound_zeros][j] - col_prefix_sum[lower_bound_zeros - 1][j]
                    let sum_up_to_upper = col_prefix_sum[upper_bound_zeros][j];
                    let sum_before_lower = (lower_bound_zeros > 0) ? col_prefix_sum[lower_bound_zeros - 1][j] : 0;
                    term1_count = (sum_up_to_upper - sum_before_lower + MOD) % MOD;
                }

                // Term 2: Sum of dp[i][k] for k in [max(0, j-limit), j-1]
                // This represents arrays ending with '1'.
                // This requires prefix sums of rows.
                // We can't directly use `col_prefix_sum` here.
                // This means we need a way to access row sums efficiently.

                // Let's rethink the DP state and transition to avoid complex prefix sum management.

                // Alternative DP state:
                // `dp[i][j]` = number of stable arrays with `i` zeros and `j` ones.
                //
                // `dp[i][j] = (dp[i-1][j] if i-1 >= 0) + (dp[i][j-1] if j-1 >= 0)` -- This is for general path counting.
                // We need to incorporate the `limit`.
                //
                // The condition "Each subarray of arr with a size greater than limit must contain both 0 and 1"
                // means no `limit + 1` consecutive zeros OR `limit + 1` consecutive ones.
                //
                // Let's define `dp[i][j]` as the number of ways to form a stable array using *exactly* `i` zeros and `j` ones.
                //
                // To form a stable array with `i` zeros and `j` ones:
                // 1. The last element is '0'. The prefix had `i-1` zeros and `j` ones.
                //    This is valid IF the last `limit` elements of the prefix were NOT all zeros.
                //    The number of stable arrays with `i-1` zeros and `j` ones ending in '0' can be at most `dp[i-1][j]`.
                //    If `i > limit`, we must exclude cases where the previous `limit` elements were all '0'.
                //    This means we need to consider the state `dp[i - (limit + 1)][j]`.
                //    The number of ways to form an array ending with '0' is:
                //    `dp[i-1][j]` - `dp[i - limit - 1][j]` (if `i >= limit + 1`)
                //
                // 2. The last element is '1'. The prefix had `i` zeros and `j-1` ones.
                //    Similar logic:
                //    `dp[i][j-1]` - `dp[i][j - limit - 1]` (if `j >= limit + 1`)
                //
                // So, `dp[i][j] = (dp[i-1][j] if i > 0) + (dp[i][j-1] if j > 0)`
                // Correcting for the limit:
                //
                // `dp[i][j] = (dp[i-1][j] if i > 0) + (dp[i][j-1] if j > 0)` -- This is the basic count without limit.
                //
                // To incorporate the limit:
                // An array ending in '0' can be formed by appending '0' to:
                // - Any stable array of `i-1` zeros and `j` ones.
                //   The total number of stable arrays with `i-1` zeros and `j` ones that end in '0' is `dp[i-1][j]`.
                //   However, we need to subtract cases that would create `limit+1` consecutive zeros.
                //   These are the arrays of `i-1` zeros and `j` ones that were formed by appending '0' to a state with `i-2` zeros and `j` ones, and so on.
                //   The problematic arrays are those with `i-1` zeros and `j` ones where the last `limit` elements are '0'.
                //   These are exactly the arrays of `i-1-limit` zeros and `j` ones that we can append `limit+1` zeros to.
                //   So, `dp[i][j]` contribution from ending in '0' is `dp[i-1][j] - dp[i-limit-1][j]`.
                //
                // This seems to be the correct interpretation for the constraint "Each subarray of arr with a size greater than limit must contain both 0 and 1."
                // This is equivalent to: No subarray of length `limit + 1` can be all `0`s, AND no subarray of length `limit + 1` can be all `1`s.
                //
                // Let `dp[i][j]` be the number of stable binary arrays with `i` zeros and `j` ones.
                //
                // Base cases:
                // `dp[0][0] = 1` (empty array)
                // For `i` from 1 to `zero`: if `i <= limit`, `dp[i][0] = 1`.
                // For `j` from 1 to `one`: if `j <= limit`, `dp[0][j] = 1`.
                //
                // Transition:
                // `dp[i][j] = 0`
                //
                // If `i > 0`:
                //   The number of ways to form `dp[i][j]` ending in '0' is:
                //   `dp[i-1][j]` (if we can append '0' to any stable array with `i-1` zeros and `j` ones).
                //   BUT, we must subtract cases that would result in `limit+1` consecutive zeros.
                //   These problematic cases are arrays with `i-1` zeros and `j` ones that already end with `limit` zeros.
                //   These problematic arrays are formed by appending `limit` zeros to stable arrays with `i-1-limit` zeros and `j` ones.
                //   So, we subtract `dp[i-limit-1][j]` if `i - limit - 1 >= 0`.
                //   `ways_ending_in_0 = dp[i-1][j]`
                //   If `i - limit - 1 >= 0`: `ways_ending_in_0 = (ways_ending_in_0 - dp[i-limit-1][j] + MOD) % MOD`
                //   `dp[i][j] = (dp[i][j] + ways_ending_in_0) % MOD`
                //
                // If `j > 0`:
                //   The number of ways to form `dp[i][j]` ending in '1' is:
                //   `dp[i][j-1]` (if we can append '1' to any stable array with `i` zeros and `j-1` ones).
                //   Subtract cases that result in `limit+1` consecutive ones: `dp[i][j-limit-1]` if `j - limit - 1 >= 0`.
                //   `ways_ending_in_1 = dp[i][j-1]`
                //   If `j - limit - 1 >= 0`: `ways_ending_in_1 = (ways_ending_in_1 - dp[i][j-limit-1] + MOD) % MOD`
                //   `dp[i][j] = (dp[i][j] + ways_ending_in_1) % MOD`
                //
                // Let's re-initialize DP table and fill it correctly.

                // DP table initialization.
                dp = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

                // Base case: An empty array is conceptually one way to have 0 zeros and 0 ones.
                // dp[0][0] = 1; // This base case is for convenience of recursion, but the problem implies positive zero and one.
                // Let's handle the actual constraints. We need exactly 'zero' zeros and 'one' ones.

                // Initialize base cases for arrays with only zeros or only ones.
                // An array of `i` zeros and 0 ones is stable if `i <= limit`.
                for (let i_val = 0; i_val <= zero; i_val++) {
                    if (i_val <= limit) {
                        dp[i_val][0] = 1;
                    } else {
                        // If i_val > limit, dp[i_val][0] will remain 0, which is correct.
                        // No need for break here if we want to fill the entire table, but for logic, it's fine.
                    }
                }
                // An array of 0 zeros and `j` ones is stable if `j <= limit`.
                for (let j_val = 0; j_val <= one; j_val++) {
                    if (j_val <= limit) {
                        dp[0][j_val] = 1;
                    } else {
                        // If j_val > limit, dp[0][j_val] will remain 0, which is correct.
                    }
                }

                // Fill the DP table.
                for (let i_val = 1; i_val <= zero; i_val++) {
                    for (let j_val = 1; j_val <= one; j_val++) {
                        // Calculate contribution from ending with '0'.
                        // This comes from arrays with `i_val - 1` zeros and `j_val` ones.
                        // Total ways to form stable array with `i_val - 1` zeros and `j_val` ones is `dp[i_val - 1][j_val]`.
                        // We subtract ways that would lead to `limit + 1` consecutive zeros.
                        // These problematic ways are formed by taking stable arrays with `i_val - 1 - limit` zeros and `j_val` ones
                        // and appending `limit + 1` zeros.
                        // So we subtract `dp[i_val - limit - 1][j_val]`.
                        let ways_ending_in_0 = dp[i_val - 1][j_val];
                        if (i_val - limit - 1 >= 0) {
                            ways_ending_in_0 = (ways_ending_in_0 - dp[i_val - limit - 1][j_val] + MOD) % MOD;
                        }
                        dp[i_val][j_val] = (dp[i_val][j_val] + ways_ending_in_0) % MOD;

                        // Calculate contribution from ending with '1'.
                        // This comes from arrays with `i_val` zeros and `j_val - 1` ones.
                        // Total ways to form stable array with `i_val` zeros and `j_val - 1` ones is `dp[i_val][j_val - 1]`.
                        // Subtract ways that lead to `limit + 1` consecutive ones.
                        // These problematic ways are formed by taking stable arrays with `i_val` zeros and `j_val - 1 - limit` ones
                        // and appending `limit + 1` ones.
                        // So we subtract `dp[i_val][j_val - limit - 1]`.
                        let ways_ending_in_1 = dp[i_val][j_val - 1];
                        if (j_val - limit - 1 >= 0) {
                            ways_ending_in_1 = (ways_ending_in_1 - dp[i_val][j_val - limit - 1] + MOD) % MOD;
                        }
                        dp[i_val][j_val] = (dp[i_val][j_val] + ways_ending_in_1) % MOD;
                    }
                }

                // The final answer is dp[zero][one].
                return dp[zero][one];
            }
        }
    }
}
// Resetting and re-implementing the correct DP logic.

// Initialize DP table `dp[i][j]` which stores the number of stable binary arrays
// with `i` zeros and `j` ones.
const MOD = 1e9 + 7;
let dp = Array(zero + 1).fill(0).map(() => Array(one + 1).fill(0));

// Base cases:
// An array consisting only of zeros:
// `dp[i][0] = 1` if `i <= limit` (because no subarray of length > limit can contain only zeros if the total length is <= limit).
// `dp[i][0] = 0` if `i > limit`.
for (let i = 0; i <= zero; i++) {
    if (i <= limit) {
        dp[i][0] = 1;
    }
}

// An array consisting only of ones:
// `dp[0][j] = 1` if `j <= limit`.
// `dp[0][j] = 0` if `j > limit`.
for (let j = 0; j <= one; j++) {
    if (j <= limit) {
        dp[0][j] = 1;
    }
}

// Fill the DP table using the recurrence relation.
// For `dp[i][j]`, consider the last element added.
//
// Case 1: The last element is '0'.
// This array is formed by appending '0' to a stable array with `i-1` zeros and `j` ones.
// The number of such stable arrays is `dp[i-1][j]`.
// However, we must subtract cases that would result in `limit + 1` consecutive zeros.
// These problematic cases are formed by taking a stable array with `i - 1 - limit` zeros and `j` ones
// and appending `limit + 1` zeros.
// The number of such problematic arrays is `dp[i - limit - 1][j]`.
// So, the contribution from ending in '0' is `dp[i-1][j] - dp[i-limit-1][j]`.
//
// Case 2: The last element is '1'.
// This array is formed by appending '1' to a stable array with `i` zeros and `j-1` ones.
// The number of such stable arrays is `dp[i][j-1]`.
// We must subtract cases that would result in `limit + 1` consecutive ones.
// These problematic cases are formed by taking a stable array with `i` zeros and `j - 1 - limit` ones
// and appending `limit + 1` ones.
// The number of such problematic arrays is `dp[i][j - limit - 1]`.
// So, the contribution from ending in '1' is `dp[i][j-1] - dp[i][j-limit-1]`.
//
// `dp[i][j] = (contribution_from_ending_in_0) + (contribution_from_ending_in_1)`

for (let i = 1; i <= zero; i++) {
    for (let j = 1; j <= one; j++) {
        // Contribution from ending in '0'.
        // We need at least one zero to end in '0', so i > 0.
        let ways_ending_in_0 = dp[i - 1][j];
        if (i - limit - 1 >= 0) { // Check if we can subtract problematic cases.
            ways_ending_in_0 = (ways_ending_in_0 - dp[i - limit - 1][j] + MOD) % MOD;
        }
        dp[i][j] = (dp[i][j] + ways_ending_in_0) % MOD;

        // Contribution from ending in '1'.
        // We need at least one one to end in '1', so j > 0.
        let ways_ending_in_1 = dp[i][j - 1];
        if (j - limit - 1 >= 0) { // Check if we can subtract problematic cases.
            ways_ending_in_1 = (ways_ending_in_1 - dp[i][j - limit - 1] + MOD) % MOD;
        }
        dp[i][j] = (dp[i][j] + ways_ending_in_1) % MOD;
    }
}

// The final answer is the number of stable binary arrays with exactly `zero` zeros and `one` ones.
return dp[zero][one];
