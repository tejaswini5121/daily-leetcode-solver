// Problem Summary: Count the number of arrays of length n where elements are in [l, r], no adjacent elements are equal, and no three consecutive elements form a strictly increasing or decreasing sequence.
// Link: https://leetcode.com/problems/number-of-zigzag-arrays-i/
// Approach: Dynamic Programming. We'll use a 3D DP array `dp[i][j][k]`, where:
// `i` is the current length of the array being built (from 1 to n).
// `j` is the value of the last element added to the array.
// `k` represents the direction of the trend leading to the last element:
// `k = 0`: The second to last element was less than the last element (increasing trend).
// `k = 1`: The second to last element was greater than the last element (decreasing trend).
//
// Base Case: For `i = 1`, any value from `l` to `r` can be the first element. So `dp[1][val][0] = dp[1][val][1] = 1` for `l <= val <= r`.
//
// Transitions: To calculate `dp[i][current_val][current_direction]`, we iterate through all possible previous values `prev_val` and previous directions `prev_direction`.
//
// If `current_direction` is increasing (0), meaning `prev_val < current_val`:
//  - We can transition from `dp[i-1][prev_val][0]` (previous was increasing). This is valid as long as `prev_val < current_val`.
//  - We can transition from `dp[i-1][prev_val][1]` (previous was decreasing). This is valid as long as `prev_val < current_val`.
//  - Crucially, we must avoid the strictly increasing condition: `prev_prev_val < prev_val < current_val`. This means the previous trend must NOT be increasing if `prev_val < current_val`. So, if `current_direction` is increasing, we must transition from `dp[i-1][prev_val][1]` (previous was decreasing).
//
// If `current_direction` is decreasing (1), meaning `prev_val > current_val`:
//  - Similar logic. To avoid strictly decreasing `prev_prev_val > prev_val > current_val`, if `current_direction` is decreasing, we must transition from `dp[i-1][prev_val][0]` (previous was increasing).
//
// However, the problem states "No three consecutive elements form a strictly increasing or strictly decreasing sequence". This implies that if the current step is an increase (`prev_val < current_val`), the previous step must NOT have been an increase (i.e., `prev_prev_val > prev_val`). Conversely, if the current step is a decrease (`prev_val > current_val`), the previous step must NOT have been a decrease (i.e., `prev_prev_val < prev_val`).
//
// Let's refine the DP state and transitions:
// `dp[i][j][0]` = number of valid ZigZag arrays of length `i` ending with value `j`, where the last transition was an increase (i.e., `array[i-1] = j` and `array[i-2] < array[i-1]`).
// `dp[i][j][1]` = number of valid ZigZag arrays of length `i` ending with value `j`, where the last transition was a decrease (i.e., `array[i-1] = j` and `array[i-2] > array[i-1]`).
//
// For `i` from 2 to `n`:
// For `current_val` from `l` to `r`:
//  // Calculate `dp[i][current_val][0]` (ends with an increase)
//  // This means `prev_val < current_val`.
//  // To avoid `prev_prev_val < prev_val < current_val`, the previous state must have ended with a decrease.
//  For `prev_val` from `l` to `current_val - 1`:
//      `dp[i][current_val][0] = (dp[i][current_val][0] + dp[i-1][prev_val][1]) % MOD;`
//
//  // Calculate `dp[i][current_val][1]` (ends with a decrease)
//  // This means `prev_val > current_val`.
//  // To avoid `prev_prev_val > prev_val > current_val`, the previous state must have ended with an increase.
//  For `prev_val` from `current_val + 1` to `r`:
//      `dp[i][current_val][1] = (dp[i][current_val][1] + dp[i-1][prev_val][0]) % MOD;`
//
//
// This direct transition has O(N * R * R) which is too slow. We can optimize using prefix sums.
//
// Optimized DP:
// `dp[i][j][0]` = number of valid ZigZag arrays of length `i` ending with value `j`, where the last transition was an increase (`array[i-2] < array[i-1]`).
// `dp[i][j][1]` = number of valid ZigZag arrays of length `i` ending with value `j`, where the last transition was a decrease (`array[i-2] > array[i-1]`).
//
// Base Case (i = 1):
// For `val` from `l` to `r`:
// `dp[1][val][0] = 1` (conceptually, as there's no previous element, the 'trend' is undefined but we can consider it a starting point for an increase)
// `dp[1][val][1] = 1` (similarly for a decrease)
//
// For `i` from 2 to `n`:
// Calculate prefix sums for `dp[i-1][val][0]` and `dp[i-1][val][1]` to quickly sum up ranges.
// Let `prefix_sum0[k]` = sum of `dp[i-1][v][0]` for `l <= v <= k`.
// Let `prefix_sum1[k]` = sum of `dp[i-1][v][1]` for `l <= v <= k`.
//
// For `current_val` from `l` to `r`:
//  // `dp[i][current_val][0]` (ends with increase: `prev_val < current_val`)
//  // Previous must have ended with a decrease: `array[i-3] > array[i-2]`.
//  // This means we sum `dp[i-1][prev_val][1]` for `l <= prev_val < current_val`.
//  // This sum is `prefix_sum1[current_val - 1]`.
//  `dp[i][current_val][0] = prefix_sum1[current_val - 1]` (modulo MOD)
//
//  // `dp[i][current_val][1]` (ends with decrease: `prev_val > current_val`)
//  // Previous must have ended with an increase: `array[i-3] < array[i-2]`.
//  // This means we sum `dp[i-1][prev_val][0]` for `current_val < prev_val <= r`.
//  // This sum is `(prefix_sum0[r] - prefix_sum0[current_val])` (modulo MOD, handling negative results).
//  `dp[i][current_val][1] = (prefix_sum0[r] - prefix_sum0[current_val] + MOD) % MOD`
//
// The definition of `dp[1][val][0/1]` needs care. If `n=3`, `l=4`, `r=5`:
// `[4, 5, 4]`:
// `i=1`: `[4]`, `[5]`
// `i=2`: `[4, 5]` (increase), `[5, 4]` (decrease)
// `i=3`: `[4, 5, 4]` (decrease from 5 to 4, previous was increase from 4 to 5 - valid)
//
// `[5, 4, 5]`:
// `i=1`: `[5]`, `[4]`
// `i=2`: `[5, 4]` (decrease), `[4, 5]` (increase)
// `i=3`: `[5, 4, 5]` (increase from 4 to 5, previous was decrease from 5 to 4 - valid)
//
// Let's re-evaluate the base case and state.
// `dp[i][j][0]` = count of valid ZigZag arrays of length `i` ending with value `j`, where `array[i-1] = j` and `array[i-2] < j`. (Last step was an "up" move).
// `dp[i][j][1]` = count of valid ZigZag arrays of length `i` ending with value `j`, where `array[i-1] = j` and `array[i-2] > j`. (Last step was a "down" move).
//
// Base Case (i=1): For `val` from `l` to `r`, `dp[1][val][0] = 1` and `dp[1][val][1] = 1`. This represents the start of a potential sequence. A single element can be the start of both an increasing or decreasing sequence.
//
// For `i` from 2 to `n`:
//
// Compute prefix sums for `dp[i-1]`:
// `prefix_sum0[k]` = sum of `dp[i-1][v][0]` for `l <= v <= k`.
// `prefix_sum1[k]` = sum of `dp[i-1][v][1]` for `l <= v <= k`.
//
// For `current_val` from `l` to `r`:
//
//  // Calculate `dp[i][current_val][0]` (last step was `prev_val < current_val`)
//  // We need to pick `prev_val` such that `prev_val < current_val`.
//  // The previous state `dp[i-1][prev_val][k]` must be valid.
//  // The crucial constraint: no three consecutive elements form a strictly increasing or decreasing sequence.
//  // If the current step is an increase (`prev_val < current_val`), the previous step must NOT have been an increase.
//  // So, we can only transition from states where `array[i-3] > array[i-2]`, which is `dp[i-1][prev_val][1]`.
//  // We sum `dp[i-1][prev_val][1]` for all `l <= prev_val < current_val`.
//  // This sum is `prefix_sum1[current_val - 1]`.
//  `dp[i][current_val][0] = prefix_sum1[current_val - 1]` (modulo MOD)
//
//  // Calculate `dp[i][current_val][1]` (last step was `prev_val > current_val`)
//  // We need to pick `prev_val` such that `prev_val > current_val`.
//  // If the current step is a decrease (`prev_val > current_val`), the previous step must NOT have been a decrease.
//  // So, we can only transition from states where `array[i-3] < array[i-2]`, which is `dp[i-1][prev_val][0]`.
//  // We sum `dp[i-1][prev_val][0]` for all `current_val < prev_val <= r`.
//  // This sum is `(prefix_sum0[r] - prefix_sum0[current_val])` (modulo MOD).
//  `dp[i][current_val][1] = (prefix_sum0[r] - prefix_sum0[current_val] + MOD) % MOD`
//
// Final Answer: Sum of `dp[n][val][0]` and `dp[n][val][1]` for all `l <= val <= r`.
//
// Let's trace Example 1: n=3, l=4, r=5. MOD = 10^9 + 7.
// Range size `R = r - l + 1 = 5 - 4 + 1 = 2`. Values are {4, 5}.
// DP table size: `dp[n+1][r+1][2]`. Let's use `dp[n+1][r_max+1][2]` where `r_max=2000`.
// We can optimize space by only keeping track of the previous DP state. `dp[2][r+1][2]`.
// Let `dp[curr][val][dir]` and `dp[prev][val][dir]`.
//
// Initialize `dp[0]` (representing length 1 arrays):
// `dp[0][4][0] = 1`, `dp[0][4][1] = 1`
// `dp[0][5][0] = 1`, `dp[0][5][1] = 1`
//
// Iteration i = 2 (length 2 arrays):
// `curr = 1`, `prev = 0`
// `prefix_sum0` for `dp[0]`:
// `prefix_sum0[3] = 0`
// `prefix_sum0[4] = dp[0][4][0] = 1`
// `prefix_sum0[5] = dp[0][4][0] + dp[0][5][0] = 1 + 1 = 2`
//
// `prefix_sum1` for `dp[0]`:
// `prefix_sum1[3] = 0`
// `prefix_sum1[4] = dp[0][4][1] = 1`
// `prefix_sum1[5] = dp[0][4][1] + dp[0][5][1] = 1 + 1 = 2`
//
// Calculate `dp[1]` (representing length 2 arrays):
//
// For `current_val = 4`:
// `dp[1][4][0]` (ends with increase, `prev_val < 4`): No `prev_val` possible in [4, 5]. Sum is 0. `prefix_sum1[4-1] = prefix_sum1[3] = 0`. Correct.
// `dp[1][4][1]` (ends with decrease, `prev_val > 4`): `prev_val = 5`. Need `dp[0][5][0]`.
// Sum `dp[0][prev_val][0]` for `4 < prev_val <= 5`. This is `dp[0][5][0] = 1`.
// Formula: `(prefix_sum0[5] - prefix_sum0[4] + MOD) % MOD = (2 - 1 + MOD) % MOD = 1`. Correct.
// So, `dp[1][4][0] = 0`, `dp[1][4][1] = 1`. (Represents sequence `[5, 4]`)
//
// For `current_val = 5`:
// `dp[1][5][0]` (ends with increase, `prev_val < 5`): `prev_val = 4`. Need `dp[0][4][1]`.
// Sum `dp[0][prev_val][1]` for `4 <= prev_val < 5`. This is `dp[0][4][1] = 1`.
// Formula: `prefix_sum1[5-1] = prefix_sum1[4] = 1`. Correct.
// `dp[1][5][0] = 1`. (Represents sequence `[4, 5]`)
//
// `dp[1][5][1]` (ends with decrease, `prev_val > 5`): No `prev_val` possible in [4, 5]. Sum is 0. `(prefix_sum0[5] - prefix_sum0[5] + MOD) % MOD = 0`. Correct.
// `dp[1][5][1] = 0`.
//
// So after i=2, `dp[1]` has:
// `dp[1][4][0] = 0`, `dp[1][4][1] = 1` ([5, 4])
// `dp[1][5][0] = 1`, `dp[1][5][1] = 0` ([4, 5])
//
// Iteration i = 3 (length 3 arrays):
// `curr = 0`, `prev = 1`
// `prefix_sum0` for `dp[1]`:
// `prefix_sum0[3] = 0`
// `prefix_sum0[4] = dp[1][4][0] = 0`
// `prefix_sum0[5] = dp[1][4][0] + dp[1][5][0] = 0 + 1 = 1`
//
// `prefix_sum1` for `dp[1]`:
// `prefix_sum1[3] = 0`
// `prefix_sum1[4] = dp[1][4][1] = 1`
// `prefix_sum1[5] = dp[1][4][1] + dp[1][5][1] = 1 + 0 = 1`
//
// Calculate `dp[0]` (representing length 3 arrays):
//
// For `current_val = 4`:
// `dp[0][4][0]` (ends with increase, `prev_val < 4`): No `prev_val`. Sum is 0. `prefix_sum1[3] = 0`. Correct.
// `dp[0][4][0] = 0`.
//
// `dp[0][4][1]` (ends with decrease, `prev_val > 4`): `prev_val = 5`. Need `dp[1][5][0]`.
// Sum `dp[1][prev_val][0]` for `4 < prev_val <= 5`. This is `dp[1][5][0] = 1`.
// Formula: `(prefix_sum0[5] - prefix_sum0[4] + MOD) % MOD = (1 - 0 + MOD) % MOD = 1`. Correct.
// `dp[0][4][1] = 1`. (Represents sequence `[4, 5, 4]`)
//
// For `current_val = 5`:
// `dp[0][5][0]` (ends with increase, `prev_val < 5`): `prev_val = 4`. Need `dp[1][4][1]`.
// Sum `dp[1][prev_val][1]` for `4 <= prev_val < 5`. This is `dp[1][4][1] = 1`.
// Formula: `prefix_sum1[5-1] = prefix_sum1[4] = 1`. Correct.
// `dp[0][5][0] = 1`. (Represents sequence `[5, 4, 5]`)
//
// `dp[0][5][1]` (ends with decrease, `prev_val > 5`): No `prev_val`. Sum is 0. `(prefix_sum0[5] - prefix_sum0[5] + MOD) % MOD = 0`. Correct.
// `dp[0][5][1] = 0`.
//
// Final Answer (for n=3):
// Sum `dp[0][val][0]` and `dp[0][val][1]` for `val` in [4, 5].
// `dp[0][4][0] + dp[0][4][1] + dp[0][5][0] + dp[0][5][1]`
// `0 + 1 + 1 + 0 = 2`. Matches example output.
//
// The space optimization using two rows `dp[2][r_max+1][2]` is correct.
//
// Time Complexity: O(N * R), where N is the length of the array and R is the range of values (r - l + 1).
// The outer loop runs N-1 times. Inside, we compute prefix sums O(R), and then iterate through possible values of `current_val` O(R). So, N * (R + R) = O(N * R).
//
// Space Complexity: O(R) for the DP table (using space optimization with two rows) and prefix sums. We only need to store the DP states for the current and previous length. The range of values is up to 2000, so R can be up to 2000.
//
// Let's consider the range [l, r] carefully. The DP table should be indexed by actual values or an offset. Using `r+1` as the size and indexing by `val` is fine if `r` is not too large. Given `r <= 2000`, this is feasible.
//
// The modulo constant.
const MOD = 1000000007;

/**
 * @param {number} n
 * @param {number} l
 * @param {number} r
 * @return {number}
 */
var numberOfZigZagArrays = function(n, l, r) {
    // dp[current_row][value][direction]
    // current_row: 0 for current length, 1 for previous length (space optimization)
    // value: the actual value from l to r. We use `val` as index directly.
    // direction: 0 for last step was increasing (prev < current), 1 for last step was decreasing (prev > current)
    // Size of value dimension needs to accommodate up to r. Max r is 2000.
    let dp = Array(2).fill(0).map(() => Array(r + 1).fill(0).map(() => Array(2).fill(0)));

    // Base case: length 1 arrays.
    // Any value from l to r can be the first element.
    // For DP state purposes, we can consider a single element as a valid start for both increasing and decreasing trends.
    for (let val = l; val <= r; ++val) {
        dp[0][val][0] = 1; // Conceptual start for an increasing sequence
        dp[0][val][1] = 1; // Conceptual start for a decreasing sequence
    }

    // Iterate for lengths from 2 to n
    for (let i = 2; i <= n; ++i) {
        // Determine current and previous row for DP state
        let curr = i % 2;
        let prev = (i - 1) % 2;

        // Initialize current DP row to zeros
        for (let val = l; val <= r; ++val) {
            dp[curr][val][0] = 0;
            dp[curr][val][1] = 0;
        }

        // Calculate prefix sums for the previous DP row to speed up range queries.
        // prefix_sum0[k] = sum of dp[prev][v][0] for l <= v <= k
        // prefix_sum1[k] = sum of dp[prev][v][1] for l <= v <= k
        // We only need prefix sums for values from l to r.
        // Let's create prefix sum arrays of size r+1 and index them by value.
        let prefix_sum0 = Array(r + 1).fill(0);
        let prefix_sum1 = Array(r + 1).fill(0);

        for (let val = l; val <= r; ++val) {
            prefix_sum0[val] = (prefix_sum0[val - 1] + dp[prev][val][0]) % MOD;
            prefix_sum1[val] = (prefix_sum1[val - 1] + dp[prev][val][1]) % MOD;
        }

        // Fill the current DP row (dp[curr])
        for (let current_val = l; current_val <= r; ++current_val) {
            // Calculate dp[curr][current_val][0]: ending with an increase (prev_val < current_val)
            // To avoid `a < b < c`, if the current step is `prev_val < current_val`, the previous step must NOT have been an increase.
            // This means we transition from states where the last step was a decrease: `dp[prev][prev_val][1]`.
            // We need to sum `dp[prev][prev_val][1]` for all `l <= prev_val < current_val`.
            // This sum is `prefix_sum1[current_val - 1]`.
            dp[curr][current_val][0] = prefix_sum1[current_val - 1];

            // Calculate dp[curr][current_val][1]: ending with a decrease (prev_val > current_val)
            // To avoid `a > b > c`, if the current step is `prev_val > current_val`, the previous step must NOT have been a decrease.
            // This means we transition from states where the last step was an increase: `dp[prev][prev_val][0]`.
            // We need to sum `dp[prev][prev_val][0]` for all `current_val < prev_val <= r`.
            // This sum is `(prefix_sum0[r] - prefix_sum0[current_val]) % MOD`.
            // Need to handle negative results from modulo subtraction.
            dp[curr][current_val][1] = (prefix_sum0[r] - prefix_sum0[current_val] + MOD) % MOD;
        }
    }

    // The final answer is the sum of all valid ZigZag arrays of length n.
    // This is the sum of dp[last_row][val][0] and dp[last_row][val][1] for all values from l to r.
    let last_row = n % 2;
    let total_count = 0;
    for (let val = l; val <= r; ++val) {
        total_count = (total_count + dp[last_row][val][0]) % MOD;
        total_count = (total_count + dp[last_row][val][1]) % MOD;
    }

    return total_count;
};
```