```python
# Problem: Minimum Absolute Distance Between Mirror Pairs
# Summary: Find the smallest index difference between elements where one is the reverse of the other.
# Link: https://leetcode.com/problems/minimum-absolute-distance-between-mirror-pairs/
#
# Approach:
# We can iterate through the array and for each number, calculate its reverse.
# We can store the indices of each number encountered in a hash map (dictionary in Python).
# For each number `nums[i]`, we calculate its reverse `reversed_num`.
# If `reversed_num` is already in our hash map, it means we have found a potential mirror pair.
# We then iterate through all the indices `j` where `nums[j]` equals `reversed_num` (and `j < i`).
# The absolute distance is `i - j`. We keep track of the minimum such distance found so far.
# To efficiently store and retrieve indices for each number, we can use a dictionary where keys are the numbers and values are lists of their indices.
#
# Time Complexity: O(N * log(max(nums[i]))), where N is the length of nums.
#   - We iterate through the array once (N elements).
#   - For each element, we reverse its digits. The number of digits is proportional to log(value).
#   - In the worst case, a number might have many occurrences, leading to iterating through its indices in the dictionary. However, the total number of index lookups across all numbers and their reversed counterparts will not exceed N in total for each unique value encountered. The dominant factor is the reversal of digits.
# Space Complexity: O(N)
#   - In the worst case, all numbers are unique, and we store all their indices in the hash map.
#   - The size of the hash map can be up to N.

class Solution:
    def minimumAbsDifference(self, nums: list[int]) -> int:
        """
        Calculates the minimum absolute distance between indices of mirror pairs.

        Args:
            nums: A list of integers.

        Returns:
            The minimum absolute distance between mirror pair indices, or -1 if no mirror pair exists.
        """

        def reverse_int(n: int) -> int:
            """Reverses the digits of an integer."""
            reversed_n = 0
            while n > 0:
                digit = n % 10
                reversed_n = reversed_n * 10 + digit
                n //= 10
            return reversed_n

        # Dictionary to store numbers and the list of their indices encountered so far.
        # Format: {number: [index1, index2, ...]}
        num_indices = {}
        
        # Initialize minimum absolute distance to infinity.
        min_abs_dist = float('inf')
        
        # Iterate through the input array.
        for i, num in enumerate(nums):
            # Calculate the reverse of the current number.
            reversed_num = reverse_int(num)
            
            # Check if the reversed number has been seen before.
            if reversed_num in num_indices:
                # If the reversed number is present, it means we have a potential mirror pair.
                # Iterate through all indices where the reversed number appeared previously.
                for prev_index in num_indices[reversed_num]:
                    # Calculate the absolute distance between the current index and the previous index.
                    # We only consider pairs where prev_index < i because the problem states 0 <= i < j.
                    # Since we are iterating from left to right (i increasing), prev_index will always be less than i.
                    current_dist = i - prev_index
                    # Update the minimum absolute distance if the current distance is smaller.
                    min_abs_dist = min(min_abs_dist, current_dist)
            
            # Add the current number and its index to the dictionary.
            # If the number is already a key, append the current index to its list of indices.
            if num not in num_indices:
                num_indices[num] = []
            num_indices[num].append(i)
            
        # If min_abs_dist is still infinity, it means no mirror pair was found.
        # Otherwise, return the minimum absolute distance found.
        return min_abs_dist if min_abs_dist != float('inf') else -1

```