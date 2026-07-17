```javascript
/**
 * @param {number[]} nums
 * @param {number[]} queries
 * @return {number[]}
 */

// Problem: Sorted GCD Pair Queries
// Link: https://leetcode.com/problems/sorted-gcd-pair-queries/
//
// Approach:
// The problem asks us to find the k-th smallest GCD among all unique pairs of elements in the `nums` array,
// where k is given by the `queries` array. The total number of pairs can be up to n*(n-1)/2, which can be very large.
// A naive approach of generating all GCDs, sorting them, and then picking the queried elements would be too slow
// and might exceed memory limits.
//
// The key observation is that we don't need to generate all GCDs. Instead, we can count how many pairs have a GCD
// that is greater than or equal to a certain value `x`. This allows us to use binary search on the possible GCD values.
// The possible GCD values range from 1 to the maximum value in `nums`.
//
// For a given candidate GCD `g`, we need to efficiently count the number of pairs (nums[i], nums[j]) such that gcd(nums[i], nums[j]) >= g.
// This is equivalent to counting pairs where both nums[i] and nums[j] are multiples of some number `m` such that `m` is a multiple of `g`.
//
// Let's consider a divisor `d`. We want to count pairs (a, b) where `d` divides both `a` and `b`.
// If we count all numbers in `nums` that are multiples of `d`, let this count be `count_d`.
// The number of pairs where both elements are multiples of `d` is `count_d * (count_d - 1) / 2`.
//
// However, this count includes pairs whose GCD is a multiple of `d` (e.g., 2d, 3d, etc.).
// We can use the principle of inclusion-exclusion or a more direct approach by iterating over multiples.
//
// A more efficient way to count pairs with GCD >= g is to count pairs where both numbers are multiples of `g`.
// Let `multiples_of_g` be the count of numbers in `nums` that are divisible by `g`.
// The number of pairs where both elements are divisible by `g` is `multiples_of_g * (multiples_of_g - 1) / 2`.
// This count includes pairs whose GCD is exactly `g`, `2g`, `3g`, etc.
//
// To find the number of pairs whose GCD is *exactly* `g`, we can use the following logic:
// Let `pairs_with_gcd_multiple_of(d)` be the count of pairs (nums[i], nums[j]) such that `d` divides `gcd(nums[i], nums[j])`.
// This means `d` divides `nums[i]` and `d` divides `nums[j]`.
// If `cnt[d]` is the number of elements in `nums` divisible by `d`, then
// `pairs_with_gcd_multiple_of(d) = cnt[d] * (cnt[d] - 1) / 2`.
//
// Now, let `exact_gcd_count[g]` be the number of pairs whose GCD is exactly `g`.
// We can compute `exact_gcd_count[g]` by subtracting the counts of pairs whose GCD is a multiple of `g` but strictly greater than `g`.
// `exact_gcd_count[g] = pairs_with_gcd_multiple_of(g) - sum(exact_gcd_count[k])` for all `k` such that `k` is a multiple of `g` and `k > g`.
// This can be calculated by iterating downwards from the maximum possible GCD.
//
// Steps:
// 1. Precompute the frequency of each number in `nums`.
// 2. Precompute `cnt[d]` for all `d` up to `max_val` (maximum value in `nums`). `cnt[d]` is the number of elements in `nums` that are multiples of `d`.
//    This can be done efficiently by iterating through multiples. For each `i` from `max_val` down to 1, if `freq[i] > 0`, then for all its divisors `d`, add `freq[i]` to `cnt[d]`.
//    Alternatively, iterate `d` from 1 to `max_val`, and then iterate through its multiples `m = d, 2d, 3d, ...` up to `max_val`, summing `freq[m]` to `cnt[d]`. This is often more efficient.
// 3. Precompute `pairs_with_gcd_multiple_of[d] = cnt[d] * (cnt[d] - 1) / 2` for all `d`.
// 4. Compute `exact_gcd_count[g]` for `g` from `max_val` down to 1.
//    `exact_gcd_count[g] = pairs_with_gcd_multiple_of[g] - sum(exact_gcd_count[k])` for all multiples `k` of `g` where `k > g`.
// 5. Create a prefix sum array for `exact_gcd_count`. Let `prefix_exact_gcd_count[x]` be the total number of pairs with GCD less than or equal to `x`.
//    `prefix_exact_gcd_count[x] = sum(exact_gcd_count[i])` for `i` from 1 to `x`.
//    This can be computed efficiently: `prefix_exact_gcd_count[x] = prefix_exact_gcd_count[x-1] + exact_gcd_count[x]`.
// 6. For each query `q_idx`, we need to find the `(q_idx + 1)`-th smallest GCD.
//    We can use binary search on the possible GCD values (1 to `max_val`). For a candidate GCD `mid`, we check if `prefix_exact_gcd_count[mid]` is at least `q_idx + 1`.
//    If it is, it means the `(q_idx + 1)`-th GCD is `mid` or smaller, so we try a smaller `mid`.
//    If `prefix_exact_gcd_count[mid]` is less than `q_idx + 1`, it means the `(q_idx + 1)`-th GCD is greater than `mid`, so we try a larger `mid`.
//    The binary search will find the smallest `g` such that `prefix_exact_gcd_count[g] >= q_idx + 1`.
//
// Maximum value of nums[i] is 5 * 10^4. Let this be `MAX_VAL`.
//
// Time Complexity:
// - Frequency count: O(N)
// - Counting multiples (`cnt` array): O(MAX_VAL * log(log(MAX_VAL))) (harmonic series related)
// - Calculating `pairs_with_gcd_multiple_of`: O(MAX_VAL)
// - Calculating `exact_gcd_count`: O(MAX_VAL * log(MAX_VAL)) (iterating down and then through multiples)
// - Calculating `prefix_exact_gcd_count`: O(MAX_VAL)
// - Processing queries: O(Q * log(MAX_VAL)) where Q is the number of queries.
//
// Overall Time Complexity: O(N + MAX_VAL * log(MAX_VAL) + Q * log(MAX_VAL))
//
// Space Complexity:
// - Frequency array: O(MAX_VAL)
// - `cnt` array: O(MAX_VAL)
// - `pairs_with_gcd_multiple_of` array: O(MAX_VAL)
// - `exact_gcd_count` array: O(MAX_VAL)
// - `prefix_exact_gcd_count` array: O(MAX_VAL)
//
// Overall Space Complexity: O(MAX_VAL)
//
// Constraints: n <= 10^5, nums[i] <= 5*10^4, queries <= 10^5.
// MAX_VAL = 50000.
// MAX_VAL * log(MAX_VAL) is roughly 50000 * 16, which is acceptable.
// N + MAX_VAL * log(MAX_VAL) + Q * log(MAX_VAL) is roughly 10^5 + 50000*16 + 10^5*16, which is feasible.

const MAX_VAL = 50000; // Maximum possible value for nums[i]

function sortedGCDPairQueries(nums, queries) {
    const n = nums.length;

    // 1. Precompute frequency of each number in nums.
    const freq = new Array(MAX_VAL + 1).fill(0);
    for (const num of nums) {
        freq[num]++;
    }

    // 2. Precompute cnt[d]: number of elements in nums divisible by d.
    // Iterate from MAX_VAL down to 1 for efficiency.
    const cnt = new Array(MAX_VAL + 1).fill(0);
    for (let d = 1; d <= MAX_VAL; d++) {
        for (let m = d; m <= MAX_VAL; m += d) {
            cnt[d] += freq[m];
        }
    }

    // 3. Precompute pairs_with_gcd_multiple_of[d]: number of pairs (a, b) where d divides gcd(a, b).
    // This means d divides a and d divides b.
    const pairs_with_gcd_multiple_of = new Array(MAX_VAL + 1).fill(0);
    for (let d = 1; d <= MAX_VAL; d++) {
        const num_multiples = cnt[d];
        if (num_multiples >= 2) {
            pairs_with_gcd_multiple_of[d] = num_multiples * (num_multiples - 1) / 2;
        }
    }

    // 4. Compute exact_gcd_count[g]: number of pairs with GCD exactly g.
    // Use inclusion-exclusion principle by iterating downwards.
    const exact_gcd_count = new Array(MAX_VAL + 1).fill(0);
    for (let g = MAX_VAL; g >= 1; g--) {
        exact_gcd_count[g] = pairs_with_gcd_multiple_of[g];
        // Subtract counts for multiples of g (k = 2g, 3g, ...)
        for (let k = 2 * g; k <= MAX_VAL; k += g) {
            exact_gcd_count[g] -= exact_gcd_count[k];
        }
    }

    // 5. Create prefix_exact_gcd_count[x]: total number of pairs with GCD <= x.
    const prefix_exact_gcd_count = new Array(MAX_VAL + 1).fill(0);
    for (let x = 1; x <= MAX_VAL; x++) {
        prefix_exact_gcd_count[x] = prefix_exact_gcd_count[x - 1] + exact_gcd_count[x];
    }

    // 6. Process each query using binary search.
    const answer = [];
    for (const q_idx of queries) {
        // We are looking for the (q_idx + 1)-th smallest GCD.
        // Binary search for the smallest `g` such that `prefix_exact_gcd_count[g] >= q_idx + 1`.
        let low = 1, high = MAX_VAL;
        let result_gcd = MAX_VAL; // Initialize with a safe upper bound

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (prefix_exact_gcd_count[mid] >= q_idx + 1) {
                // `mid` is a potential answer, or the answer is smaller.
                result_gcd = mid;
                high = mid - 1;
            } else {
                // The `(q_idx + 1)`-th GCD must be larger than `mid`.
                low = mid + 1;
            }
        }
        answer.push(result_gcd);
    }

    return answer;
}
```