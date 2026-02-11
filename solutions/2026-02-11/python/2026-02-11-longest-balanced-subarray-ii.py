```python
# Problem: Longest Balanced Subarray II
# Link: https://leetcode.com/problems/longest-balanced-subarray/
#
# Approach:
# This problem asks for the longest subarray where the count of distinct even numbers
# equals the count of distinct odd numbers.
#
# We can rephrase the condition: if we assign +1 for a distinct even number and -1
# for a distinct odd number, we are looking for a subarray where the sum of these
# assignments is 0.
#
# To handle "distinct" counts efficiently, we can use prefix sums.
# For each distinct number encountered, we maintain its first occurrence index.
# When we encounter a number again, we don't add its value to the sum, as it's not
# a new distinct number.
#
# Let's define a "value" for each number:
# - If a number `x` is even and it's the first time we see it, its contribution is +1.
# - If a number `x` is odd and it's the first time we see it, its contribution is -1.
#
# We will use a dictionary `first_occurrence` to store the index of the first time
# each number appears.
# We will use a dictionary `distinct_even_count_map` and `distinct_odd_count_map`
# to track the running count of distinct even and odd numbers encountered so far,
# conceptually. However, the core idea is to map a state (prefix sum) to an index.
#
# A better way to think about the prefix sum is:
# Let `balance` be the count of distinct even numbers minus the count of distinct odd numbers.
# We are looking for a subarray `nums[i...j]` such that:
# (distinct evens in `nums[i...j]`) - (distinct odds in `nums[i...j]`) = 0
#
# This means:
# (distinct evens up to `j` - distinct evens up to `i-1`) - (distinct odds up to `j` - distinct odds up to `i-1`) = 0
#
# Let `prefix_balance[k]` be (distinct evens in `nums[0...k]`) - (distinct odds in `nums[0...k]`).
# The condition becomes:
# `prefix_balance[j] - prefix_balance[i-1] = 0`
# Which means `prefix_balance[j] = prefix_balance[i-1]`.
#
# We can iterate through the array, maintaining the current `balance` and the `first_occurrence`
# of each number. For each number `nums[k]`:
# 1. If `nums[k]` is even:
#    - If it's the first time seeing `nums[k]`, increment `balance`.
# 2. If `nums[k]` is odd:
#    - If it's the first time seeing `nums[k]`, decrement `balance`.
#
# We use a hash map `balance_to_index` to store the first index at which a certain `balance` value was encountered.
# Initialize `balance_to_index = {0: -1}` because a balance of 0 occurs before processing any element (at index -1).
#
# For each index `k` from 0 to `n-1`:
# - Update `balance` based on `nums[k]` and whether it's a new distinct number.
# - If the current `balance` is already in `balance_to_index`:
#   - This means we've found a subarray from `balance_to_index[balance] + 1` to `k` that has a net balance of 0.
#   - The length of this subarray is `k - balance_to_index[balance]`.
#   - Update `max_len = max(max_len, k - balance_to_index[balance])`.
# - If the current `balance` is NOT in `balance_to_index`:
#   - Store the current index `k` for this `balance`: `balance_to_index[balance] = k`.
#
# Time Complexity: O(N), where N is the length of nums. We iterate through the array once. Dictionary operations (insertion, lookup) take O(1) on average.
# Space Complexity: O(U), where U is the number of unique elements in nums. In the worst case, all elements are unique, and the hash maps store up to N entries. Since nums[i] <= 10^5, the number of unique elements is bounded by min(N, 10^5).
# In this problem, the values of nums[i] are up to 10^5. The number of distinct values can be at most 10^5. So, space complexity is O(min(N, 10^5)).

class Solution:
    def longestBalancedSubarray(self, nums: list[int]) -> int:
        # Dictionary to store the first occurrence index of each number.
        # This helps us identify when a number is encountered for the first time.
        first_occurrence = {}
        
        # Dictionary to store the first index at which a particular balance was achieved.
        # The key is the balance value (distinct_even_count - distinct_odd_count).
        # The value is the index where this balance was first seen.
        # We initialize with {0: -1} because a balance of 0 occurs conceptually before
        # processing any elements (at index -1). This handles cases where the longest
        # balanced subarray starts from index 0.
        balance_to_index = {0: -1}
        
        # Variable to keep track of the current balance:
        # (number of distinct even numbers encountered so far) - (number of distinct odd numbers encountered so far).
        current_balance = 0
        
        # Variable to store the maximum length of a balanced subarray found so far.
        max_len = 0
        
        # Iterate through the array with index `i` and value `num`.
        for i, num in enumerate(nums):
            # Check if the current number `num` has been seen before.
            if num not in first_occurrence:
                # If `num` is encountered for the first time:
                # Update its first occurrence index to the current index `i`.
                first_occurrence[num] = i
                
                # Update the `current_balance` based on whether `num` is even or odd.
                if num % 2 == 0:
                    # If `num` is even, increment the balance.
                    current_balance += 1
                else:
                    # If `num` is odd, decrement the balance.
                    current_balance -= 1
            
            # Now, check if the `current_balance` has been seen before.
            if current_balance in balance_to_index:
                # If `current_balance` has been seen before at index `prev_index`:
                # This means the subarray from `prev_index + 1` to `i` has a net balance of 0.
                # (distinct_evens[i] - distinct_odds[i]) - (distinct_evens[prev_index] - distinct_odds[prev_index]) = 0
                # which simplifies to:
                # distinct_evens[prev_index+1...i] - distinct_odds[prev_index+1...i] = 0
                
                # Calculate the length of this balanced subarray.
                subarray_length = i - balance_to_index[current_balance]
                
                # Update `max_len` if this subarray is longer than the current maximum.
                max_len = max(max_len, subarray_length)
            else:
                # If `current_balance` is encountered for the first time:
                # Store the current index `i` as the first occurrence of this balance.
                balance_to_index[current_balance] = i
                
        # Return the maximum length of a balanced subarray found.
        return max_len

```