```python
# Summary: Find the level in a binary tree with the maximum sum of node values.
# Link: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/
# Approach:
# We can use Breadth-First Search (BFS) to traverse the tree level by level.
# During the BFS, we maintain the sum of node values for the current level.
# We also keep track of the maximum sum encountered so far and the corresponding level.
# If the current level's sum is greater than the maximum sum, we update the maximum sum
# and the result level. If the current level's sum is equal to the maximum sum, we
# prefer the smaller level as per the problem statement.
#
# Time Complexity: O(N), where N is the number of nodes in the binary tree.
# We visit each node exactly once during the BFS traversal.
#
# Space Complexity: O(W), where W is the maximum width of the binary tree.
# In the worst case (a complete binary tree), the width can be N/2, so it's O(N).
# This is due to the queue used in BFS.

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

import collections

class Solution:
    def maxLevelSum(self, root: TreeNode) -> int:
        # Initialize variables
        max_sum = float('-inf')  # Stores the maximum sum found so far.
        result_level = 0        # Stores the level corresponding to the maximum sum.
        current_level = 1       # Tracks the current level being processed.

        # Use a deque for efficient BFS (queue operations)
        queue = collections.deque([root])

        # Perform BFS level by level
        while queue:
            level_sum = 0  # Sum of node values for the current level.
            level_size = len(queue) # Number of nodes at the current level.

            # Process all nodes at the current level
            for _ in range(level_size):
                node = queue.popleft() # Dequeue a node from the front.
                level_sum += node.val  # Add its value to the level sum.

                # Enqueue left child if it exists
                if node.left:
                    queue.append(node.left)
                # Enqueue right child if it exists
                if node.right:
                    queue.append(node.right)

            # After processing all nodes at the current level, compare its sum
            # with the maximum sum found so far.
            if level_sum > max_sum:
                max_sum = level_sum    # Update maximum sum.
                result_level = current_level # Update the level with the maximum sum.

            current_level += 1 # Move to the next level.

        # Return the smallest level with the maximum sum.
        return result_level

```