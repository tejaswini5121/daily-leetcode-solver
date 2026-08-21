```python
import math

# Problem: Kth Smallest Amount With Single Denomination Combination
# Link: https://leetcode.com/problems/kth-smallest-amount-with-single-denomination-combination/
#
# Approach:
# The problem asks for the kth smallest amount that can be formed by using coins of *only one* denomination at a time.
# This means we are looking for the kth smallest number that is a multiple of at least one of the given coin denominations.
#
# The amounts that can be formed are multiples of each coin. For example, if coins = [3, 5], the possible amounts are:
# Multiples of 3: 3, 6, 9, 12, 15, 18, ...
# Multiples of 5: 5, 10, 15, 20, 25, ...
# Combined, the unique amounts in sorted order are: 3, 5, 6, 9, 10, 12, 15, 18, 20, 25, ...
#
# The key observation is that we are looking for the kth smallest value in the union of arithmetic progressions.
# The number of elements less than or equal to a given `amount` can be calculated using the principle of inclusion-exclusion.
#
# Let's define a function `count_multiples(amount, coins)` that returns the number of distinct amounts less than or equal to `amount` that are multiples of at least one coin in `coins`.
#
# For a single coin `c`, the number of multiples of `c` less than or equal to `amount` is `amount // c`.
#
# When we have multiple coins, we need to handle overlaps. For example, if coins = [2, 3], multiples of 2 are {2, 4, 6, ...} and multiples of 3 are {3, 6, 9, ...}. The amount 6 is a multiple of both 2 and 3.
#
# The principle of inclusion-exclusion is applied here.
# - Add counts of multiples for each individual coin.
# - Subtract counts of multiples for pairs of coins (least common multiple - LCM).
# - Add counts of multiples for triplets of coins (LCM).
# - And so on...
#
# The LCM of a set of numbers `a, b, c, ...` is the smallest positive integer that is divisible by each of `a, b, c, ...`.
# `lcm(a, b) = (a * b) // gcd(a, b)`. For more than two numbers, `lcm(a, b, c) = lcm(lcm(a, b), c)`.
#
# The `count_multiples` function will iterate through all possible subsets of `coins`. For each subset:
# 1. Calculate the LCM of the coins in the subset.
# 2. If the LCM exceeds `amount`, we can stop considering this subset and larger subsets with this LCM.
# 3. If the size of the subset is odd, we add `amount // lcm` to the total count.
# 4. If the size of the subset is even, we subtract `amount // lcm` from the total count.
#
# Since the maximum possible amount can be very large (up to 25 * 2 * 10^9, roughly 5 * 10^10), we cannot iterate through all amounts. Instead, we use binary search on the possible `amount`.
#
# The search space for the binary search is from 1 to a sufficiently large upper bound. A safe upper bound could be `max(coins) * k` (e.g., 25 * 2 * 10^9). Let's use 2 * 10^14 as a practical upper bound, as LCMs can grow quite fast, and 25 * 2e9 is about 5e10.
#
# The binary search will work as follows:
# - `low = 1`, `high = 2 * 10^14` (or a slightly more precise upper bound like `max(coins) * k` if we were to calculate it)
# - While `low <= high`:
#   - `mid = (low + high) // 2`
#   - `count = count_multiples(mid, coins)`
#   - If `count >= k`, it means `mid` could be our answer or larger, so we try a smaller `mid`: `ans = mid`, `high = mid - 1`.
#   - If `count < k`, it means `mid` is too small, so we need a larger `mid`: `low = mid + 1`.
#
# The final `ans` will be the smallest `amount` for which `count_multiples(amount, coins) >= k`.
#
# Helper functions:
# - `gcd(a, b)`: standard Euclidean algorithm.
# - `lcm(a, b)`: `(a * b) // gcd(a, b)`. For multiple numbers, `lcm(nums) = reduce(lcm, nums)`.
#
# The number of coins is small (<= 15), so iterating through all 2^15 subsets is feasible.
#
# Time Complexity:
# - Binary search performs log(Upper Bound) iterations. Let U be the upper bound for the amount (e.g., 2 * 10^14).
# - Inside each binary search iteration, `count_multiples` is called.
# - `count_multiples` iterates through all 2^N subsets of `coins`, where N is `coins.length`.
# - For each subset, calculating LCM involves GCD operations. The GCD of two numbers takes logarithmic time with respect to the numbers. The LCM can grow up to U.
# - So, for each subset, LCM calculation might take O(N * log(U)) in the worst case (for multiple LCMs).
# - Total time for `count_multiples` is O(2^N * N * log(U)).
# - Overall Time Complexity: O(log(U) * 2^N * N * log(U)). Given N <= 15, 2^N is manageable.
#   With U approx 2e14, log(U) approx 50. N approx 15.
#   So, roughly log(2e14) * 2^15 * 15 * log(2e14) which is roughly 50 * 32768 * 15 * 50 which is around 1.2 * 10^9 operations. This might be too slow.
#
#   Let's re-evaluate the LCM part. `lcm(a, b)` is O(log(min(a, b))). When calculating `lcm` for a subset of size `m`, we perform `m-1` `lcm` operations. The intermediate LCM values can grow.
#   `lcm(a, b, c) = lcm(lcm(a, b), c)`. The `gcd` calculation dominates.
#   The maximum LCM we need to consider is bounded by the `amount` we are checking in binary search.
#   So, LCM calculation for a subset might be O(N * log(amount)).
#   Total for `count_multiples`: O(2^N * N * log(amount)).
#   Overall: O(log(U) * 2^N * N * log(U)).
#
#   However, if `lcm` of a subset exceeds `amount`, we prune. This helps.
#
#   Let's consider the LCM computation more carefully. For a subset `S` of `coins`, we compute `L = lcm(*S)`. This involves `|S|-1` calls to `lcm(a, b)`. Each `lcm(a, b)` involves `gcd(a, b)`. The numbers involved can be up to `max(coins)`.
#   A `gcd(a, b)` operation is O(log(min(a, b))). If `max(coins)` is `C_max`, then GCD is O(log C_max).
#   Calculating LCM for a subset of size `m` takes O(m * log C_max).
#   The `count_multiples` function complexity is O(2^N * N * log C_max).
#   Total Time Complexity: O(log(U) * 2^N * N * log C_max).
#   Given N <= 15, C_max <= 25, U <= 2e14.
#   log(U) approx 50. 2^15 approx 32768. N approx 15. log C_max approx 5.
#   Total: 50 * 32768 * 15 * 5 approx 1.2 * 10^9. This is indeed tight.
#   It's possible that the average case for LCM is much faster due to pruning or smaller numbers in `coins`. The `coins[i]` are small (<= 25).
#   The LCM of numbers up to 25 can grow, but perhaps not excessively quickly for small subsets.
#   Example: lcm(25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11) = 360360. This is very small.
#   The LCM of all numbers from 1 to 25 is actually quite large. `lcm(1..25)` is 26771144400. This is within the search range.
#   The key is that if `lcm` of a subset exceeds `mid`, we stop.
#
# Space Complexity:
# - O(N) for recursion stack if `gcd` or `lcm` are recursive, or for storing subsets. The standard `math.gcd` is iterative.
# - O(1) besides input storage.
#
class Solution:
    def kthSmallestAmount(self, coins: list[int], k: int) -> int:
        # Helper function to calculate the greatest common divisor (GCD) of two numbers.
        # This is a standard Euclidean algorithm implementation.
        def gcd(a, b):
            while b:
                a, b = b, a % b
            return a

        # Helper function to calculate the least common multiple (LCM) of two numbers.
        # LCM(a, b) = (a * b) / GCD(a, b).
        # We need to handle potential overflow if a * b is very large, but since we check
        # against 'amount' (which is capped by binary search), this is usually fine.
        # If LCM exceeds the current 'amount' in binary search, we can ignore it.
        def lcm(a, b):
            if a == 0 or b == 0:
                return 0
            # The result of (a * b) // gcd(a, b) can overflow if a and b are large.
            # A safer way is to compute it as (a // gcd(a, b)) * b.
            # However, we are interested if the LCM exceeds 'amount'.
            # So, we can check if 'amount // b < a // gcd(a, b)' to detect overflow before multiplication.
            # Or more simply, if current_lcm > amount / b * gcd(a,b), then it will overflow.
            # The limit `amount` is passed to `count_multiples`.
            common_divisor = gcd(a, b)
            # If a // common_divisor is already too large to multiply by b without exceeding `amount`
            # we can return a value larger than `amount` to signify it.
            # For simplicity, we can just return the direct calculation and let the caller handle
            # comparison with `amount`. The critical part is that intermediate LCMs for subsets
            # should not exceed `amount`.
            res = (a // common_divisor) * b
            return res

        # This function counts how many numbers less than or equal to 'amount' are multiples
        # of at least one of the denominations in 'coins'.
        # It uses the principle of inclusion-exclusion.
        def count_multiples(amount: int, coins: list[int]) -> int:
            n = len(coins)
            count = 0

            # Iterate through all possible non-empty subsets of coins.
            # A bitmask from 1 to (1 << n) - 1 represents each subset.
            # If the i-th bit is set, it means coins[i] is included in the subset.
            for i in range(1, 1 << n):
                current_lcm = 1
                subset_size = 0

                # Build the current subset and calculate its LCM.
                for j in range(n):
                    # Check if the j-th coin is in the current subset.
                    if (i >> j) & 1:
                        subset_size += 1
                        # Calculate LCM with the current coin.
                        # If the LCM would exceed 'amount', we can stop processing this subset
                        # because any further LCM calculations will also exceed 'amount'.
                        # This is a crucial optimization.
                        if current_lcm > amount // coins[j]: # Check for potential overflow before multiplication
                            current_lcm = amount + 1 # Set to a value larger than amount
                            break
                        current_lcm = lcm(current_lcm, coins[j])
                        # If LCM exceeds 'amount' at any point, break early.
                        if current_lcm > amount:
                            break

                # If the LCM did not exceed 'amount', proceed with inclusion-exclusion.
                if current_lcm <= amount:
                    # If the subset size is odd, add the count of its multiples.
                    # If the subset size is even, subtract the count of its multiples.
                    if subset_size % 2 == 1:
                        count += amount // current_lcm
                    else:
                        count -= amount // current_lcm
            return count

        # Binary search for the kth smallest amount.
        # The search space is from 1 up to a sufficiently large number.
        # A safe upper bound: max(coins) * k.
        # Given max(coins) = 25 and k = 2 * 10^9, this is 5 * 10^10.
        # Let's use 2 * 10^14 as a more generous upper bound to be safe,
        # considering LCMs can grow, though for coins <= 25, they don't grow excessively fast.
        low = 1
        high = 2 * (10**14) # A sufficiently large upper bound.
        ans = high # Initialize ans to a large value.

        while low <= high:
            mid = (low + high) // 2
            # Get the count of numbers <= mid that can be formed.
            num_possible_amounts = count_multiples(mid, coins)

            # If the count is greater than or equal to k, it means 'mid' is a potential answer
            # or the answer is smaller. So, we record 'mid' and try searching in the lower half.
            if num_possible_amounts >= k:
                ans = mid
                high = mid - 1
            # If the count is less than k, it means 'mid' is too small, and we need to
            # search in the upper half for a larger amount.
            else:
                low = mid + 1

        return ans

```