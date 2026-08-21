```cpp
// Problem: Kth Smallest Amount With Single Denomination Combination
// Link: https://leetcode.com/problems/kth-smallest-amount-with-single-denomination-combination/
//
// Approach:
// This problem asks for the kth smallest amount that can be formed by multiples of any of the given coin denominations.
// Since we can use any coin denomination individually, the amounts that can be formed are multiples of each coin.
// The union of all these multiples gives the set of all possible amounts.
// We need to find the kth smallest element in this union.
//
// A brute-force approach of generating all possible amounts and sorting them would be too slow given the large value of k.
// The constraints on `coins.length` (up to 15) suggest that we might be able to use bit manipulation to iterate through subsets of coins.
// The key insight is that an amount `x` can be formed if it is a multiple of at least one coin. However, the problem statement is slightly misleading with the "single denomination combination" phrasing. The examples clarify that we are looking for the kth smallest number that is a multiple of AT LEAST ONE of the given coin denominations. This means we are interested in the union of multiples.
//
// Let's re-read the problem carefully: "You are not allowed to combine coins of different denominations." This implies that if we use a coin of denomination `c`, we can only form amounts `c, 2c, 3c, ...`. If we have coins `c1, c2, ..., cn`, the set of all possible amounts is the union of `{m * c1 | m >= 1}`, `{m * c2 | m >= 1}`, ..., `{m * cn | m >= 1}`.
//
// The problem then becomes finding the kth smallest element in the union of arithmetic progressions.
// This is a classic application of the Principle of Inclusion-Exclusion combined with Binary Search.
//
// We can binary search for the answer. Let's say we are checking if a value `mid` is a potential answer. To do this, we need to count how many amounts less than or equal to `mid` can be formed using the given coins.
//
// An amount `x` can be formed if `x` is a multiple of at least one coin `c` in `coins`.
// The number of multiples of `c` less than or equal to `mid` is `mid / c`.
//
// If we simply sum `mid / c` for all `c` in `coins`, we will overcount amounts that are multiples of multiple coins (e.g., amounts that are multiples of both `c1` and `c2` will be counted twice).
//
// This is where the Principle of Inclusion-Exclusion comes in. For a subset of coins `S`, the number of amounts less than or equal to `mid` that are multiples of ALL coins in `S` is `mid / lcm(S)`, where `lcm(S)` is the least common multiple of all coins in `S`.
//
// The total count of numbers <= `mid` that are multiples of AT LEAST ONE coin is:
// Sum (over all subsets S of coins, |S| is odd) of `mid / lcm(S)`
// - Sum (over all subsets S of coins, |S| is even) of `mid / lcm(S)`
//
// We can iterate through all 2^N subsets of coins (where N is `coins.length`). For each subset, we calculate its LCM. If the subset size is odd, we add `mid / lcm` to our count. If the subset size is even, we subtract `mid / lcm`.
//
// The `lcm` of a set of numbers can be calculated iteratively: `lcm(a, b) = (a * b) / gcd(a, b)`. Be careful about potential overflow when calculating `a * b`. We should use `long long` for LCM calculation.
//
// Binary Search Range:
// The smallest possible amount is the minimum coin value.
// The largest possible amount could be `k * max(coins)`. A safe upper bound for binary search would be `k * 25` (since max coin value is 25) which is approximately `2 * 10^9 * 25`. A more conservative upper bound like `2e14` or `1e15` should be sufficient. Let's use `k * 25` for now, and `k` itself can be up to `2 * 10^9`. So the upper bound could be `2 * 10^9 * 25`. Let's pick a reasonably large number, e.g., `2e14`. The maximum possible value of `k` is `2 * 10^9`. If the smallest coin is `1`, then the `k`th smallest amount could be `k`. If the smallest coin is `25`, and `k` is large, the `k`th amount could be around `25 * k`. So `2 * 10^9 * 25` = `5 * 10^{10}`. A safe upper bound could be `10^{15}` or `2 * 10^{14}` for intermediate `mid` values.
// Let's set the binary search range from 1 to a sufficiently large number, say `2e14`.
//
// The function `count(mid, coins)` will return the number of amounts <= `mid` that are multiples of at least one coin.
//
// If `count(mid, coins) >= k`, it means `mid` could be our answer or the answer is smaller. So we try a smaller `mid` by setting `high = mid - 1` and store `mid` as a potential answer.
// If `count(mid, coins) < k`, it means `mid` is too small, and we need a larger amount. So we set `low = mid + 1`.
//
// `gcd(a, b)` function is needed.
// `lcm(a, b)` function using `gcd`.
//
// Need to handle `lcm` calculation carefully to avoid overflow. If `lcm` exceeds a certain threshold (e.g., `mid` or `2e14`), we can treat it as effectively infinite for the purpose of `mid / lcm` calculation, as `mid / infinity` is 0.
//
// Time Complexity:
// - Binary Search: `log(MAX_AMOUNT)` iterations, where `MAX_AMOUNT` is the upper bound of our search space (e.g., `2 * 10^14`).
// - Inside Binary Search, `count` function:
//   - Iterates through `2^N` subsets of coins, where `N = coins.length` (up to 15). So `2^15 = 32768`.
//   - For each subset, calculates LCM. LCM calculation for a subset of size `m` takes `m` GCD operations. GCD takes `log(max_coin)` time.
//   - Overall for `count`: `O(2^N * N * log(max_coin))`.
//
// Total Time Complexity: `O(log(MAX_AMOUNT) * 2^N * N * log(max_coin))`.
// With N=15, `log(MAX_AMOUNT)` ~ 50 (for 2e14), `2^15` ~ 32768, `N`=15, `log(max_coin)` ~ 5.
// `50 * 32768 * 15 * 5` is roughly `1.2 * 10^8`, which should be acceptable.
//
// Space Complexity:
// - `O(N)` for storing the current subset or recursive calls if implemented recursively. Iterative approach uses `O(1)` extra space beyond input.
//
// Let's define the maximum possible value of `mid` more precisely. `k` is up to `2*10^9`. `coins[i]` is up to 25. If `coins = [1]` and `k = 2*10^9`, the answer is `2*10^9`. If `coins = [25]` and `k = 2*10^9`, the answer is `25 * 2*10^9 = 5 * 10^{10}`.
// So, `MAX_AMOUNT` can be up to `5 * 10^{10}`. `log(5 * 10^{10})` is roughly `log(2^36)` ~ 36.
// `36 * 32768 * 15 * 5` is approximately `9 * 10^7`, which is feasible.
// We should use `long long` for `mid` and all intermediate calculations involving sums and LCMs.
// The maximum LCM could potentially exceed `2 * 10^{14}` or `5 * 10^{10}`. For example, `lcm(25, 24, 23, ...)` could be very large. If `lcm` exceeds `mid` (or a safe upper bound like `2e14`), `mid / lcm` will be 0, so we can cap the `lcm` at a value slightly larger than `mid` to avoid overflow and ensure `mid / lcm` correctly evaluates to 0. A safe threshold could be `2 * 10^{14}` or `10^{15}`.
//
// Example Walkthrough: coins = [3, 6, 9], k = 3
//
// Binary Search range: low = 1, high = 100 (for simplicity in example)
//
// Iteration 1: mid = 50
// count(50, [3, 6, 9]):
// Subsets:
// {3}: lcm=3. count += 50/3 = 16
// {6}: lcm=6. count += 50/6 = 8
// {9}: lcm=9. count += 50/9 = 5
// {3,6}: lcm=6. count -= 50/6 = 8
// {3,9}: lcm=9. count -= 50/9 = 5
// {6,9}: lcm=18. count -= 50/18 = 2
// {3,6,9}: lcm=18. count += 50/18 = 2
// Total count = 16 + 8 + 5 - 8 - 5 - 2 + 2 = 16.
// `count(50, [3, 6, 9]) = 16`. Since 16 >= 3, `ans = 50`, `high = 49`.
//
// Iteration 2: mid = 24 (low=1, high=49)
// count(24, [3, 6, 9]):
// {3}: 24/3 = 8
// {6}: 24/6 = 4
// {9}: 24/9 = 2
// {3,6}: lcm=6. 24/6 = 4
// {3,9}: lcm=9. 24/9 = 2
// {6,9}: lcm=18. 24/18 = 1
// {3,6,9}: lcm=18. 24/18 = 1
// Total count = 8 + 4 + 2 - 4 - 2 - 1 + 1 = 8.
// `count(24, [3, 6, 9]) = 8`. Since 8 >= 3, `ans = 24`, `high = 23`.
//
// Iteration 3: mid = 11 (low=1, high=23)
// count(11, [3, 6, 9]):
// {3}: 11/3 = 3
// {6}: 11/6 = 1
// {9}: 11/9 = 1
// {3,6}: lcm=6. 11/6 = 1
// {3,9}: lcm=9. 11/9 = 1
// {6,9}: lcm=18. 11/18 = 0
// {3,6,9}: lcm=18. 11/18 = 0
// Total count = 3 + 1 + 1 - 1 - 1 - 0 + 0 = 3.
// `count(11, [3, 6, 9]) = 3`. Since 3 >= 3, `ans = 11`, `high = 10`.
//
// Iteration 4: mid = 5 (low=1, high=10)
// count(5, [3, 6, 9]):
// {3}: 5/3 = 1
// {6}: 5/6 = 0
// {9}: 5/9 = 0
// ... all other terms will be 0.
// Total count = 1.
// `count(5, [3, 6, 9]) = 1`. Since 1 < 3, `low = 6`.
//
// Iteration 5: mid = 8 (low=6, high=10)
// count(8, [3, 6, 9]):
// {3}: 8/3 = 2
// {6}: 8/6 = 1
// {9}: 8/9 = 0
// {3,6}: lcm=6. 8/6 = 1
// ...
// Total count = 2 + 1 + 0 - 1 - 0 - 0 + 0 = 2.
// `count(8, [3, 6, 9]) = 2`. Since 2 < 3, `low = 9`.
//
// Iteration 6: mid = 9 (low=9, high=10)
// count(9, [3, 6, 9]):
// {3}: 9/3 = 3
// {6}: 9/6 = 1
// {9}: 9/9 = 1
// {3,6}: lcm=6. 9/6 = 1
// {3,9}: lcm=9. 9/9 = 1
// {6,9}: lcm=18. 9/18 = 0
// {3,6,9}: lcm=18. 9/18 = 0
// Total count = 3 + 1 + 1 - 1 - 1 - 0 + 0 = 3.
// `count(9, [3, 6, 9]) = 3`. Since 3 >= 3, `ans = 9`, `high = 8`.
//
// Now low = 9, high = 8. The loop terminates. The answer is `ans = 9`. This matches Example 1.
//
// Helper functions:
// `long long gcd(long long a, long long b)`
// `long long lcm(long long a, long long b, long long limit)` to handle overflow. If `a * b` would overflow or exceed `limit`, return `limit + 1`.
//
// The `count` function implementation:
// Iterate from `mask = 1` to `(1 << N) - 1`.
// For each `mask`, determine the subset of coins.
// Calculate the LCM of the subset.
// Keep track of the sign based on the number of set bits in `mask`.
// Add/subtract `mid / current_lcm` to the total count.
//
// Max LCM Check:
// When calculating `lcm(a, b)`, we can check `a > limit / b` before multiplying. If this is true, then `a * b` would exceed `limit`.
// We can set `limit` to be slightly greater than the maximum possible answer, say `5 * 10^{10} + 1`. Or just use `LLONG_MAX` for calculation and check against `mid`.
// A threshold of `2 * 10^{14}` seems safe for `mid` values in binary search. If `lcm` exceeds this, then `mid / lcm` will be 0 for any `mid` we are considering.
// Let's define `LL_MAX_VAL = 2e14`.

#include <vector>
#include <numeric>
#include <algorithm>

// Function to compute the greatest common divisor (GCD) of two numbers
long long gcd(long long a, long long b) {
    while (b) {
        a %= b;
        std::swap(a, b);
    }
    return a;
}

// Function to compute the least common multiple (LCM) of two numbers
// Returns a value larger than limit if overflow or exceeding limit occurs
long long lcm(long long a, long long b, long long limit) {
    if (a == 0 || b == 0) return 0; // Should not happen with positive coins
    // Check for potential overflow before multiplication: a * b > limit
    // Equivalent to: a > limit / b (if b is not 0)
    if (a > limit / b) {
        return limit + 1; // Indicate overflow or exceeding limit
    }
    long long result = (a * b) / gcd(a, b);
    if (result > limit) {
        return limit + 1; // Indicate exceeding limit
    }
    return result;
}

// Function to count the number of amounts less than or equal to 'val'
// that can be formed as multiples of at least one coin denomination.
// Uses the Principle of Inclusion-Exclusion.
long long count_multiples(long long val, const std::vector<int>& coins) {
    long long count = 0;
    int n = coins.size();
    // Iterate through all non-empty subsets of coins using bitmasks
    // mask goes from 1 (00..01) to (1<<n)-1 (11..11)
    for (int i = 1; i < (1 << n); ++i) {
        long long current_lcm = 1;
        int set_bits = 0; // Number of coins in the current subset

        // Iterate through each coin to see if it's in the current subset
        for (int j = 0; j < n; ++j) {
            // If the j-th bit is set in the mask 'i', then coins[j] is in the subset
            if ((i >> j) & 1) {
                set_bits++;
                // Calculate LCM iteratively. If LCM exceeds 'val', we can stop for this subset
                // as mid / large_lcm will be 0 anyway. A safe upper bound for 'val' is around 5e10.
                // We can use a slightly larger limit to prevent intermediate overflow.
                // Let's use a limit slightly above the max possible answer: k * max_coin.
                // Max k = 2e9, max coin = 25. So ~5e10. Binary search up to 2e14 is safe.
                long long limit_for_lcm = 2e14; // A value larger than any possible 'val' we'll check
                current_lcm = lcm(current_lcm, coins[j], limit_for_lcm);

                // If LCM has already exceeded the limit or became effectively infinite,
                // then mid / current_lcm will be 0. We can break early.
                if (current_lcm > val || current_lcm == limit_for_lcm + 1) {
                    current_lcm = limit_for_lcm + 1; // Ensure it's treated as effectively infinite
                    break;
                }
            }
        }

        // Apply Inclusion-Exclusion Principle
        if (current_lcm <= val) { // Only consider if LCM is within the range
            if (set_bits % 2 == 1) { // Odd number of elements in subset, add
                count += val / current_lcm;
            } else { // Even number of elements in subset, subtract
                count -= val / current_lcm;
            }
        }
    }
    return count;
}

class Solution {
public:
    /**
     * Problem: Kth Smallest Amount With Single Denomination Combination
     * Link: https://leetcode.com/problems/kth-smallest-amount-with-single-denomination-combination/
     *
     * Approach:
     * This problem asks for the kth smallest number that is a multiple of at least one of the given coin denominations.
     * The set of all possible amounts is the union of multiples of each coin.
     * We use Binary Search on the answer. For a given value 'mid', we need to count how many numbers less than or equal to 'mid' are multiples of at least one coin.
     * This counting is done using the Principle of Inclusion-Exclusion.
     * For each subset of coins, we calculate their Least Common Multiple (LCM).
     * If the subset size is odd, we add `mid / lcm(subset)` to our count.
     * If the subset size is even, we subtract `mid / lcm(subset)` from our count.
     * The GCD and LCM functions are used, with careful handling of potential `long long` overflow when calculating LCM.
     *
     * Time Complexity: O(log(MAX_AMOUNT) * 2^N * N * log(max_coin)), where N is coins.length and MAX_AMOUNT is the upper bound for binary search (e.g., 5 * 10^10).
     * Space Complexity: O(1) (excluding input storage).
     */
    long long findKthSmallest(std::vector<int>& coins, int k) {
        // Binary search for the kth smallest amount.
        // The smallest possible amount is 1.
        // The largest possible amount can be estimated: k * max(coins).
        // Given k <= 2 * 10^9 and max(coins) <= 25, the max amount can be up to 5 * 10^10.
        // A safe upper bound for binary search is around 2 * 10^14 to accommodate intermediate calculations.
        long long low = 1;
        long long high = 5e10; // A sufficiently large upper bound, can be 2e14 if needed
        long long ans = high; // Initialize ans with a value that will be updated

        while (low <= high) {
            long long mid = low + (high - low) / 2; // Prevent overflow when calculating mid

            // Count how many numbers <= 'mid' are multiples of at least one coin
            long long count = count_multiples(mid, coins);

            if (count >= k) {
                // If 'mid' can form at least k amounts, it might be our answer,
                // or the answer is smaller. So, we store 'mid' as a potential answer
                // and try to find a smaller one in the left half.
                ans = mid;
                high = mid - 1;
            } else {
                // If 'mid' can form less than k amounts, it's too small.
                // We need to search in the right half for a larger amount.
                low = mid + 1;
            }
        }

        return ans;
    }
};
```