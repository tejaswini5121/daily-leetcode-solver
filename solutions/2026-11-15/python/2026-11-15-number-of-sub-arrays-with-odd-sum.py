```python
# Finds the number of subarrays with an odd sum.
# Link: https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/
#
# Approach:
# We can use prefix sums to efficiently calculate subarray sums.
# Let prefix_sum[i] be the sum of elements from arr[0] to arr[i-1].
# The sum of a subarray from index i to j (inclusive) is prefix_sum[j+1] - prefix_sum[i].
#
# We are interested in subarrays with an odd sum.
# A subarray sum (prefix_sum[j+1] - prefix_sum[i]) is odd if:
# 1. prefix_sum[j+1] is odd and prefix_sum[i] is even.
# 2. prefix_sum[j+1] is even and prefix_sum[i] is odd.
#
# This means the parity of prefix_sum[j+1] and prefix_sum[i] must be different.
#
# We can iterate through the array and maintain a running prefix sum.
# At each index `i`, we consider the current prefix sum `current_sum`.
# We need to count how many previous prefix sums `prev_sum` (including an initial prefix sum of 0)
# satisfy the condition: `(current_sum - prev_sum) % 2 != 0`.
#
# This is equivalent to counting pairs where `current_sum` and `prev_sum` have different parities.
#
# We can maintain counts of prefix sums that are even and odd.
# Let `even_count` be the number of prefix sums encountered so far that are even.
# Let `odd_count` be the number of prefix sums encountered so far that are odd.
#
# Initialize `even_count = 1` (for the initial prefix sum of 0, which is even) and `odd_count = 0`.
# Initialize `current_sum = 0`.
# Initialize `result = 0`.
#
# Iterate through the array `arr`:
#   Update `current_sum = (current_sum + num) % 2`. (We only care about parity, so we can work with modulo 2)
#   If `current_sum` is odd:
#     The number of subarrays ending at the current position with an odd sum is equal to the number of previous even prefix sums (`even_count`).
#     So, `result = (result + even_count) % MOD`.
#     Increment `odd_count`.
#   If `current_sum` is even:
#     The number of subarrays ending at the current position with an odd sum is equal to the number of previous odd prefix sums (`odd_count`).
#     So, `result = (result + odd_count) % MOD`.
#     Increment `even_count`.
#
# Return `result`.
#
# Time Complexity: O(n), where n is the length of the array. We iterate through the array once.
# Space Complexity: O(1). We only use a few variables to store counts and the current sum.

class Solution:
    def numOfSubarrays(self, arr: list[int]) -> int:
        MOD = 10**9 + 7

        # Initialize counts for even and odd prefix sums encountered so far.
        # We start with an implicit prefix sum of 0 before processing any elements, which is even.
        even_count = 1
        odd_count = 0

        # Initialize the running sum and the total count of subarrays with odd sums.
        current_sum_parity = 0  # 0 for even, 1 for odd
        result = 0

        # Iterate through each number in the array.
        for num in arr:
            # Update the parity of the current prefix sum.
            # Adding an odd number flips the parity, adding an even number keeps it the same.
            current_sum_parity = (current_sum_parity + num) % 2

            # If the current prefix sum is odd:
            # A subarray sum (current_sum - prev_sum) is odd if:
            # 1. current_sum is odd and prev_sum is even.
            # The number of such subarrays ending at the current position is `even_count`.
            if current_sum_parity == 1:
                result = (result + even_count) % MOD
                # Increment the count of odd prefix sums encountered.
                odd_count += 1
            # If the current prefix sum is even:
            # A subarray sum (current_sum - prev_sum) is odd if:
            # 1. current_sum is even and prev_sum is odd.
            # The number of such subarrays ending at the current position is `odd_count`.
            else:  # current_sum_parity == 0
                result = (result + odd_count) % MOD
                # Increment the count of even prefix sums encountered.
                even_count += 1

        return result

```