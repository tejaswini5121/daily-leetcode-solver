/**
 * Problem Summary: Find the number of pairs of non-empty, disjoint subsequences (seq1, seq2) from a given array `nums` such that the GCD of elements in seq1 equals the GCD of elements in seq2. Return the count modulo 10^9 + 7.
 * Problem Link: https://leetcode.com/problems/find-the-number-of-subsequences-with-equal-gcd/
 *
 * Approach Explanation:
 * The constraints are small: `nums.length <= 200` and `nums[i] <= 200`. This suggests that the solution might involve iterating through possible GCD values, or something exponential in `nums.length` (like O(3^N) or O(N * 2^N)).
 *
 * Let's denote the maximum value an element can take as `MAX_VAL = 200`.
 *
 * The problem asks for `(seq1, seq2)` pairs. A key condition is that `seq1` and `seq2` are disjoint.
 *
 * Consider a fixed GCD `g`. We want to find the number of disjoint pairs `(seq1, seq2)` such that `gcd(seq1) = g` and `gcd(seq2) = g`.
 *
 * Let `count_g` be the number of non-empty subsequences `seq` such that `gcd(seq) = g`.
 * If we can calculate `count_g` for all `g`, then the answer for a fixed `g` would seem to be `count_g * count_g`.
 * However, this approach is incorrect because it doesn't account for the disjointness requirement.
 * `count_g` represents all subsequences with GCD `g`, not necessarily disjoint ones.
 *
 * A better approach is to iterate through each possible GCD `g` from `MAX_VAL` down to 1.
 * For a chosen `g`, we only care about numbers in `nums` that are multiples of `g`.
 * Let `S_g = {x | x is in nums and x % g == 0}`.
 *
 * Let `f(g)` be the number of non-empty subsequences `seq` from `nums` such that `g` divides `gcd(seq)`.
 * This means all elements in `seq` must be multiples of `g`.
 * For a given `g`, let `k` be the count of elements in `nums` that are multiples of `g`.
 * Then, `f(g) = 2^k - 1` (since there are `2^k` subsequences, and we exclude the empty subsequence).
 * This `f(g)` counts subsequences whose GCD *could be* `g`, `2g`, `3g`, etc.
 *
 * Now, let `exact_g` be the number of non-empty subsequences `seq` from `nums` such that `gcd(seq) = g`.
 * Using the principle of inclusion-exclusion (or Mobius inversion on GCDs):
 * `f(g) = sum_{m=1}^{MAX_VAL/g} exact_{m*g}`.
 * We can compute `exact_g` by iterating `g` downwards from `MAX_VAL`:
 * `exact_g = f(g) - sum_{m=2}^{MAX_VAL/g} exact_{m*g}`.
 * This effectively removes subsequences whose GCD is `2g`, `3g`, etc., from `f(g)`.
 *
 * Let `N = nums.length`.
 *
 * To calculate `f(g)` for all `g`:
 * 1. Precompute counts of each number in `nums`. `freq[x]` stores how many times `x` appears.
 * 2. For each `g` from 1 to `MAX_VAL`:
 *    Count `k_g`, the total number of elements in `nums` that are multiples of `g`.
 *    `k_g = sum_{m=1}^{MAX_VAL/g} freq[m*g]`.
 *    Then `f(g) = (pow(2, k_g) - 1 + MOD) % MOD`.
 *    This requires powers of 2. Precompute `pow2[i] = 2^i`.
 *
 * After computing `f(g)` for all `g`, we can compute `exact_g` for all `g` by iterating `g` from `MAX_VAL` down to 1:
 * `exact_g = f(g)`.
 * For each `m = 2, 3, ...` such that `m*g <= MAX_VAL`:
 * `exact_g = (exact_g - exact_{m*g} + MOD) % MOD`.
 *
 * So far, we have `exact_g`, the count of subsequences with GCD exactly `g`.
 * The problem requires *disjoint* pairs `(seq1, seq2)`.
 *
 * Let's redefine `exact_g` to be an array. `exact_g[i]` will store the number of subsequences from the original `nums` with GCD exactly `i`.
 *
 * Now, for each `g` from 1 to `MAX_VAL`:
 * We need to form pairs `(seq1, seq2)` such that `gcd(seq1) = g` and `gcd(seq2) = g`.
 * The elements `x_i` in `nums` can be categorized for a given `g`:
 * 1. `x_i` is a multiple of `g`.
 * 2. `x_i` is not a multiple of `g`.
 *
 * Only elements that are multiples of `g` can be part of `seq1` or `seq2` if their GCD is `g`.
 * Let `A_g = {i | nums[i] % g == 0}` be the set of indices of elements in `nums` that are multiples of `g`.
 * For a chosen `g`, we are interested in subsequences formed only from elements at indices in `A_g`.
 *
 * This suggests a state for each element `nums[i]`:
 * 1. `nums[i]` is in `seq1`.
 * 2. `nums[i]` is in `seq2`.
 * 3. `nums[i]` is not used.
 *
 * This is similar to counting partitions into three sets, but with GCD constraints.
 *
 * Let `dp[i][g1][g2]` be the number of ways to process `nums[0...i-1]` such that `g1` is the current GCD of `seq1` and `g2` is the current GCD of `seq2`. This is too complex (`N * MAX_VAL^2`).
 *
 * Let's go back to counting `exact_g` for all `g`.
 * `exact_g[g]` is the count of non-empty subsequences `seq` from `nums` with `gcd(seq) = g`.
 *
 * The problem is `(seq1, seq2)` must be disjoint. This means we cannot simply multiply `exact_g[g] * exact_g[g]`.
 *
 * For each number `x` in `nums`, we have three choices regarding its inclusion in `seq1` and `seq2`:
 * 1. `x` is in `seq1`.
 * 2. `x` is in `seq2`.
 * 3. `x` is in neither.
 *
 * For a fixed target GCD `g`, we are only interested in elements `x` that are multiples of `g`.
 * Let's filter `nums` to `nums_g = [x | x in nums, x % g == 0]`.
 *
 * Let `num_ways_g[g_val]` be the number of ways to pick a single subsequence `seq` from `nums_g` such that `gcd(seq) = g_val`.
 * This can be computed using the `f(g)` and `exact_g` method on `nums_g`.
 *
 * Let `dp_count[val]` be the number of subsequences from the original `nums` whose GCD is `val`. This is our `exact_g` array.
 * We want to find `sum_{g=1}^{MAX_VAL} (pairs with GCD g)`.
 *
 * For a fixed `g`, we want to count `(seq1, seq2)` such that `gcd(seq1)=g` and `gcd(seq2)=g` and `seq1, seq2` are disjoint.
 *
 * Consider the elements in `nums` that are multiples of `g`. Let these be `m_1, m_2, ..., m_k`.
 * For each `m_j`, we have 3 choices:
 * - `m_j` goes into `seq1`.
 * - `m_j` goes into `seq2`.
 * - `m_j` goes into neither.
 *
 * Elements not multiples of `g` cannot contribute to a GCD of `g`, so they are effectively "not used".
 *
 * Let `cnt[x]` be the frequency of `x` in `nums`.
 *
 * For a fixed `g`:
 * Initialize `dp[cur_gcd1][cur_gcd2]` = number of ways to form `seq1` and `seq2` with current GCDs `cur_gcd1` and `cur_gcd2` using elements processed so far.
 * This is too slow.
 *
 * A better way is to iterate through each number `x` in `nums`.
 * For each `x`, we can choose to add it to `seq1`, `seq2`, or neither.
 * Let `dp[i][gcd1][gcd2]` be the number of ways to choose disjoint subsequences `seq1` and `seq2` from `nums[0...i-1]` such that `gcd(seq1) = gcd1` and `gcd(seq2) = gcd2`.
 * `N * MAX_VAL^2` states, each takes `MAX_VAL` transitions (if we need to iterate over all possible gcds) or `log(MAX_VAL)` transitions (if using `gcd` function). Still too slow.
 *
 * Let `dp_g[g1]` store `count of subsequences with gcd g1 from numbers processed so far`.
 *
 * A more efficient approach for disjoint subsequences:
 * Iterate `i` from `0` to `N-1`. Let `num = nums[i]`.
 * We want to find `count of pairs (seq1, seq2)` such that `gcd(seq1) = gcd(seq2) = G`.
 *
 * Let `dp[mask]` be the number of ways to assign `nums[i]` to `seq1`, `seq2`, or neither, such that `mask` represents the state of GCDs.
 * This looks like a meet-in-the-middle or a specific DP state formulation.
 *
 * Let `f_g[x]` be the number of ways to pick `x` elements from `nums` that are multiples of `g`, such that their GCD is `g`.
 *
 * Consider the final answer structure. It's `sum_{g=1}^{MAX_VAL} Pairs(g)`, where `Pairs(g)` is the number of disjoint pairs `(seq1, seq2)` with `gcd(seq1)=g` and `gcd(seq2)=g`.
 *
 * For each `g` from `MAX_VAL` down to 1:
 * We need to calculate `Pairs(g)`.
 * Let `subsequences_with_gcd_multiple_of_g` count the ways to pick `seq1, seq2` (not necessarily disjoint) from `nums` where all elements in `seq1` are multiples of `g` and all elements in `seq2` are multiples of `g`.
 *
 * This problem type often uses dynamic programming on subsets of numbers, or iterating over possible GCDs.
 *
 * Let `dp[g1][g2]` be the number of ways to select disjoint subsequences `seq1` and `seq2` from the elements of `nums` that are *multiples of `g`*, such that `gcd(seq1) = g1` and `gcd(seq2) = g2`.
 *
 * For a fixed `g`:
 * Filter `nums` to `candidates_g = [x | x in nums, x % g == 0]`.
 * Let `k` be the count of elements in `candidates_g`.
 *
 * We are interested in `dp[g][g]`.
 *
 * Let's try iterating through each number `x` in `nums`. For each `x`:
 * We have three choices: add `x` to `seq1`, add `x` to `seq2`, or not use `x`.
 *
 * Let `dp[i][g1][g2]` be the count of pairs of disjoint subsequences `(s1, s2)` from `nums[0...i-1]` such that `gcd(s1)` is `g1` (or 0 if empty) and `gcd(s2)` is `g2` (or 0 if empty).
 * `0` represents an empty subsequence or a subsequence whose GCD hasn't been determined yet.
 * A `gcd` of `0` is usually treated as an identity element for GCD, such that `gcd(0, x) = x`.
 *
 * `N * MAX_VAL * MAX_VAL` states. `200 * 200 * 200 = 8 * 10^6` states.
 * Each state transition involves `gcd(current_gcd, new_element)`.
 * This should be feasible.
 *
 * `dp[g1][g2]` will store the number of ways to select disjoint `seq1` and `seq2` from the `nums` array processed so far, such that `gcd(seq1)` is `g1` and `gcd(seq2)` is `g2`.
 *
 * Initialize `dp` table. `dp[0][0] = 1` (represents choosing empty `seq1` and empty `seq2`). All other `dp` values are 0.
 *
 * For each `num` in `nums`:
 * Create a new `new_dp` table initialized to `dp`.
 * Iterate `g1` from `MAX_VAL` down to 0, `g2` from `MAX_VAL` down to 0:
 *   If `dp[g1][g2] == 0`, continue.
 *   `count = dp[g1][g2]`.
 *
 *   Choice 1: Add `num` to `seq1`.
 *     `next_g1 = gcd(g1, num)` if `g1 != 0`, else `num`.
 *     `new_dp[next_g1][g2] = (new_dp[next_g1][g2] + count) % MOD`.
 *
 *   Choice 2: Add `num` to `seq2`.
 *     `next_g2 = gcd(g2, num)` if `g2 != 0`, else `num`.
 *     `new_dp[g1][next_g2] = (new_dp[g1][next_g2] + count) % MOD`.
 *
 *   Choice 3: Do not add `num` to either (`dp[g1][g2]` already accounts for this implicitly from previous elements).
 *   The `new_dp` table is updated based on choices for the *current* `num`.
 *   This is crucial: `new_dp` reflects the states *after* considering `num`.
 *   `dp` refers to states *before* considering `num`.
 *
 * Let `dp[g1][g2]` be the number of pairs of disjoint subsequences (seq1, seq2) from elements considered so far, having GCDs `g1` and `g2`.
 *
 * Initialize `dp[0][0] = 1`. All other `dp[g1][g2] = 0`.
 * Iterate `x` in `nums`:
 *   Create `next_dp` array, copy `dp` into `next_dp`.
 *   For `g1` from `0` to `MAX_VAL`:
 *     For `g2` from `0` to `MAX_VAL`:
 *       If `dp[g1][g2] == 0`, continue.
 *       `ways = dp[g1][g2]`.
 *       
 *       // Option 1: Add `x` to `seq1`
 *       `new_g1 = (g1 === 0) ? x : gcd(g1, x)`;
 *       // If new_g1 is 0 it means x was 0 and g1 was 0. But nums[i] >= 1.
 *       // So new_g1 will always be >= 1.
 *       `next_dp[new_g1][g2] = (next_dp[new_g1][g2] + ways) % MOD`;
 *
 *       // Option 2: Add `x` to `seq2`
 *       `new_g2 = (g2 === 0) ? x : gcd(g2, x)`;
 *       `next_dp[g1][new_g2] = (next_dp[g1][new_g2] + ways) % MOD`;
 *
 *       // Option 3: Do not add `x` to either seq1 or seq2.
 *       // This is implicitly handled because `dp[g1][g2]` already exists in `next_dp`.
 *
 *   `dp = next_dp`.
 *
 * After iterating through all `num` in `nums`:
 * `dp[g1][g2]` contains the number of ways to form `seq1` and `seq2` from `nums` with GCDs `g1` and `g2`.
 *
 * The final answer is `sum_{g=1}^{MAX_VAL} dp[g][g]`.
 *
 * Let's trace with `nums = [1,2,3,4]`, `MAX_VAL = 4`. `MOD = 10^9 + 7`.
 *
 * Initial: `dp[0][0] = 1`. Others 0.
 *
 * `num = 1`:
 * `next_dp` is a copy of `dp`. So `next_dp[0][0] = 1`.
 * Consider `dp[0][0] = 1`:
 *   Option 1: Add 1 to `seq1`. `new_g1 = gcd(0,1) = 1`. `next_dp[1][0] = (next_dp[1][0] + 1) = 1`.
 *   Option 2: Add 1 to `seq2`. `new_g2 = gcd(0,1) = 1`. `next_dp[0][1] = (next_dp[0][1] + 1) = 1`.
 * `dp` becomes `next_dp`: `dp[0][0]=1, dp[1][0]=1, dp[0][1]=1`.
 *
 * `num = 2`:
 * `next_dp` is copy of `dp`: `dp[0][0]=1, dp[1][0]=1, dp[0][1]=1`.
 * Consider `dp[0][0]=1`:
 *   Option 1: Add 2 to `seq1`. `new_g1 = gcd(0,2)=2`. `next_dp[2][0] = (next_dp[2][0] + 1) = 1`.
 *   Option 2: Add 2 to `seq2`. `new_g2 = gcd(0,2)=2`. `next_dp[0][2] = (next_dp[0][2] + 1) = 1`.
 * Consider `dp[1][0]=1`:
 *   Option 1: Add 2 to `seq1`. `new_g1 = gcd(1,2)=1`. `next_dp[1][0] = (next_dp[1][0] + 1) = 2`.
 *   Option 2: Add 2 to `seq2`. `new_g2 = gcd(0,2)=2`. `next_dp[1][2] = (next_dp[1][2] + 1) = 1`.
 * Consider `dp[0][1]=1`:
 *   Option 1: Add 2 to `seq1`. `new_g1 = gcd(0,2)=2`. `next_dp[2][1] = (next_dp[2][1] + 1) = 1`.
 *   Option 2: Add 2 to `seq2`. `new_g2 = gcd(1,2)=1`. `next_dp[0][1] = (next_dp[0][1] + 1) = 2`.
 * `dp` becomes `next_dp`.
 *
 * This process correctly counts disjoint pairs.
 * The `gcd` of an empty subsequence is 0. `gcd(0, x) = x`.
 * A non-empty subsequence `seq` means `g1 != 0` and `g2 != 0`.
 *
 * After all `num` are processed, calculate `result = sum_{g=1}^{MAX_VAL} dp[g][g]`.
 * `dp[g][g]` will count pairs `(seq1, seq2)` such that `gcd(seq1) = g` and `gcd(seq2) = g`.
 * `seq1` and `seq2` are guaranteed to be non-empty if `g != 0`.
 * The problem states "non-empty subsequences".
 * Since `nums[i] >= 1`, `gcd(X)` for a non-empty `X` will always be `> 0`.
 * So `dp[g][g]` for `g > 0` counts pairs of non-empty subsequences with GCD `g`.
 *
 * Time Complexity:
 * `N` iterations for `num` in `nums`. (`N <= 200`)
 * Inside the loop, `MAX_VAL * MAX_VAL` iterations for `g1, g2`. (`MAX_VAL <= 200`)
 * Inside that, `gcd` operation: `O(log(MAX_VAL))`.
 * Total: `O(N * MAX_VAL^2 * log(MAX_VAL))`.
 * `200 * 200^2 * log(200) = 200 * 40000 * ~8 = 8 * 10^6 * 8 = 6.4 * 10^7`. This should be acceptable.
 *
 * Space Complexity:
 * `dp` table is `MAX_VAL * MAX_VAL`.
 * `O(MAX_VAL^2)`.
 * `200 * 200 = 40000` integers. This is fine.
 *
 * Let's confirm `gcd(0, x) = x` logic.
 * The standard mathematical definition usually requires arguments to be positive.
 * For programming purposes, `gcd(0, x) = x` and `gcd(x, 0) = x` are common.
 * If a subsequence is empty, its GCD can be conceptually taken as 0. When an element `x` is added to it, the GCD becomes `gcd(0, x) = x`.
 * If a subsequence is non-empty with GCD `G`, and we add `x`, its new GCD is `gcd(G, x)`.
 * This correctly transitions the GCDs.
 *
 * The `gcd` function:
 * function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
 *
 * `MAX_VAL` should be `200`. Let's use `maxNumVal = 201` for array indexing up to `200`.
 */

// Define GCD function
const gcd = (a, b) => {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
};

const solve = (nums) => {
    const MOD = 10 ** 9 + 7;
    const MAX_VAL = 200; // Maximum value of nums[i]

    // dp[g1][g2] stores the number of ways to choose two disjoint subsequences (seq1, seq2)
    // from the elements processed so far, such that gcd(seq1) is g1 and gcd(seq2) is g2.
    // If g1 or g2 is 0, it means the corresponding subsequence is empty.
    let dp = Array(MAX_VAL + 1).fill(0).map(() => Array(MAX_VAL + 1).fill(0));

    // Base case: Before processing any numbers, there's one way to have two empty subsequences.
    dp[0][0] = 1;

    // Iterate through each number in the input array nums
    for (const num of nums) {
        // Create a new DP table for the current iteration.
        // Copy the current dp values to next_dp.
        // next_dp will store the states after considering the current 'num'.
        let next_dp = Array(MAX_VAL + 1).fill(0).map(() => Array(MAX_VAL + 1).fill(0));
        for (let g1 = 0; g1 <= MAX_VAL; g1++) {
            for (let g2 = 0; g2 <= MAX_VAL; g2++) {
                next_dp[g1][g2] = dp[g1][g2];
            }
        }

        // Iterate through all possible previous GCD pairs (g1, g2)
        for (let g1 = 0; g1 <= MAX_VAL; g1++) {
            for (let g2 = 0; g2 <= MAX_VAL; g2++) {
                // If there are no ways to reach this state, skip it.
                if (dp[g1][g2] === 0) {
                    continue;
                }

                const ways = dp[g1][g2];

                // Option 1: Add 'num' to seq1
                // Calculate the new GCD for seq1. If seq1 was empty (g1=0), its GCD becomes 'num'.
                // Otherwise, it's gcd(current_g1, num).
                const new_g1 = (g1 === 0) ? num : gcd(g1, num);
                // Add 'ways' to the corresponding state in next_dp.
                next_dp[new_g1][g2] = (next_dp[new_g1][g2] + ways) % MOD;

                // Option 2: Add 'num' to seq2
                // Calculate the new GCD for seq2. Similar logic as for seq1.
                const new_g2 = (g2 === 0) ? num : gcd(g2, num);
                // Add 'ways' to the corresponding state in next_dp.
                next_dp[g1][new_g2] = (next_dp[g1][new_g2] + ways) % MOD;

                // Option 3: Do not add 'num' to either seq1 or seq2.
                // This is already implicitly handled because we copied `dp` to `next_dp` at the beginning of the loop for `num`.
                // `next_dp[g1][g2]` already contains `dp[g1][g2]`, which represents the ways where 'num' is not used.
            }
        }
        // Update dp for the next iteration
        dp = next_dp;
    }

    // After processing all numbers, dp[g1][g2] stores the number of ways to form two disjoint subsequences
    // with GCDs g1 and g2.
    // We are interested in pairs where gcd(seq1) == gcd(seq2) and both are non-empty.
    let totalPairs = 0;
    for (let g = 1; g <= MAX_VAL; g++) { // Iterate g from 1 (non-empty GCD) up to MAX_VAL
        totalPairs = (totalPairs + dp[g][g]) % MOD;
    }

    return totalPairs;
};

// LeetCode function signature
function findTheNumberOfSubsequencesWithEqualGCD(nums) {
    return solve(nums);
}