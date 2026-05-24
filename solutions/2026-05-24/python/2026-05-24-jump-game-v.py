```python
# Problem: Jump Game V
# Link: https://leetcode.com/problems/jump-game-v/
#
# Approach:
# This problem can be solved using dynamic programming with memoization or depth-first search (DFS).
# The state for our DP/DFS will be the current index. The value associated with each state will be the maximum number of jumps
# possible starting from that index.
#
# For each index `i`, we need to explore all possible valid jumps within the distance `d`.
# A jump from `i` to `j` is valid if:
# 1. `abs(i - j) <= d`
# 2. `arr[i] > arr[j]`
# 3. For all `k` between `i` and `j` (exclusive), `arr[i] > arr[k]`. This condition implies that all intermediate elements must be smaller than `arr[i]`.
#
# The third condition is the tricky one. If we iterate through all possible `j` and then check all intermediate `k`, the complexity might be too high.
# A more efficient way to handle this is to realize that when we jump from `i` to `j` (either `j = i + x` or `j = i - x` where `0 < x <= d`), all elements between `i` and `j` must be strictly smaller than `arr[i]`. This means we only need to check the elements in the direct path until we encounter an element greater than or equal to `arr[i]`.
#
# We can use DFS with memoization. `memo[i]` will store the maximum number of steps possible starting from index `i`.
# If `memo[i]` is already computed, we return it.
# Otherwise, we initialize the count for the current index `i` to 1 (representing visiting itself).
# Then, we explore possible jumps to the right: for `x` from 1 to `d`, if `i + x` is within bounds and `arr[i] > arr[i + x]`, we recursively call DFS for `i + x` and update our current count with `1 + dfs(i + x)`. The crucial part here is that we stop exploring to the right if we encounter an element `arr[i+x]` that is not strictly less than `arr[i]`.
# Similarly, we explore possible jumps to the left: for `x` from 1 to `d`, if `i - x` is within bounds and `arr[i] > arr[i - x]`, we recursively call DFS for `i - x` and update our current count with `1 + dfs(i - x)`. We stop exploring to the left if we encounter an element `arr[i-x]` that is not strictly less than `arr[i]`.
# Finally, we store the computed maximum steps in `memo[i]` and return it.
# The overall maximum will be the maximum value in the `memo` array after computing DFS for all starting indices.
#
# Time Complexity: O(n*d) where n is the length of arr. Each index `i` is visited at most once by the DFS. For each index, we iterate up to `d` steps to the left and `d` steps to the right. Since the condition `arr[i] > arr[k]` for intermediate `k` acts as a pruning mechanism, we effectively only explore valid paths without recomputing. In the worst case, we might perform O(d) work for each of the O(n) states.
# Space Complexity: O(n) for the memoization array and O(n) for the recursion call stack in the worst case (a linear path).
class Solution:
    def maxJumps(self, arr: list[int], d: int) -> int:
        n = len(arr)
        # memoization table to store the maximum number of jumps starting from each index
        memo = [-1] * n

        def dfs(i):
            # If the result for index i is already computed, return it
            if memo[i] != -1:
                return memo[i]

            # Initialize the maximum jumps starting from index i to 1 (visiting itself)
            max_jumps_from_i = 1

            # Explore jumps to the right
            # Iterate from 1 up to d steps to the right
            for j in range(1, d + 1):
                next_idx = i + j
                # Check if the next index is within array bounds
                if next_idx < n:
                    # Condition 2: arr[i] > arr[next_idx]
                    # Condition 3 is implicitly handled by the loop and the check below:
                    # if arr[i] <= arr[next_idx], we stop exploring further in this direction
                    if arr[i] > arr[next_idx]:
                        # Recursively call dfs for the next index and update max_jumps_from_i
                        # We add 1 because we made one jump from i to next_idx
                        max_jumps_from_i = max(max_jumps_from_i, 1 + dfs(next_idx))
                    else:
                        # If arr[i] <= arr[next_idx], we cannot jump past this point in this direction
                        # because intermediate elements must be strictly smaller than arr[i]
                        break
                else:
                    # If next_idx is out of bounds, stop exploring in this direction
                    break

            # Explore jumps to the left
            # Iterate from 1 up to d steps to the left
            for j in range(1, d + 1):
                prev_idx = i - j
                # Check if the previous index is within array bounds
                if prev_idx >= 0:
                    # Condition 2: arr[i] > arr[prev_idx]
                    # Condition 3 is implicitly handled by the loop and the check below:
                    # if arr[i] <= arr[prev_idx], we stop exploring further in this direction
                    if arr[i] > arr[prev_idx]:
                        # Recursively call dfs for the previous index and update max_jumps_from_i
                        # We add 1 because we made one jump from i to prev_idx
                        max_jumps_from_i = max(max_jumps_from_i, 1 + dfs(prev_idx))
                    else:
                        # If arr[i] <= arr[prev_idx], we cannot jump past this point in this direction
                        # because intermediate elements must be strictly smaller than arr[i]
                        break
                else:
                    # If prev_idx is out of bounds, stop exploring in this direction
                    break

            # Store the computed maximum jumps for index i in the memo table
            memo[i] = max_jumps_from_i
            return max_jumps_from_i

        # Initialize the overall maximum jumps found
        overall_max_jumps = 0
        # Iterate through each index and start a DFS from it
        for i in range(n):
            overall_max_jumps = max(overall_max_jumps, dfs(i))

        # Return the maximum number of indices visited across all possible starting points
        return overall_max_jumps
```