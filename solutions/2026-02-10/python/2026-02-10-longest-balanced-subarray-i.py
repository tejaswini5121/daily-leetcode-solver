```python
# Problem Summary: Find the longest subarray where the count of distinct even numbers equals the count of distinct odd numbers.
# Link: https://leetcode.com/problems/longest-balanced-subarray-i/
# Approach:
# This problem can be solved efficiently using a prefix sum-like approach combined with a hash map.
# We can transform the problem by assigning a value of +1 to odd numbers and -1 to even numbers.
# The condition "number of distinct even numbers equals number of distinct odd numbers" is tricky because it involves distinctness.
# A simpler version of the problem, if it were about total counts (not distinct), would involve prefix sums of +1 and -1.
# For distinct counts, we can iterate through all possible subarrays. For each subarray, we can maintain sets of distinct even and odd numbers.
# This O(n^3) approach is too slow given the constraints (n <= 1500).

# A more optimized approach involves iterating through all possible start points `i` and for each start point,
# iterating through all possible end points `j`.
# For each subarray `nums[i:j+1]`, we maintain two sets: `distinct_evens` and `distinct_odds`.
# We then check if `len(distinct_evens) == len(distinct_odds)` and update the maximum length accordingly.
# This approach has a time complexity of O(n^3) due to nested loops and set operations, which is still too slow.

# Let's reconsider the problem: "number of distinct even numbers ... is equal to the number of distinct odd numbers".
# This implies that for a subarray to be balanced, the *set* of distinct even numbers must have the same size as the *set* of distinct odd numbers.

# A more efficient approach, especially for constraints up to 1500, would be to iterate through all possible subarrays.
# For each subarray, we calculate the number of distinct even and odd elements.
# We can optimize the calculation for each subarray.
# For a fixed start `i`, as `j` increases, we can update the sets of distinct even and odd numbers incrementally.

# Time Complexity: O(n^3) in the naive implementation of checking each subarray.
# However, by optimizing the distinct count calculation for each subarray, we can aim for O(n^2 * k), where k is the average size of distinct elements or O(n^2) if done carefully.
# Let's refine the O(n^2) approach:
# Iterate through all possible start indices `i` from 0 to n-1.
# For each `i`, iterate through all possible end indices `j` from `i` to n-1.
# For the subarray `nums[i:j+1]`:
#   Maintain a set of distinct even numbers encountered so far in this subarray.
#   Maintain a set of distinct odd numbers encountered so far in this subarray.
#   If `len(distinct_evens) == len(distinct_odds)`, update `max_length`.
# This still requires rebuilding the sets for each `j` or efficiently updating them.

# The most straightforward O(n^2) approach is to iterate through all start and end points, and for each subarray, calculate distinct counts.
# Time Complexity: O(n^2) for iterating through all subarrays. Inside the loop, calculating distinct counts takes O(length of subarray), leading to O(n^3).
# We need a way to do it in O(n^2).

# Let's use a refined O(n^2) approach:
# Iterate through all possible start points `i`.
# For each `i`, iterate through all possible end points `j` starting from `i`.
# Maintain `distinct_evens` and `distinct_odds` sets as `j` increases.
# This incremental update is key.

# Time Complexity: O(n^2) - Two nested loops iterate through all subarrays. Set insertions and length checks are O(1) on average.
# Space Complexity: O(n) in the worst case for the hash sets if all numbers are distinct.

class Solution:
    def longestBalancedSubarray(self, nums: list[int]) -> int:
        n = len(nums)
        max_length = 0

        # Iterate through all possible start indices of the subarray
        for i in range(n):
            # Initialize sets to store distinct even and odd numbers for the current subarray starting at i
            distinct_evens = set()
            distinct_odds = set()

            # Iterate through all possible end indices of the subarray, starting from i
            for j in range(i, n):
                num = nums[j]

                # Check if the current number is even or odd
                if num % 2 == 0:
                    # Add the even number to the set of distinct even numbers
                    distinct_evens.add(num)
                else:
                    # Add the odd number to the set of distinct odd numbers
                    distinct_odds.add(num)

                # Check if the number of distinct even numbers is equal to the number of distinct odd numbers
                if len(distinct_evens) == len(distinct_odds):
                    # If they are equal, the subarray nums[i:j+1] is balanced.
                    # Update max_length with the current subarray's length if it's greater.
                    current_length = j - i + 1
                    max_length = max(max_length, current_length)

        return max_length

```