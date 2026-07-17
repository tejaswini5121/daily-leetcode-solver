```cpp
// Problem: Sorted GCD Pair Queries
// Link: https://leetcode.com/problems/sorted-gcd-pair-queries/
//
// Approach:
// The problem asks us to find the k-th smallest GCD among all pairs in a given array `nums`.
// The total number of pairs can be up to N*(N-1)/2, which is too large to compute and sort directly
// if N is up to 10^5. The maximum value in `nums` is 5 * 10^4. This suggests that we should
// focus on the possible GCD values themselves.
//
// The maximum possible GCD is bounded by the maximum value in `nums`. Let's call this `MAX_VAL`.
// We can iterate through all possible GCD values from `MAX_VAL` down to 1. For each potential GCD `g`,
// we want to count how many pairs `(nums[i], nums[j])` have `gcd(nums[i], nums[j]) >= g`.
//
// To efficiently count pairs with `gcd(nums[i], nums[j]) >= g`, it's easier to count pairs
// with `gcd(nums[i], nums[j])` being a multiple of `g`.
// If `gcd(nums[i], nums[j])` is a multiple of `g`, then both `nums[i]` and `nums[j]` must be
// multiples of `g`.
//
// Let `count[x]` be the number of occurrences of `x` in the `nums` array.
// We can precompute `count` for all numbers up to `MAX_VAL`.
//
// For a given potential GCD `g`, we are interested in numbers in `nums` that are multiples of `g`.
// Let `multiples_count[g]` be the number of elements in `nums` that are multiples of `g`.
// We can compute `multiples_count[g]` by iterating through all multiples of `g` up to `MAX_VAL`
// and summing their counts from the `count` array. Specifically, `multiples_count[g] = sum(count[k])`
// for all `k` such that `k` is a multiple of `g` and `k <= MAX_VAL`.
// This can be computed efficiently by iterating from `MAX_VAL` down to 1. For each `g`,
// `multiples_count[g] = count[g] + multiples_count[2g] + multiples_count[3g] + ...`.
//
// Once we have `multiples_count[g]`, the number of pairs `(nums[i], nums[j])` where both `nums[i]`
// and `nums[j]` are multiples of `g` is `multiples_count[g] * (multiples_count[g] - 1) / 2`.
//
// Now, let `num_pairs_with_gcd_multiple_of[g]` be the number of pairs `(nums[i], nums[j])` such that
// `gcd(nums[i], nums[j])` is a multiple of `g`. This is exactly `multiples_count[g] * (multiples_count[g] - 1) / 2`.
//
// We want to find `num_pairs_with_gcd_exactly[g]`, the number of pairs with GCD exactly `g`.
// This can be derived using the principle of inclusion-exclusion.
// `num_pairs_with_gcd_exactly[g] = num_pairs_with_gcd_multiple_of[g] - sum(num_pairs_with_gcd_exactly[m])`
// for all `m` such that `m` is a multiple of `g` and `m > g`.
// This calculation is best done by iterating from `MAX_VAL` down to 1.
//
// After computing `num_pairs_with_gcd_exactly[g]` for all `g` from 1 to `MAX_VAL`, we can construct
// the `gcdPairs` conceptually. We can maintain a running count of how many pairs we have accounted for.
// For each `g` from `MAX_VAL` down to 1, if `num_pairs_with_gcd_exactly[g] > 0`, it means we have
// `num_pairs_with_gcd_exactly[g]` pairs whose GCD is exactly `g`. These pairs will appear in the sorted
// `gcdPairs` list after all pairs with GCD greater than `g`.
//
// We can use a prefix sum-like approach to map the query indices to the actual GCD values.
// Let `sorted_gcd_counts[g]` store the number of pairs whose GCD is exactly `g`.
// We can then compute `cumulative_count[g]` which is the total number of pairs with GCD greater than or equal to `g`.
// `cumulative_count[g] = sum(sorted_gcd_counts[k])` for `k >= g`.
//
// For a query `q`, we are looking for the GCD value `g` such that `cumulative_count[g] > q` and `cumulative_count[g+1] <= q`.
// This `g` is the `q`-th element in the sorted `gcdPairs` list.
// We can use binary search on the GCD values (from 1 to `MAX_VAL`) to find this `g` for each query.
//
// The overall process:
// 1. Count frequencies of each number in `nums`.
// 2. Precompute `multiples_count[g]` for `g` from `MAX_VAL` down to 1.
// 3. Precompute `num_pairs_with_gcd_multiple_of[g]` = `multiples_count[g] * (multiples_count[g] - 1) / 2` for `g` from `MAX_VAL` down to 1.
// 4. Precompute `num_pairs_with_gcd_exactly[g]` for `g` from `MAX_VAL` down to 1 using inclusion-exclusion:
//    `num_pairs_with_gcd_exactly[g] = num_pairs_with_gcd_multiple_of[g] - sum(num_pairs_with_gcd_exactly[m])` for `m = 2g, 3g, ... <= MAX_VAL`.
// 5. Store `num_pairs_with_gcd_exactly` in an array, say `gcd_counts_exact`.
// 6. Compute the cumulative counts. Let `total_pairs_count[g]` be the total number of pairs with GCD >= g.
//    `total_pairs_count[g] = sum(gcd_counts_exact[k])` for `k >= g`. This can be computed by iterating from `MAX_VAL` down to 1.
// 7. For each query `q`, find the largest `g` such that `total_pairs_count[g] > q`. This `g` is the answer. This can be done with binary search on `g` from 1 to `MAX_VAL`.
//
// Example Walkthrough (nums = [2,3,4]):
// MAX_VAL = 4
//
// 1. Frequencies: count[2]=1, count[3]=1, count[4]=1. Others 0.
//
// 2. multiples_count:
//    multiples_count[4] = count[4] = 1
//    multiples_count[3] = count[3] = 1
//    multiples_count[2] = count[2] + count[4] = 1 + 1 = 2 (numbers 2, 4 are multiples of 2)
//    multiples_count[1] = count[1] + count[2] + count[3] + count[4] = 0 + 1 + 1 + 1 = 3 (numbers 1, 2, 3, 4 are multiples of 1)
//
// 3. num_pairs_with_gcd_multiple_of:
//    g=4: multiples_count[4]=1. Pairs = 1*(0)/2 = 0.
//    g=3: multiples_count[3]=1. Pairs = 1*(0)/2 = 0.
//    g=2: multiples_count[2]=2. Pairs = 2*(1)/2 = 1. (pair (2,4) has GCD multiple of 2)
//    g=1: multiples_count[1]=3. Pairs = 3*(2)/2 = 3. (pairs (2,3), (2,4), (3,4) have GCD multiple of 1)
//
// 4. num_pairs_with_gcd_exactly (iterating from MAX_VAL down to 1):
//    g=4: num_pairs_with_gcd_multiple_of[4] = 0. No multiples of 4 > 4. => num_pairs_with_gcd_exactly[4] = 0.
//    g=3: num_pairs_with_gcd_multiple_of[3] = 0. No multiples of 3 > 3. => num_pairs_with_gcd_exactly[3] = 0.
//    g=2: num_pairs_with_gcd_multiple_of[2] = 1. Multiples of 2 > 2 are {4}.
//         num_pairs_with_gcd_exactly[4] = 0.
//         => num_pairs_with_gcd_exactly[2] = num_pairs_with_gcd_multiple_of[2] - num_pairs_with_gcd_exactly[4] = 1 - 0 = 1. (pair (2,4) has GCD exactly 2)
//    g=1: num_pairs_with_gcd_multiple_of[1] = 3. Multiples of 1 > 1 are {2, 3, 4}.
//         num_pairs_with_gcd_exactly[2] = 1.
//         num_pairs_with_gcd_exactly[3] = 0.
//         num_pairs_with_gcd_exactly[4] = 0.
//         => num_pairs_with_gcd_exactly[1] = num_pairs_with_gcd_multiple_of[1] - (num_pairs_with_gcd_exactly[2] + num_pairs_with_gcd_exactly[3] + num_pairs_with_gcd_exactly[4])
//         => num_pairs_with_gcd_exactly[1] = 3 - (1 + 0 + 0) = 2. (pairs (2,3) and (3,4) have GCD exactly 1)
//
// gcd_counts_exact: [_, 2, 1, 0, 0] (indices 1, 2, 3, 4)
//
// 5. cumulative_count (total_pairs_count) (iterating from MAX_VAL down to 1):
//    total_pairs_count[4] = gcd_counts_exact[4] = 0
//    total_pairs_count[3] = gcd_counts_exact[3] + total_pairs_count[4] = 0 + 0 = 0
//    total_pairs_count[2] = gcd_counts_exact[2] + total_pairs_count[3] = 1 + 0 = 1 (pair (2,4) has GCD >= 2)
//    total_pairs_count[1] = gcd_counts_exact[1] + total_pairs_count[2] = 2 + 1 = 3 (all 3 pairs have GCD >= 1)
//
//    total_pairs_count: [_, 3, 1, 0, 0]
//
// 6. Queries: queries = [0, 2, 2]
//
//    Query 0: We need the 0-th smallest GCD.
//             Find largest `g` such that `total_pairs_count[g] > 0`.
//             total_pairs_count[1] = 3 > 0. Answer is 1.
//
//    Query 1: We need the 1st smallest GCD.
//             Find largest `g` such that `total_pairs_count[g] > 1`.
//             total_pairs_count[1] = 3 > 1.
//             total_pairs_count[2] = 1, not > 1.
//             The largest `g` such that `total_pairs_count[g] > 1` is `g=1`. This is incorrect.
//
// Let's refine step 6 and 7. The `total_pairs_count[g]` is the count of pairs with GCD >= `g`.
// If query index is `k`, we are looking for the GCD `G` such that there are `k` pairs with GCD < `G`,
// and `total_pairs_count[G]` is the number of pairs with GCD >= `G`.
//
// The sorted `gcdPairs` looks like this:
// `gcd_counts_exact[1]` times `1`, followed by `gcd_counts_exact[2]` times `2`, ..., `gcd_counts_exact[MAX_VAL]` times `MAX_VAL`.
//
// Total pairs = Sum(gcd_counts_exact) = 3.
//
// Conceptual `gcdPairs` sorted: [1, 1, 2]
// Index 0: GCD is 1
// Index 1: GCD is 1
// Index 2: GCD is 2
//
// For query `q`:
// We want to find the `g` such that the number of pairs with GCD < `g` is exactly `q`, or the first `g` such that the cumulative count of pairs with GCD < `g` is `q`.
//
// Let's define `count_less_than[g]` = Number of pairs with GCD < `g`.
// `count_less_than[g] = sum(gcd_counts_exact[k])` for `k < g`.
//
// We can compute `count_less_than` array by iterating from 1 to `MAX_VAL`.
//
// `count_less_than[1] = 0`
// `count_less_than[2] = gcd_counts_exact[1] = 2` (pairs with GCD < 2 are those with GCD 1)
// `count_less_than[3] = gcd_counts_exact[1] + gcd_counts_exact[2] = 2 + 1 = 3` (pairs with GCD < 3 are those with GCD 1 or 2)
// `count_less_than[4] = gcd_counts_exact[1] + gcd_counts_exact[2] + gcd_counts_exact[3] = 2 + 1 + 0 = 3`
// `count_less_than[5] = gcd_counts_exact[1] + gcd_counts_exact[2] + gcd_counts_exact[3] + gcd_counts_exact[4] = 2 + 1 + 0 + 0 = 3`
//
// Now for a query `q`, we need to find `g` such that `count_less_than[g] <= q < count_less_than[g+1]`.
// This means `g` is the GCD value.
//
// We can use binary search on `g` from 1 to `MAX_VAL`.
// For a query `q`, we search for `g` in the range `[1, MAX_VAL]`.
// If `count_less_than[mid] <= q`, it means the GCD we are looking for might be `mid` or greater. So we search in `[mid, high]`.
// If `count_less_than[mid] > q`, it means the GCD we are looking for is less than `mid`. So we search in `[low, mid-1]`.
//
// Binary search logic:
// We are searching for the smallest `g` such that `count_less_than[g] > q`.
// Let `low = 1`, `high = MAX_VAL`.
// While `low <= high`:
//   `mid = low + (high - low) / 2`
//   If `count_less_than[mid] <= q`: This `mid` could be the answer or we need a larger GCD.
//      So, we can potentially have `mid` as the answer, and try to find a larger one.
//      We need to find the smallest `g` such that `q` falls into the range of `g`.
//      This means `g` is the smallest number such that the number of elements before it is `<= q`.
//      So if `count_less_than[mid] <= q`, it means `mid` is a potential candidate or smaller.
//      We are looking for the index `k` such that `k` is the `q`-th element.
//      The GCD `g` is such that `q` is within the range `[count_less_than[g], count_less_than[g+1] - 1]`.
//      Or, `q` is the index. The number of pairs strictly less than `g` is `count_less_than[g]`.
//      So if `count_less_than[mid] <= q`, it implies that the `q`-th element is at least `mid`.
//      `low = mid + 1`.
//   Else (`count_less_than[mid] > q`): The `q`-th element must be less than `mid`.
//      `high = mid - 1`.
// After the loop, `low` will be the smallest value such that `count_less_than[low] > q`.
// This `low` is our answer.
//
// Let's re-check with Example 1:
// queries = [0, 2, 2]
// count_less_than: [_, 0, 2, 3, 3] for g = 1, 2, 3, 4
//
// Query 0 (q=0):
// Binary search for smallest `g` such that `count_less_than[g] > 0`.
// Range [1, 4].
// mid=2. count_less_than[2]=2 > 0. high = 1.
// mid=1. count_less_than[1]=0. Not > 0. low = 2.
// loop ends. low = 2.
// This still seems wrong. The answer should be 1.
//
// Let's re-think the relationship.
// `gcdPairs` sorted: `g_1, g_2, ..., g_M` where `M = n*(n-1)/2`.
// For query `q`, we want `gcdPairs[q]`.
//
// We have `gcd_counts_exact[g]` = number of pairs with GCD exactly `g`.
// Let's create a mapping from index to GCD.
// We can iterate through `g` from 1 to `MAX_VAL`. For each `g`, add `gcd_counts_exact[g]` entries of value `g` to a conceptual list.
//
// Example 1 again:
// gcd_counts_exact: [_, 2, 1, 0, 0] (for g=1, 2, 3, 4)
//
// For g=1: count is 2. Add two '1's. List: [1, 1]
// For g=2: count is 1. Add one '2'. List: [1, 1, 2]
// For g=3: count is 0.
// For g=4: count is 0.
//
// `gcdPairs` sorted: [1, 1, 2].
//
// Query 0: gcdPairs[0] = 1.
// Query 2: gcdPairs[2] = 2.
//
// So the original approach of finding the index mapping is correct, but the binary search condition needs careful thought.
//
// For a query `q`, we want to find `g` such that `q` falls into the block of `g` values.
// The block of `g` values starts after all pairs with GCD < `g` have been listed.
// Let `cumulative_pairs_before[g]` = number of pairs with GCD strictly less than `g`.
// `cumulative_pairs_before[g] = sum(gcd_counts_exact[k])` for `k` from 1 to `g-1`.
//
// `cumulative_pairs_before[1] = 0`
// `cumulative_pairs_before[2] = gcd_counts_exact[1] = 2`
// `cumulative_pairs_before[3] = gcd_counts_exact[1] + gcd_counts_exact[2] = 2 + 1 = 3`
// `cumulative_pairs_before[4] = gcd_counts_exact[1] + gcd_counts_exact[2] + gcd_counts_exact[3] = 2 + 1 + 0 = 3`
//
// Now, for query `q`, we are looking for the smallest `g` such that `cumulative_pairs_before[g+1] > q`.
// This is equivalent to finding the smallest `g` such that `cumulative_pairs_before[g] <= q`.
//
// Let's re-apply binary search for `q` in `[0, total_pairs - 1]`.
// We search for `g` in `[1, MAX_VAL]`.
//
// For query `q`, we want to find the smallest `g` such that `cumulative_pairs_before[g] <= q`.
// If `cumulative_pairs_before[mid] <= q`, it means the GCD could be `mid` or greater. We try to find a larger `g`.
// `low = mid + 1`.
// If `cumulative_pairs_before[mid] > q`, it means the GCD must be less than `mid`.
// `high = mid - 1`.
//
// After loop, `low` will be the smallest `g` such that `cumulative_pairs_before[g] > q`.
// This `low` is actually `g+1` from our definition. So the answer is `low - 1`.
//
// Let's trace query `q=0`:
// `cumulative_pairs_before`: [_, 0, 2, 3, 3] (for g=1, 2, 3, 4)
// Search for `g` in [1, 4].
// `low=1, high=4`. `mid=2`. `cumulative_pairs_before[2]=2`. `2 > 0`. `high = 1`.
// `low=1, high=1`. `mid=1`. `cumulative_pairs_before[1]=0`. `0 <= 0`. `low = 2`.
// Loop ends. `low = 2`. Answer is `low - 1 = 1`. Correct.
//
// Let's trace query `q=2`:
// Search for `g` in [1, 4].
// `low=1, high=4`. `mid=2`. `cumulative_pairs_before[2]=2`. `2 <= 2`. `low = 3`.
// `low=3, high=4`. `mid=3`. `cumulative_pairs_before[3]=3`. `3 > 2`. `high = 2`.
// Loop ends. `low = 3`. Answer is `low - 1 = 2`. Correct.
//
// The maximum value of `nums[i]` is `5 * 10^4`. Let `MAX_VAL = 50000`.
//
// Time Complexity:
// 1. Counting frequencies: O(N + MAX_VAL) where N is length of nums.
// 2. Computing `multiples_count`: O(MAX_VAL * log(MAX_VAL)). For each `g`, we iterate through its multiples. Sum of (MAX_VAL/g) for g=1 to MAX_VAL is MAX_VAL * H(MAX_VAL) approx MAX_VAL * log(MAX_VAL).
// 3. Computing `num_pairs_with_gcd_multiple_of`: O(MAX_VAL).
// 4. Computing `num_pairs_with_gcd_exactly`: O(MAX_VAL * log(MAX_VAL)). Similar to step 2, but in reverse.
// 5. Computing `cumulative_pairs_before`: O(MAX_VAL).
// 6. Processing queries: For each query, we do a binary search on `MAX_VAL`. So Q * log(MAX_VAL), where Q is length of queries.
//
// Total Time Complexity: O(N + MAX_VAL * log(MAX_VAL) + Q * log(MAX_VAL)).
// Given constraints: N <= 10^5, MAX_VAL <= 5*10^4, Q <= 10^5.
// The dominant term is likely `MAX_VAL * log(MAX_VAL)` which is approx 50000 * 16, manageable.
//
// Space Complexity:
// - `count` array: O(MAX_VAL)
// - `multiples_count` array: O(MAX_VAL)
// - `gcd_counts_exact` array: O(MAX_VAL)
// - `cumulative_pairs_before` array: O(MAX_VAL)
// Total Space Complexity: O(MAX_VAL).
//
// The `MAX_VAL` is 50000.
// Let's set `MAX_VAL = 50001` to be safe for 1-based indexing.
//
// Implementation details:
// Use `std::vector` for arrays.
// `std::gcd` is available in `<numeric>`.
// `std::vector<int> nums`, `std::vector<int> queries`.
// `std::vector<int> count(MAX_VAL)`
// `std::vector<long long> multiples_count(MAX_VAL)` // Use long long for counts, as n*(n-1)/2 can exceed int
// `std::vector<long long> gcd_counts_exact(MAX_VAL)`
// `std::vector<long long> cumulative_pairs_before(MAX_VAL)`
//
// The total number of pairs can be up to (10^5 * (10^5 - 1))/2, which is very large.
// However, the constraints are `n <= 10^5`, so `n*(n-1)/2` could be up to `5*10^9`.
// The problem states `0 <= queries[i] < n * (n - 1) / 2`.
// The counts of pairs can indeed exceed `int`. So `long long` is necessary.
//
// Consider `MAX_VAL` for indexing. If max number is 50000, indices should go up to 50000.
// So `MAX_VAL = 50001`.
//
// Edge case: if `nums` has duplicates. The counting `count[x]` handles this.
// `multiples_count[g]` correctly sums up counts of numbers that are multiples of `g`.
// Pairs are formed using distinct indices `i < j`. The formula `k * (k - 1) / 2` correctly counts unordered pairs from `k` items.
//
// Final check on `cumulative_pairs_before` calculation and binary search:
// `cumulative_pairs_before[g]` = number of pairs with GCD < `g`.
// This means it counts pairs whose GCD is in `{1, 2, ..., g-1}`.
// So `cumulative_pairs_before[g] = gcd_counts_exact[1] + ... + gcd_counts_exact[g-1]`.
//
// For query `q`, we want the `q`-th smallest GCD.
// `gcdPairs` indices: 0, 1, ..., `q`, ...
//
// The GCD value `G` will be the answer if the `q`-th index falls into the block of `G`.
// This block starts at index `cumulative_pairs_before[G]` and ends at index `cumulative_pairs_before[G+1] - 1`.
// So we need to find `G` such that `cumulative_pairs_before[G] <= q < cumulative_pairs_before[G+1]`.
//
// Binary search for `G` in `[1, MAX_VAL]`.
// For a `mid` value:
// If `cumulative_pairs_before[mid] <= q`: This means `mid` is a possible GCD value or we need a larger one.
//   The index `q` might fall into the block of GCD `mid` or a larger GCD.
//   We are looking for the smallest `G` such that `q` is within its block.
//   This means `cumulative_pairs_before[G] <= q`.
//   So, if `cumulative_pairs_before[mid] <= q`, then `mid` is a potential answer, or we need a larger answer.
//   So `ans = mid`, `low = mid + 1`.
// If `cumulative_pairs_before[mid] > q`: This means `q` must be in a block with GCD smaller than `mid`.
//   So `high = mid - 1`.
//
// This binary search structure finds the largest `G` such that `cumulative_pairs_before[G] <= q`.
// Let's trace q=0 again:
// `cumulative_pairs_before`: [_, 0, 2, 3, 3]
// Search for largest `G` in [1, 4] such that `cumulative_pairs_before[G] <= 0`.
// `low=1, high=4`. `mid=2`. `cumulative_pairs_before[2]=2`. `2 > 0`. `high = 1`.
// `low=1, high=1`. `mid=1`. `cumulative_pairs_before[1]=0`. `0 <= 0`. `ans = 1`. `low = 2`.
// Loop ends. `ans = 1`. Correct.
//
// Trace q=2 again:
// Search for largest `G` in [1, 4] such that `cumulative_pairs_before[G] <= 2`.
// `low=1, high=4`. `mid=2`. `cumulative_pairs_before[2]=2`. `2 <= 2`. `ans = 2`. `low = 3`.
// `low=3, high=4`. `mid=3`. `cumulative_pairs_before[3]=3`. `3 > 2`. `high = 2`.
// Loop ends. `ans = 2`. Correct.
//
// This binary search finds the correct GCD value.
//
// Make sure `MAX_VAL` is correctly handled.
// `nums[i]` <= 5 * 10^4.
// So possible GCDs are from 1 to 5 * 10^4.
// Max value in the `count`, `multiples_count`, `gcd_counts_exact`, `cumulative_pairs_before` arrays should be up to 50000.
// So size 50001 for 1-based indexing is good.
//
// Maximum value for `n * (n - 1) / 2` is not directly relevant for array sizes, but for query indices.
//
// Max value of N is 10^5. Max value of nums[i] is 5*10^4.
// Max value of queries[i] < N * (N-1) / 2.
// The number of pairs itself can be large. `long long` is necessary.
// `gcd_counts_exact` can store counts of pairs for each GCD value. Max count for a single GCD value could be large if many numbers are multiples of that GCD.
// For example, if `nums` are all `6`, and `g=2`, then `multiples_count[2] = n`. `num_pairs_with_gcd_multiple_of[2] = n*(n-1)/2`.
// So `gcd_counts_exact` and `cumulative_pairs_before` need `long long`.
//
// The constant `MAX_VAL` should be derived from the problem constraints.
// `int max_num = 0; for (int x : nums) max_num = std::max(max_num, x);`
// `const int MAX_VAL = max_num + 1;` might be better if `nums` are sparse and `max_num` is small.
// But using a fixed `50001` is safer and within limits.
//
// Max possible value for `nums[i]` is 50000. So `MAX_VAL = 50001` is appropriate.
//
// Consider GCD calculation: `std::gcd(a, b)` is in `<numeric>`.
// Ensure headers are included.
//
// `std::vector<int> count(MAX_VAL, 0);`
// `std::vector<long long> multiples_count(MAX_VAL, 0);`
// `std::vector<long long> gcd_counts_exact(MAX_VAL, 0);`
// `std::vector<long long> cumulative_pairs_before(MAX_VAL, 0);`
//
// Initialize all vectors to 0.
//
// The problem states `2 <= n`. So `n*(n-1)/2` is at least `2*1/2 = 1`.
//
// One optimization for computing `multiples_count` and `gcd_counts_exact`:
// Instead of iterating `g` from `MAX_VAL` down to 1 and then for each `g` iterating its multiples:
// `multiples_count[g] = count[g] + multiples_count[2g] + ...`
// We can do:
// For `g` from 1 to `MAX_VAL`:
//   If `count[g] > 0`:
//     For `m = g` up to `MAX_VAL` stepping by `g`:
//       `multiples_count[g] += count[m]`.
// This is O(MAX_VAL * log MAX_VAL).
//
// For `gcd_counts_exact`:
// Iterate `g` from `MAX_VAL` down to 1.
// `num_pairs_with_gcd_multiple_of[g] = multiples_count[g] * (multiples_count[g] - 1) / 2`.
// `gcd_counts_exact[g] = num_pairs_with_gcd_multiple_of[g]`.
// For `m = 2g` up to `MAX_VAL` stepping by `g`:
//   `gcd_counts_exact[g] -= gcd_counts_exact[m]`.
// This is also O(MAX_VAL * log MAX_VAL).
//
// The existing logic seems fine. The order of computation is important.
// The iteration from `MAX_VAL` down to 1 for `multiples_count` and `gcd_counts_exact` is correct for the dependency.
// `multiples_count[g]` needs `multiples_count[2g]`, etc. So `g` must be processed after its multiples. This means iterating from `MAX_VAL` down to 1.
//
// `multiples_count[g]` sums `count[k]` for `k` that are multiples of `g`.
// A correct way to compute `multiples_count`:
// For `i` from 1 to `MAX_VAL`:
//  For `j = i` up to `MAX_VAL` stepping by `i`:
//    `multiples_count[i] += count[j]`
// This is O(MAX_VAL log MAX_VAL).
//
// Then `num_pairs_with_gcd_multiple_of[g] = multiples_count[g] * (multiples_count[g] - 1) / 2`.
//
// Then `gcd_counts_exact[g]` calculation:
// Iterate `g` from `MAX_VAL` down to 1.
// `gcd_counts_exact[g] = num_pairs_with_gcd_multiple_of[g]`.
// For `m = 2*g` up to `MAX_VAL` stepping by `g`:
//  `gcd_counts_exact[g] -= gcd_counts_exact[m]`.
// This is also O(MAX_VAL log MAX_VAL).
//
// This refined calculation order seems more standard and correct.
//
// Let's consider a case where `nums = [6, 6, 6]`. N=3.
// MAX_VAL = 7 (or up to 6).
// count[6] = 3.
//
// Multiples count:
// i=1: mult[1] = count[1]+...+count[6] = 3
// i=2: mult[2] = count[2]+count[4]+count[6] = 0+0+3 = 3
// i=3: mult[3] = count[3]+count[6] = 0+3 = 3
// i=4: mult[4] = count[4] = 0
// i=5: mult[5] = count[5] = 0
// i=6: mult[6] = count[6] = 3
//
// Pairs with GCD multiple of:
// g=6: mult[6]=3. pairs = 3*2/2 = 3. (All 3 pairs are (6,6) with GCD=6)
// g=5: mult[5]=0. pairs = 0.
// g=4: mult[4]=0. pairs = 0.
// g=3: mult[3]=3. pairs = 3*2/2 = 3.
// g=2: mult[2]=3. pairs = 3*2/2 = 3.
// g=1: mult[1]=3. pairs = 3*2/2 = 3.
//
// GCD exactly: (Iterate g from MAX_VAL down to 1)
// g=6: num_pairs_mult_of[6] = 3. No m > 6. gcd_exact[6] = 3.
// g=5: num_pairs_mult_of[5] = 0. No m > 5 that is multiple of 5. gcd_exact[5] = 0.
// g=4: num_pairs_mult_of[4] = 0. No m > 4 that is multiple of 4. gcd_exact[4] = 0.
// g=3: num_pairs_mult_of[3] = 3. Multiples of 3 > 3: {6}.
//      gcd_exact[3] = num_pairs_mult_of[3] - gcd_exact[6] = 3 - 3 = 0.
// g=2: num_pairs_mult_of[2] = 3. Multiples of 2 > 2: {4, 6}.
//      gcd_exact[2] = num_pairs_mult_of[2] - (gcd_exact[4] + gcd_exact[6]) = 3 - (0 + 3) = 0.
// g=1: num_pairs_mult_of[1] = 3. Multiples of 1 > 1: {2, 3, 4, 5, 6}.
//      gcd_exact[1] = num_pairs_mult_of[1] - (gcd_exact[2] + gcd_exact[3] + gcd_exact[4] + gcd_exact[5] + gcd_exact[6])
//      gcd_exact[1] = 3 - (0 + 0 + 0 + 0 + 3) = 0.
//
// So gcd_counts_exact: [_, 0, 0, 0, 0, 0, 3] (for g=1 to 6)
//
// cumulative_pairs_before:
// cpb[1] = 0
// cpb[2] = gcd_exact[1] = 0
// cpb[3] = gcd_exact[1] + gcd_exact[2] = 0
// cpb[4] = cpb[3] + gcd_exact[3] = 0
// cpb[5] = cpb[4] + gcd_exact[4] = 0
// cpb[6] = cpb[5] + gcd_exact[5] = 0
// cpb[7] = cpb[6] + gcd_exact[6] = 3
//
// cpb: [_, 0, 0, 0, 0, 0, 3] (for g=1 to 6)
//
// Let's say queries = [0, 1, 2]. Total 3 pairs.
//
// Query 0 (q=0): Binary search for largest G such that cpb[G] <= 0.
// In range [1, 6].
// low=1, high=6. mid=3. cpb[3]=0. 0 <= 0. ans=3. low=4.
// low=4, high=6. mid=5. cpb[5]=0. 0 <= 0. ans=5. low=6.
// low=6, high=6. mid=6. cpb[6]=0. 0 <= 0. ans=6. low=7.
// Loop ends. ans=6.
// This is wrong. For [6,6,6], pairs are (6,6), (6,6), (6,6), all GCD=6. gcdPairs = [6,6,6].
// Indices 0, 1, 2 should all yield 6.
//
// My binary search logic for finding the largest G seems flawed when multiple G values yield cpb[G] <= q.
//
// Correct binary search:
// We want smallest `G` such that `cumulative_pairs_before[G+1] > q`.
// Which is equivalent to smallest `G` such that the number of pairs up to `G` (inclusive) is `> q`.
// The number of pairs with GCD <= `g` is `cumulative_pairs_before[g+1]`.
//
// So, for query `q`, find smallest `g` such that `cumulative_pairs_before[g+1] > q`.
// This means `g` is the answer.
//
// Let's define `cum_pairs[g]` = number of pairs with GCD <= `g`.
// `cum_pairs[g] = sum(gcd_counts_exact[k])` for `k` from 1 to `g`.
//
// Example 1:
// gcd_counts_exact: [_, 2, 1, 0, 0]
// cum_pairs[1] = 2
// cum_pairs[2] = 2 + 1 = 3
// cum_pairs[3] = 3 + 0 = 3
// cum_pairs[4] = 3 + 0 = 3
//
// cum_pairs: [_, 2, 3, 3, 3] (for g=1, 2, 3, 4)
//
// Query q. We need smallest `g` such that `cum_pairs[g] > q`.
// Binary search for `g` in [1, MAX_VAL].
//
// Query q=0: Smallest `g` such that `cum_pairs[g] > 0`.
// Range [1, 4].
// low=1, high=4. mid=2. cum_pairs[2]=3 > 0. ans=2. high=1.
// low=1, high=1. mid=1. cum_pairs[1]=2 > 0. ans=1. high=0.
// Loop ends. ans=1. Correct.
//
// Query q=2: Smallest `g` such that `cum_pairs[g] > 2`.
// Range [1, 4].
// low=1, high=4. mid=2. cum_pairs[2]=3 > 2. ans=2. high=1.
// low=1, high=1. mid=1. cum_pairs[1]=2. Not > 2. low=2.
// Loop ends. ans=2. Correct.
//
// Example: nums = [6, 6, 6]
// gcd_counts_exact: [_, 0, 0, 0, 0, 0, 3]
// cum_pairs[1]=0, cum_pairs[2]=0, cum_pairs[3]=0, cum_pairs[4]=0, cum_pairs[5]=0, cum_pairs[6]=3.
// cum_pairs: [_, 0, 0, 0, 0, 0, 3] (for g=1..6)
//
// Queries = [0, 1, 2].
// Query q=0: Smallest `g` such that `cum_pairs[g] > 0`.
// Range [1, 6].
// low=1, high=6. mid=3. cum_pairs[3]=0. Not > 0. low=4.
// low=4, high=6. mid=5. cum_pairs[5]=0. Not > 0. low=6.
// low=6, high=6. mid=6. cum_pairs[6]=3 > 0. ans=6. high=5.
// Loop ends. ans=6. Correct.
//
// Query q=1: Smallest `g` such that `cum_pairs[g] > 1`.
// Range [1, 6].
// low=1, high=6. mid=3. cum_pairs[3]=0. Not > 1. low=4.
// low=4, high=6. mid=5. cum_pairs[5]=0. Not > 1. low=6.
// low=6, high=6. mid=6. cum_pairs[6]=3 > 1. ans=6. high=5.
// Loop ends. ans=6. Correct.
//
// Query q=2: Smallest `g` such that `cum_pairs[g] > 2`.
// Range [1, 6].
// low=1, high=6. mid=3. cum_pairs[3]=0. Not > 2. low=4.
// low=4, high=6. mid=5. cum_pairs[5]=0. Not > 2. low=6.
// low=6, high=6. mid=6. cum_pairs[6]=3 > 2. ans=6. high=5.
// Loop ends. ans=6. Correct.
//
// This final approach seems solid.
// Precompute `cum_pairs` using `gcd_counts_exact`.
// Then for each query, binary search for `g` such that `cum_pairs[g] > q`.
//
// `cum_pairs` array size up to `MAX_VAL+1` for convenience.
// `std::vector<long long> cum_pairs(MAX_VAL + 1, 0);`
// Then loop: `for(int g = 1; g <= MAX_VAL; ++g) cum_pairs[g] = cum_pairs[g-1] + gcd_counts_exact[g];`
// Binary search range for `g` would be `[1, MAX_VAL]`.
//
// This logic should be correct.
//
// Need to be careful with MAX_VAL. If max element in nums is M, we only need to consider GCDs up to M.
// So MAX_VAL should be determined by the maximum element in `nums`.
// `int max_elem = 0; for (int x : nums) max_elem = std::max(max_elem, x);`
// `const int MAX_VAL = max_elem;`
// If we use this, arrays should be sized `MAX_VAL + 1`.
// But problem states `nums[i] <= 5 * 10^4`. A fixed `50001` is robust.
//
// Let's consider the constraints again:
// `2 <= n <= 10^5`
// `1 <= nums[i] <= 5 * 10^4`
// `1 <= queries.length <= 10^5`
// `0 <= queries[i] < n * (n - 1) / 2`
//
// The maximum value of `n * (n - 1) / 2` can be approximately `(10^5)^2 / 2 = 5 * 10^9`.
// This confirms `long long` is essential for counts.
//
// Final check on indices.
// `count` vector should map `nums[i]` values to their frequencies. Size `MAX_VAL`. Index `x` stores count of `x`.
// `multiples_count`, `gcd_counts_exact`, `cum_pairs` vectors store counts/sums related to GCDs.
// If GCDs can be up to `M`, these vectors should be of size `M+1`.
// So if `MAX_VAL` is 50000, vectors should be size 50001.
//
// `const int MAX_VAL = 50000;`
// `std::vector<int> count(MAX_VAL + 1, 0);`
// `std::vector<long long> multiples_count(MAX_VAL + 1, 0);`
// `std::vector<long long> gcd_counts_exact(MAX_VAL + 1, 0);`
// `std::vector<long long> cum_pairs(MAX_VAL + 1, 0);`
//
// This seems correct.

```cpp
#include <vector>
#include <numeric> // For std::gcd
#include <algorithm> // For std::max

// Define the maximum possible value for elements in nums and thus for GCDs.
// The problem constraints state nums[i] <= 5 * 10^4.
const int MAX_VAL = 50000;

class Solution {
public:
    std::vector<int> getCoprimes(std::vector<int>& nums, std::vector<int>& queries) {
        // Step 1: Count frequencies of each number in nums.
        // `count[x]` will store the number of occurrences of `x` in `nums`.
        std::vector<int> count(MAX_VAL + 1, 0);
        for (int x : nums) {
            count[x]++;
        }

        // Step 2: Compute `multiples_count[g]` for each possible GCD `g`.
        // `multiples_count[g]` is the total count of numbers in `nums` that are multiples of `g`.
        // We iterate `i` from 1 to MAX_VAL. For each `i`, we iterate through its multiples `j = i, 2i, 3i, ...`
        // and add the count of `j` from `nums` to `multiples_count[i]`.
        // This has a time complexity of O(MAX_VAL * log(MAX_VAL)).
        std::vector<long long> multiples_count(MAX_VAL + 1, 0);
        for (int i = 1; i <= MAX_VAL; ++i) {
            for (int j = i; j <= MAX_VAL; j += i) {
                multiples_count[i] += count[j];
            }
        }

        // Step 3: Compute `num_pairs_with_gcd_multiple_of[g]`.
        // This is the number of pairs (nums[i], nums[j]) such that gcd(nums[i], nums[j]) is a multiple of `g`.
        // If there are `k = multiples_count[g]` numbers in `nums` that are multiples of `g`, then
        // the number of pairs formed by these numbers is k * (k - 1) / 2.
        std::vector<long long> num_pairs_with_gcd_multiple_of(MAX_VAL + 1, 0);
        for (int g = 1; g <= MAX_VAL; ++g) {
            long long k = multiples_count[g];
            if (k > 1) {
                num_pairs_with_gcd_multiple_of[g] = k * (k - 1) / 2;
            }
        }

        // Step 4: Compute `gcd_counts_exact[g]`.
        // `gcd_counts_exact[g]` is the number of pairs (nums[i], nums[j]) such that gcd(nums[i], nums[j]) is exactly `g`.
        // We use the principle of inclusion-exclusion.
        // `gcd_counts_exact[g] = num_pairs_with_gcd_multiple_of[g] - sum(gcd_counts_exact[m])` for all `m` which are multiples of `g` and `m > g`.
        // This calculation is done by iterating `g` from `MAX_VAL` down to 1.
        // This has a time complexity of O(MAX_VAL * log(MAX_VAL)).
        std::vector<long long> gcd_counts_exact(MAX_VAL + 1, 0);
        for (int g = MAX_VAL; g >= 1; --g) {
            gcd_counts_exact[g] = num_pairs_with_gcd_multiple_of[g];
            // Subtract counts of pairs whose GCD is a proper multiple of `g`.
            for (int m = 2 * g; m <= MAX_VAL; m += g) {
                gcd_counts_exact[g] -= gcd_counts_exact[m];
            }
        }

        // Step 5: Compute `cum_pairs[g]`.
        // `cum_pairs[g]` stores the total count of pairs whose GCD is less than or equal to `g`.
        // This is a prefix sum of `gcd_counts_exact`.
        // `cum_pairs[g] = gcd_counts_exact[1] + gcd_counts_exact[2] + ... + gcd_counts_exact[g]`.
        // This has a time complexity of O(MAX_VAL).
        std::vector<long long> cum_pairs(MAX_VAL + 1, 0);
        for (int g = 1; g <= MAX_VAL; ++g) {
            cum_pairs[g] = cum_pairs[g - 1] + gcd_counts_exact[g];
        }

        // Step 6: Process queries.
        // For each query `q`, we need to find the `q`-th smallest GCD value.
        // The `q`-th smallest GCD is `g` if `cum_pairs[g-1] <= q < cum_pairs[g]`.
        // Or equivalently, find the smallest `g` such that `cum_pairs[g] > q`.
        // We can use binary search on the possible GCD values (from 1 to MAX_VAL).
        // The binary search for each query takes O(log(MAX_VAL)).
        std::vector<int> answer;
        answer.reserve(queries.size()); // Optimize for space by reserving memory

        for (int q : queries) {
            // Binary search for the smallest GCD `g` such that `cum_pairs[g] > q`.
            // `low` and `high` define the range of possible GCD values.
            int low = 1, high = MAX_VAL;
            int result_gcd = MAX_VAL; // Initialize with a default/maximum possible value.

            while (low <= high) {
                int mid = low + (high - low) / 2;
                // If the count of pairs with GCD <= `mid` is greater than `q`,
                // it means the `q`-th smallest GCD could be `mid` or smaller.
                // We store `mid` as a potential answer and try to find an even smaller GCD.
                if (cum_pairs[mid] > q) {
                    result_gcd = mid;
                    high = mid - 1;
                } else {
                    // If the count of pairs with GCD <= `mid` is not greater than `q`,
                    // it means the `q`-th smallest GCD must be greater than `mid`.
                    // So we search in the upper half.
                    low = mid + 1;
                }
            }
            answer.push_back(result_gcd);
        }

        return answer;
    }
};
```