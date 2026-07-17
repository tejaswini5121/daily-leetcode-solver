```java
// Problem: Sorted GCD Pair Queries
// Link: https://leetcode.com/problems/sorted-gcd-pair-queries/
//
// Approach:
// The problem asks us to find the k-th smallest GCD among all unique pairs of elements in a given array `nums`.
// The total number of pairs can be very large (up to O(N^2)), and calculating all of them and sorting would be too slow and memory-intensive.
//
// The key observation is that the possible GCD values are limited by the maximum value in `nums` (which is 5 * 10^4).
// We can rephrase the problem: for a given potential GCD value `g`, how many pairs (nums[i], nums[j]) have a GCD that is at least `g`?
//
// If we can efficiently calculate this count, we can use binary search on the possible GCD values (from 1 to max(nums)) to find the k-th smallest GCD for each query.
//
// To count pairs whose GCD is *at least* `g`, it's easier to count pairs whose GCD is a multiple of `g`.
// A pair (a, b) has a GCD that is a multiple of `g` if and only if both `a` and `b` are multiples of `g`.
//
// Let's define `count_multiples[k]` as the number of elements in `nums` that are multiples of `k`.
// We can precompute this efficiently. For each number `x` in `nums`, we can iterate through its divisors `d` and increment `count_multiples[d]`. A more efficient way is to iterate through multiples: for each number `i` from 1 to `MAX_VAL`, iterate through its multiples `j = i, 2i, 3i, ...` up to `MAX_VAL`. If `j` appears in `nums`, we can update counts.
//
// However, this is still not quite right for counting pairs. We need the count of numbers that are multiples of `g`.
// Let's precompute `freq[x]` which stores the frequency of number `x` in `nums`.
// Then, let `multiples_count[g]` be the count of numbers in `nums` that are multiples of `g`.
// `multiples_count[g] = freq[g] + freq[2g] + freq[3g] + ...`
// We can compute `multiples_count` efficiently by iterating `g` from `MAX_VAL` down to 1. For each `g`, `multiples_count[g]` is initially `freq[g]`. Then, for each multiple `mg` (where `m > 1`), we add `multiples_count[mg]` to `multiples_count[g]`. This is an inclusion-exclusion like approach.
//
// Let `num_pairs_multiple_of[g]` be the number of pairs (nums[i], nums[j]) where both nums[i] and nums[j] are multiples of `g`.
// If `multiples_count[g]` is the number of elements in `nums` that are multiples of `g`, then `num_pairs_multiple_of[g] = multiples_count[g] * (multiples_count[g] - 1) / 2`.
//
// Now, we want to find the count of pairs whose GCD is *exactly* `g`.
// Let `exactly_gcd[g]` be the number of pairs (nums[i], nums[j]) such that `gcd(nums[i], nums[j]) == g`.
// We know that `num_pairs_multiple_of[g]` counts pairs whose GCD is `g`, `2g`, `3g`, etc.
// So, `num_pairs_multiple_of[g] = exactly_gcd[g] + exactly_gcd[2g] + exactly_gcd[3g] + ...`
// We can compute `exactly_gcd[g]` by iterating `g` from `MAX_VAL` down to 1.
// `exactly_gcd[g] = num_pairs_multiple_of[g] - (exactly_gcd[2g] + exactly_gcd[3g] + ...)`
//
// After computing `exactly_gcd[g]` for all `g`, we can form a "sorted" list of GCDs conceptually.
// For each `g`, `exactly_gcd[g]` contributes `g` to the final sorted list `gcdPairs`.
// We can then compute prefix sums of these counts. Let `prefix_count[g]` be the total number of pairs whose GCD is less than or equal to `g`.
// `prefix_count[g] = exactly_gcd[g] + exactly_gcd[g-1] + ... + exactly_gcd[1]`.
//
// For each query `k`, we need to find the smallest `g` such that `prefix_count[g] >= k + 1`.
// This can be found using binary search on `g` (from 1 to `MAX_VAL`).
//
// Maximum value in `nums` is 5 * 10^4. Let `MAX_VAL = 50000`.
//
// Precomputation steps:
// 1. Create `freq` array of size `MAX_VAL + 1`. Iterate through `nums` and populate `freq`. O(N).
// 2. Create `multiples_count` array of size `MAX_VAL + 1`.
//    Iterate `g` from `MAX_VAL` down to 1.
//    For each `g`, iterate through its multiples `m = g, 2g, 3g, ...` up to `MAX_VAL`.
//    `multiples_count[g] += freq[m]`.
//    This step is O(MAX_VAL * log(MAX_VAL)) because the inner loop runs `MAX_VAL/g` times, and the sum of `MAX_VAL/g` for `g=1` to `MAX_VAL` is `MAX_VAL * H_MAX_VAL` where `H_k` is the k-th harmonic number.
// 3. Create `num_pairs_multiple_of` array of size `MAX_VAL + 1`.
//    For `g` from 1 to `MAX_VAL`, `num_pairs_multiple_of[g] = multiples_count[g] * (multiples_count[g] - 1) / 2`. O(MAX_VAL).
// 4. Create `exactly_gcd` array of size `MAX_VAL + 1`.
//    Iterate `g` from `MAX_VAL` down to 1.
//    `exactly_gcd[g] = num_pairs_multiple_of[g]`.
//    For multiples `mg` of `g` (where `m > 1`), subtract `exactly_gcd[mg]` from `exactly_gcd[g]`.
//    This step is also O(MAX_VAL * log(MAX_VAL)) for the same reason as step 2.
// 5. Create `prefix_count` array of size `MAX_VAL + 1`.
//    `prefix_count[g] = prefix_count[g-1] + exactly_gcd[g]`. O(MAX_VAL).
//
// For each query `q` in `queries`:
//    Binary search for the smallest `g` such that `prefix_count[g] >= q + 1`.
//    The binary search range is `[1, MAX_VAL]`. O(log(MAX_VAL)) per query.
//    Total query time: O(Q * log(MAX_VAL)).
//
// Total Time Complexity: O(N + MAX_VAL * log(MAX_VAL) + Q * log(MAX_VAL))
// Total Space Complexity: O(MAX_VAL)
//
// Let's refine step 2 and 4 for clarity and correctness.
//
// Precomputation detailed:
// `MAX_VAL = 50000`
//
// `freq[x]`: count of `x` in `nums`.
// `counts[g]`: count of numbers in `nums` that are multiples of `g`.
//
// Compute `freq`: O(N)
// Iterate `num` in `nums`, `freq[num]++`.
//
// Compute `counts`: O(MAX_VAL * log(MAX_VAL))
// For `g` from 1 to `MAX_VAL`:
//   For `m = g` to `MAX_VAL` step `g`:
//     `counts[g] += freq[m]`
//
// `pairs_with_gcd_multiple_of[g]`: number of pairs (a, b) where `g | gcd(a, b)`. This means `g | a` and `g | b`.
// `pairs_with_gcd_multiple_of[g] = counts[g] * (counts[g] - 1) / 2`.
//
// `exact_gcd_count[g]`: number of pairs (a, b) where `gcd(a, b) == g`.
//
// Compute `exact_gcd_count`: O(MAX_VAL * log(MAX_VAL))
// Iterate `g` from `MAX_VAL` down to 1:
//   `exact_gcd_count[g] = pairs_with_gcd_multiple_of[g]`
//   For `m = 2g` to `MAX_VAL` step `g`:
//     `exact_gcd_count[g] -= exact_gcd_count[m]`
//
// `prefix_gcd_count[g]`: number of pairs (a, b) where `gcd(a, b) <= g`.
// Compute `prefix_gcd_count`: O(MAX_VAL)
// `prefix_gcd_count[0] = 0`
// For `g` from 1 to `MAX_VAL`:
//   `prefix_gcd_count[g] = prefix_gcd_count[g-1] + exact_gcd_count[g]`
//
// For each query `k`:
//   Find smallest `g` such that `prefix_gcd_count[g] >= k + 1` using binary search.
//
// Example walk-through: nums = [2,3,4], queries = [0,2,2]
// MAX_VAL = 4
//
// freq: [0, 0, 1, 1, 1] (indices 0, 1, 2, 3, 4)
//
// counts:
// g=1: freq[1]+freq[2]+freq[3]+freq[4] = 0+1+1+1 = 3
// g=2: freq[2]+freq[4] = 1+1 = 2
// g=3: freq[3] = 1
// g=4: freq[4] = 1
// counts = [0, 3, 2, 1, 1] (indices 0, 1, 2, 3, 4)
//
// pairs_with_gcd_multiple_of:
// g=1: counts[1]*(counts[1]-1)/2 = 3*2/2 = 3 (pairs are (2,3), (2,4), (3,4))
// g=2: counts[2]*(counts[2]-1)/2 = 2*1/2 = 1 (pair is (2,4))
// g=3: counts[3]*(counts[3]-1)/2 = 1*0/2 = 0
// g=4: counts[4]*(counts[4]-1)/2 = 1*0/2 = 0
// pairs_with_gcd_multiple_of = [0, 3, 1, 0, 0]
//
// exact_gcd_count (iterate g from 4 down to 1):
// g=4: exact_gcd_count[4] = pairs_with_gcd_multiple_of[4] = 0
// g=3: exact_gcd_count[3] = pairs_with_gcd_multiple_of[3] = 0
// g=2: exact_gcd_count[2] = pairs_with_gcd_multiple_of[2] - exact_gcd_count[4] (since 4 is a multiple of 2)
//      exact_gcd_count[2] = 1 - 0 = 1. (Pair is (2,4) with gcd 2)
// g=1: exact_gcd_count[1] = pairs_with_gcd_multiple_of[1] - exact_gcd_count[2] - exact_gcd_count[3] - exact_gcd_count[4]
//      exact_gcd_count[1] = 3 - 1 - 0 - 0 = 2. (Pairs are (2,3) with gcd 1, (3,4) with gcd 1)
// exact_gcd_count = [0, 2, 1, 0, 0]
//
// prefix_gcd_count:
// g=0: 0
// g=1: 0 + exact_gcd_count[1] = 0 + 2 = 2. (2 pairs have gcd <= 1)
// g=2: 2 + exact_gcd_count[2] = 2 + 1 = 3. (3 pairs have gcd <= 2)
// g=3: 3 + exact_gcd_count[3] = 3 + 0 = 3. (3 pairs have gcd <= 3)
// g=4: 3 + exact_gcd_count[4] = 3 + 0 = 3. (3 pairs have gcd <= 4)
// prefix_gcd_count = [0, 2, 3, 3, 3]
//
// total pairs = n*(n-1)/2 = 3*2/2 = 3.
// gcdPairs sorted conceptually:
// 2 pairs have gcd=1
// 1 pair has gcd=2
//
// gcdPairs = [1, 1, 2]
//
// Queries: [0, 2, 2]
//
// Query 0: k = 0. Need k+1 = 1st smallest GCD.
// Find smallest g such that prefix_gcd_count[g] >= 1.
// prefix_gcd_count[1] = 2 >= 1. So smallest g is 1. Answer: 1.
//
// Query 1: k = 2. Need k+1 = 3rd smallest GCD.
// Find smallest g such that prefix_gcd_count[g] >= 3.
// prefix_gcd_count[1] = 2 < 3
// prefix_gcd_count[2] = 3 >= 3. So smallest g is 2. Answer: 2.
//
// Query 2: k = 2. Need k+1 = 3rd smallest GCD.
// Find smallest g such that prefix_gcd_count[g] >= 3.
// prefix_gcd_count[2] = 3 >= 3. So smallest g is 2. Answer: 2.
//
// Result: [1, 2, 2]. Matches example.
//
// Implementation details:
// Use `int` for counts. `MAX_VAL` can be up to 50000. `N` can be up to 10^5.
// `freq` array size: 50001
// `counts` array size: 50001
// `pairs_with_gcd_multiple_of` array size: 50001 (this can be combined with `exact_gcd_count` calculation)
// `exact_gcd_count` array size: 50001
// `prefix_gcd_count` array size: 50001
//
// Helper function for GCD is not needed as we are not calculating GCDs of pairs directly.
//
// The binary search needs to find the smallest `g` such that `prefix_gcd_count[g] >= target_rank` (where `target_rank = k + 1`).
// Standard binary search implementation:
// `low = 1`, `high = MAX_VAL`, `ans = MAX_VAL`
// while `low <= high`:
//   `mid = low + (high - low) / 2`
//   if `prefix_gcd_count[mid] >= target_rank`:
//     `ans = mid`
//     `high = mid - 1`
//   else:
//     `low = mid + 1`
// return `ans`

class Solution {
    private static final int MAX_VAL = 50000; // Maximum possible value in nums

    public int[] sortedGcdPairQueries(int[] nums, int[] queries) {
        // freq[i] stores the count of number i in the input array nums.
        int[] freq = new int[MAX_VAL + 1];
        for (int num : nums) {
            freq[num]++;
        }

        // counts[g] stores the count of numbers in nums that are multiples of g.
        int[] counts = new int[MAX_VAL + 1];
        // Iterate through each potential divisor 'g'.
        for (int g = 1; g <= MAX_VAL; g++) {
            // Iterate through all multiples 'm' of 'g' up to MAX_VAL.
            for (int m = g; m <= MAX_VAL; m += g) {
                // If 'm' exists in nums (freq[m] > 0), add its frequency to counts[g].
                counts[g] += freq[m];
            }
        }

        // pairsWithGcdMultipleOf[g] stores the number of pairs (nums[i], nums[j])
        // such that g divides gcd(nums[i], nums[j]). This is equivalent to
        // both nums[i] and nums[j] being multiples of g.
        long[] pairsWithGcdMultipleOf = new long[MAX_VAL + 1];
        for (int g = 1; g <= MAX_VAL; g++) {
            if (counts[g] >= 2) {
                // If there are 'k' multiples of 'g', the number of pairs is k * (k - 1) / 2.
                pairsWithGcdMultipleOf[g] = (long) counts[g] * (counts[g] - 1) / 2;
            }
        }

        // exactGcdCount[g] stores the number of pairs (nums[i], nums[j])
        // such that gcd(nums[i], nums[j]) == g.
        // We use the principle of inclusion-exclusion here.
        // We iterate from the largest possible GCD down to 1.
        long[] exactGcdCount = new long[MAX_VAL + 1];
        for (int g = MAX_VAL; g >= 1; g--) {
            // Initially, assume all pairs whose GCD is a multiple of 'g' have GCD exactly 'g'.
            exactGcdCount[g] = pairsWithGcdMultipleOf[g];

            // Now, subtract the counts of pairs whose GCD is a larger multiple of 'g' (e.g., 2g, 3g, ...).
            // These counts would have been calculated when we processed 2g, 3g, etc.
            for (int m = 2 * g; m <= MAX_VAL; m += g) {
                exactGcdCount[g] -= exactGcdCount[m];
            }
        }

        // prefixGcdCount[g] stores the total count of pairs whose GCD is less than or equal to g.
        // This will allow us to efficiently find the k-th smallest GCD using binary search.
        long[] prefixGcdCount = new long[MAX_VAL + 1];
        for (int g = 1; g <= MAX_VAL; g++) {
            prefixGcdCount[g] = prefixGcdCount[g - 1] + exactGcdCount[g];
        }

        // Prepare the answer array for the queries.
        int[] answer = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            // The query `queries[i]` asks for the (queries[i])-th element in the sorted gcdPairs.
            // This corresponds to the (queries[i] + 1)-th smallest GCD value.
            long targetRank = (long) queries[i] + 1;

            // Binary search to find the smallest 'g' such that prefixGcdCount[g] >= targetRank.
            int low = 1, high = MAX_VAL, resultG = MAX_VAL;
            while (low <= high) {
                int mid = low + (high - low) / 2;
                if (prefixGcdCount[mid] >= targetRank) {
                    // If the count up to 'mid' is sufficient, 'mid' is a potential answer.
                    // We try to find a smaller 'g' by searching in the left half.
                    resultG = mid;
                    high = mid - 1;
                } else {
                    // If the count is not sufficient, we need a larger GCD, so search in the right half.
                    low = mid + 1;
                }
            }
            // The found 'resultG' is the value of the (queries[i] + 1)-th smallest GCD.
            answer[i] = resultG;
        }

        return answer;
    }
}
```