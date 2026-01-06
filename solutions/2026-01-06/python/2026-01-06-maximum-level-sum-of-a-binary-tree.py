import collections
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        # Problem summary: Given the root of a binary tree, find the level (starting from 1)
        # that has the maximum sum of node values. If multiple levels have the same maximum sum,
        # return the smallest level number.
        # Link: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/

        # Approach explanation:
        # We will use a Breadth-First Search (BFS) approach. BFS naturally traverses the tree
        # level by level, making it suitable for problems that require level-specific operations.
        # We maintain a queue (using collections.deque for efficient appends and poplefts)
        # to store nodes for the current level.
        # For each level, we calculate the sum of its node values. We then compare this
        # sum with the maximum sum found so far. If the current level's sum is strictly greater,
        # we update our maximum sum and the corresponding level. Since we iterate
        # through levels in increasing order (1, 2, 3, ...), the first level encountered
        # with a maximal sum will automatically be the smallest level number in case of ties.

        # Time complexity:
        # O(N), where N is the number of nodes in the tree.
        # Each node in the tree is visited and processed exactly once (enqueued and dequeued).
        # For each node, constant time operations are performed (summing its value,
        # checking for and adding its children to the queue).

        # Space complexity:
        # O(W), where W is the maximum width of the tree.
        # In the worst case (e.g., a complete binary tree), the queue might store
        # approximately N/2 nodes at its widest level. Thus, the space complexity
        # can be O(N) in the worst case.

        if not root:
            # According to problem constraints, the number of nodes is in the range [1, 10^4],
            # meaning the root will never be null. This check is primarily for robustness
            # or if constraints were different.
            return 0 

        # Initialize a deque (double-ended queue) for BFS.
        # We start by adding the root node to the queue.
        queue = collections.deque([root])

        # Initialize variables to keep track of the maximum sum found and its corresponding level.
        # max_sum is initialized to negative infinity to ensure any valid sum (even negative sums
        # as node values can be negative) will be correctly identified as greater than it.
        max_sum = float('-inf')
        # max_level stores the level number (1-indexed) that achieved the max_sum.
        max_level = 0 
        # current_level tracks the level we are currently processing, starting from 1 for the root.
        current_level = 1

        # Perform BFS traversal while there are nodes in the queue.
        while queue:
            # Get the number of nodes at the current level.
            # This is crucial for processing exactly all nodes belonging to the current level
            # before moving on to the next level.
            level_size = len(queue)
            # Initialize sum for the nodes at the current level.
            current_level_sum = 0

            # Iterate through all nodes currently in the queue, which represent the current_level.
            for _ in range(level_size):
                # Dequeue a node from the front of the queue.
                node = queue.popleft()
                # Add its value to the current level's sum.
                current_level_sum += node.val

                # If the node has a left child, add it to the queue for processing in the next level.
                if node.left:
                    queue.append(node.left)
                # If the node has a right child, add it to the queue for processing in the next level.
                if node.right:
                    queue.append(node.right)

            # After processing all nodes for the current_level, compare its sum.
            # We use '>' (strictly greater than) to update only when a new maximum sum is found.
            # This implicitly handles the requirement to return the *smallest* level x
            # in case of ties, because we process levels in ascending order (1, 2, 3...).
            # The first time we encounter a maximum sum, its level will be the smallest
            # possible level for that sum.
            if current_level_sum > max_sum:
                # Update max_sum with the new maximum sum found.
                max_sum = current_level_sum
                # Update max_level to the current level number.
                max_level = current_level

            # Increment to move to the next level in the tree.
            current_level += 1

        # After the BFS completes, max_level will hold the smallest level number
        # that had the maximum sum.
        return max_level