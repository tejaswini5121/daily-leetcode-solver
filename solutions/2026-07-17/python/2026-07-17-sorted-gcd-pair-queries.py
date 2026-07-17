```python
# Problem: Sorted GCD Pair Queries
# Link: https://leetcode.com/problems/sorted-gcd-pair-queries/
#
# Approach:
# The problem asks us to find the k-th smallest GCD among all unique pairs of elements in a given array `nums`.
# The total number of pairs can be up to O(n^2), which is too large to generate and sort directly given n <= 10^5.
#
# The key observation is that the possible GCD values are limited by the maximum value in `nums`.
# We can iterate through all possible GCD values `g` from the maximum possible value down to 1.
# For each `g`, we need to count how many pairs `(nums[i], nums[j])` have `gcd(nums[i], nums[j]) = g`.
# A more efficient way is to count pairs `(nums[i], nums[j])` such that `gcd(nums[i], nums[j])` is a multiple of `g`.
# Let `count_multiple[g]` be the number of pairs `(nums[i], nums[j])` where `gcd(nums[i], nums[j])` is a multiple of `g`.
#
# We can calculate `count_multiple[g]` by first counting the occurrences of each number in `nums`.
# Let `freq[x]` be the frequency of number `x` in `nums`.
# The number of pairs `(nums[i], nums[j])` where both `nums[i]` and `nums[j]` are multiples of `g` is
# `(number of elements in nums that are multiples of g) * (number of elements in nums that are multiples of g - 1) / 2`.
# Let `num_multiples[g]` be the count of numbers in `nums` that are multiples of `g`.
# Then, `count_multiple[g] = num_multiples[g] * (num_multiples[g] - 1) // 2`.
#
# We can compute `num_multiples[g]` efficiently. For each number `x` present in `nums` (i.e., `freq[x] > 0`),
# we iterate through its multiples `m = x, 2x, 3x, ...` up to the maximum possible value.
# For each multiple `m`, we add `freq[x]` to `num_multiples[m]`.
# This is similar to a sieve.
#
# After computing `count_multiple[g]` for all `g`, we can use the principle of inclusion-exclusion to find the exact count of pairs whose GCD is exactly `g`.
# Let `count_exact[g]` be the number of pairs `(nums[i], nums[j])` such that `gcd(nums[i], nums[j]) = g`.
# `count_exact[g] = count_multiple[g] - sum(count_exact[k])` for all `k` which are proper multiples of `g` (i.e., `k = m * g` where `m > 1`).
# We can compute `count_exact[g]` by iterating `g` from maximum possible value down to 1.
#
# Once we have `count_exact[g]`, we can build a cumulative count array.
# Let `cumulative_count[g]` be the total number of pairs with GCD less than or equal to `g`.
# `cumulative_count[g] = cumulative_count[g-1] + count_exact[g]`.
#
# For each query `q`, we need to find the `q`-th smallest GCD. This is equivalent to finding the smallest `g` such that `cumulative_count[g] >= q + 1`.
# We can use binary search on the range of possible GCD values (1 to max_val) to find this `g`.
# The `cumulative_count` array can be precomputed, and then for each query, we perform a binary search.
#
# Maximum value in `nums` can be up to 5 * 10^4. Let's denote this as `MAX_VAL`.
#
# Steps:
# 1. Find the maximum value `MAX_VAL` in `nums`.
# 2. Calculate the frequency of each number in `nums` and store in `freq` array of size `MAX_VAL + 1`.
# 3. Calculate `num_multiples` array of size `MAX_VAL + 1`. For each `x` from 1 to `MAX_VAL`:
#    If `freq[x] > 0`: iterate through its multiples `m = x, 2x, 3x, ...` up to `MAX_VAL` and add `freq[x]` to `num_multiples[m]`.
# 4. Calculate `count_multiple` array of size `MAX_VAL + 1`. For each `g` from 1 to `MAX_VAL`:
#    `count_multiple[g] = num_multiples[g] * (num_multiples[g] - 1) // 2`.
# 5. Calculate `count_exact` array of size `MAX_VAL + 1`. Iterate `g` from `MAX_VAL` down to 1:
#    `count_exact[g] = count_multiple[g]`.
#    Then, subtract `count_exact[k]` for all `k` that are proper multiples of `g` (i.e., `k = m * g` where `m > 1`) up to `MAX_VAL`.
#    This can be done by iterating `g` from `MAX_VAL` down to 1, and for each `g`, iterate through its multiples `k = 2*g, 3*g, ...` up to `MAX_VAL` and `count_exact[g] -= count_exact[k]`.
# 6. Build `cumulative_count` array of size `MAX_VAL + 1`.
#    `cumulative_count[0] = 0`
#    For `g` from 1 to `MAX_VAL`: `cumulative_count[g] = cumulative_count[g-1] + count_exact[g]`.
# 7. For each query `q` in `queries`:
#    Perform binary search on `cumulative_count` to find the smallest `g` such that `cumulative_count[g] >= q + 1`.
#    The result of the binary search is the answer for the query.
#
# Time Complexity:
# - Finding MAX_VAL: O(n)
# - Calculating freq: O(n)
# - Calculating num_multiples: This is similar to a sieve. For each number `x` from 1 to `MAX_VAL`, we iterate through its multiples.
#   The total operations are sum(MAX_VAL / x) for x = 1 to MAX_VAL, which is O(MAX_VAL * log(MAX_VAL)).
# - Calculating count_multiple: O(MAX_VAL)
# - Calculating count_exact: This involves iterating downwards and subtracting. For each `g`, we iterate through its multiples.
#   The total operations are sum(MAX_VAL / x) for x = 1 to MAX_VAL, which is O(MAX_VAL * log(MAX_VAL)).
# - Building cumulative_count: O(MAX_VAL)
# - Processing queries: For each query, binary search takes O(log(MAX_VAL)). Total for `m` queries is O(m * log(MAX_VAL)).
# Overall time complexity: O(n + MAX_VAL * log(MAX_VAL) + m * log(MAX_VAL)).
# Given n, m <= 10^5 and MAX_VAL <= 5 * 10^4, this is efficient enough.
#
# Space Complexity:
# - `freq`, `num_multiples`, `count_multiple`, `count_exact`, `cumulative_count` arrays: O(MAX_VAL)
# Overall space complexity: O(MAX_VAL).

import math

class Solution:
    def sortedGcdPairs(self, nums: list[int], queries: list[int]) -> list[int]:
        # 1. Find the maximum value in nums.
        MAX_VAL = 0
        for x in nums:
            MAX_VAL = max(MAX_VAL, x)

        # 2. Calculate the frequency of each number in nums.
        freq = [0] * (MAX_VAL + 1)
        for x in nums:
            freq[x] += 1

        # 3. Calculate num_multiples[g]: the count of numbers in nums that are multiples of g.
        num_multiples = [0] * (MAX_VAL + 1)
        # Iterate through all possible divisors 'g' from 1 to MAX_VAL.
        for g in range(1, MAX_VAL + 1):
            # Iterate through all multiples 'm' of 'g' up to MAX_VAL.
            for m in range(g, MAX_VAL + 1, g):
                # If the multiple 'm' exists in nums (freq[m] > 0), add its frequency to num_multiples[g].
                if freq[m] > 0:
                    num_multiples[g] += freq[m]

        # 4. Calculate count_multiple[g]: the number of pairs (nums[i], nums[j]) where gcd(nums[i], nums[j]) is a multiple of g.
        # This is the number of ways to choose 2 elements from the set of numbers in nums that are multiples of g.
        count_multiple = [0] * (MAX_VAL + 1)
        for g in range(1, MAX_VAL + 1):
            count_multiple[g] = num_multiples[g] * (num_multiples[g] - 1) // 2

        # 5. Calculate count_exact[g]: the number of pairs (nums[i], nums[j]) where gcd(nums[i], nums[j]) is exactly g.
        # We use the principle of inclusion-exclusion.
        # Initialize count_exact[g] with count_multiple[g].
        count_exact = [0] * (MAX_VAL + 1)
        # Iterate from MAX_VAL down to 1.
        for g in range(MAX_VAL, 0, -1):
            count_exact[g] = count_multiple[g]
            # Subtract counts of pairs whose GCD is a proper multiple of g.
            # Iterate through multiples k of g (k = 2g, 3g, ...) up to MAX_VAL.
            for k in range(2 * g, MAX_VAL + 1, g):
                count_exact[g] -= count_exact[k]

        # 6. Build the cumulative_count array.
        # cumulative_count[g] will store the total number of pairs with GCD less than or equal to g.
        cumulative_count = [0] * (MAX_VAL + 1)
        for g in range(1, MAX_VAL + 1):
            cumulative_count[g] = cumulative_count[g-1] + count_exact[g]

        # 7. Process each query.
        answer = []
        for q in queries:
            # We need to find the (q+1)-th smallest GCD.
            # This is equivalent to finding the smallest 'g' such that cumulative_count[g] >= q + 1.
            # We use binary search on the range of possible GCD values [1, MAX_VAL].
            low, high = 1, MAX_VAL
            result_gcd = -1 # Placeholder

            while low <= high:
                mid = (low + high) // 2
                # If the number of pairs with GCD <= mid is at least q+1,
                # then the q-th GCD might be 'mid' or smaller.
                if cumulative_count[mid] >= q + 1:
                    result_gcd = mid # 'mid' is a potential answer
                    high = mid - 1   # Try to find an even smaller GCD
                else:
                    # If not enough pairs, the q-th GCD must be greater than 'mid'.
                    low = mid + 1

            answer.append(result_gcd)

        return answer

```