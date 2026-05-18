```python
# Problem: Jump Game IV
# Summary: Find the minimum steps to reach the last index from the first index
#          by jumping to adjacent indices or indices with the same value.
# Link: https://leetcode.com/problems/jump-game-iv/
#
# Approach:
# This problem can be solved using Breadth-First Search (BFS).
# We start at index 0 and explore reachable indices level by level.
# The first time we reach the last index, we know the minimum number of steps.
#
# To efficiently find all indices with the same value, we'll use a hash map (dictionary in Python)
# where keys are the array values and values are lists of indices where that value appears.
#
# We'll maintain a queue for BFS and a set to keep track of visited indices to avoid cycles and redundant processing.
#
# The BFS proceeds as follows:
# 1. Initialize a queue with the starting index (0) and its steps (0).
# 2. Initialize a set `visited` with the starting index.
# 3. Create a dictionary `graph` to store indices for each value. Iterate through the array
#    and populate `graph`. For each value, if it's not in the graph, add it with an empty list.
#    Then append the current index to the list associated with its value.
# 4. While the queue is not empty:
#    a. Dequeue the current index `curr_idx` and its `steps`.
#    b. If `curr_idx` is the last index (`n-1`), return `steps`.
#    c. Explore neighbors:
#       i. `curr_idx + 1`: If `curr_idx + 1` is within bounds and not visited,
#          add it to the queue with `steps + 1` and mark it as visited.
#       ii. `curr_idx - 1`: If `curr_idx - 1` is within bounds and not visited,
#           add it to the queue with `steps + 1` and mark it as visited.
#       iii. Indices with the same value: Get the list of indices `same_val_indices` from `graph[arr[curr_idx]]`.
#            For each `next_idx` in `same_val_indices`:
#            If `next_idx` is not visited, add it to the queue with `steps + 1` and mark it as visited.
#            After processing all indices with the same value for `arr[curr_idx]`, we can clear the list
#            `graph[arr[curr_idx]]`. This is a crucial optimization. Once we've visited all indices
#            with a specific value from *any* of its occurrences, we don't need to re-check these
#            same-value jumps from other occurrences of that value. This prunes redundant exploration.
#
# Time Complexity: O(N), where N is the length of the array.
#   - Building the graph takes O(N).
#   - BFS: In the worst case, each index is enqueued and dequeued at most once.
#     For each index, we consider at most 3 types of jumps: i+1, i-1, and same values.
#     The optimization of clearing `graph[arr[i]]` after processing ensures that
#     each unique value's indices are effectively processed only once across all its occurrences.
#     Therefore, the total time spent exploring same-value jumps is bounded.
#
# Space Complexity: O(N)
#   - The `graph` dictionary can store up to N indices in the worst case (all elements are unique).
#   - The `queue` and `visited` set can store up to N elements in the worst case.
#
import collections

class Solution:
    def minJumps(self, arr: list[int]) -> int:
        n = len(arr)
        if n <= 1:
            return 0  # If the array has 0 or 1 element, we are already at the end.

        # Step 3: Create a graph (dictionary) to store indices for each value.
        # Key: value in arr, Value: list of indices where this value appears.
        graph = collections.defaultdict(list)
        for i, val in enumerate(arr):
            graph[val].append(i)

        # Step 1: Initialize a queue for BFS.
        # Each element is a tuple: (current_index, steps_taken).
        queue = collections.deque([(0, 0)])

        # Step 2: Initialize a set to keep track of visited indices.
        visited = {0}

        # Step 4: Perform BFS.
        while queue:
            curr_idx, steps = queue.popleft()

            # Check if we have reached the last index.
            if curr_idx == n - 1:
                return steps

            # Explore neighbors:
            # i. Jump to the next index (curr_idx + 1).
            next_idx_forward = curr_idx + 1
            if next_idx_forward < n and next_idx_forward not in visited:
                visited.add(next_idx_forward)
                queue.append((next_idx_forward, steps + 1))

            # ii. Jump to the previous index (curr_idx - 1).
            next_idx_backward = curr_idx - 1
            if next_idx_backward >= 0 and next_idx_backward not in visited:
                visited.add(next_idx_backward)
                queue.append((next_idx_backward, steps + 1))

            # iii. Jump to indices with the same value.
            # Get all indices that have the same value as the current index.
            same_val_indices = graph.get(arr[curr_idx], [])
            for next_idx_same_val in same_val_indices:
                if next_idx_same_val not in visited:
                    visited.add(next_idx_same_val)
                    queue.append((next_idx_same_val, steps + 1))

            # Optimization: Clear the list of indices for the current value in the graph.
            # Once we have explored all possible jumps from all occurrences of a certain value
            # from *any* of those occurrences, we don't need to revisit them from other occurrences
            # of the same value. This is because we are looking for the minimum number of steps,
            # and any path through these same-value jumps would have already been considered
            # when we first encountered that value at an earlier step in the BFS.
            if arr[curr_idx] in graph:
                del graph[arr[curr_idx]]

        # This part should ideally not be reached if a path exists, as per problem constraints usually.
        # However, for completeness, it would mean no path was found.
        return -1 # Should not happen if a solution exists
```