```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

# Problem Summary:
# Check if a binary tree is height-balanced. A height-balanced tree
# is defined as a binary tree in which the depth of the two subtrees
# of every node never differs by more than 1.
# Link: https://leetcode.com/problems/balanced-binary-tree/
#
# Approach:
# We can use a recursive Depth-First Search (DFS) approach. For each node,
# we need to calculate the height of its left and right subtrees.
# If at any point the difference in heights of the left and right subtrees
# of a node is greater than 1, the tree is not balanced.
#
# We can define a helper function, say `height_and_balance`, that returns
# a tuple: (height, is_balanced).
# - The `height` will be the height of the subtree rooted at the current node.
# - The `is_balanced` will be a boolean indicating if the subtree is balanced.
#
# The base case for the recursion is when a node is None. In this case,
# the height is 0 and it's considered balanced.
#
# For a non-null node, we recursively call `height_and_balance` on its left
# and right children.
#
# Let (left_height, left_balanced) be the result for the left child,
# and (right_height, right_balanced) be the result for the right child.
#
# The current node is balanced if:
# 1. Both left and right subtrees are balanced (left_balanced and right_balanced are True).
# 2. The absolute difference between left_height and right_height is less than or equal to 1.
#
# The height of the current node will be 1 + max(left_height, right_height).
#
# If at any point `is_balanced` becomes False during the recursion, we can propagate
# this False up the call stack to signify that the entire tree is not balanced.
# A common optimization is to return -1 for height if the subtree is found to be unbalanced,
# which can serve as a clear indicator.
#
# Time Complexity:
# O(N), where N is the number of nodes in the tree. Each node is visited exactly once
# by the DFS traversal. For each node, we perform constant time operations (comparisons,
# additions, max).
#
# Space Complexity:
# O(H), where H is the height of the tree. This is due to the recursion stack.
# In the worst case (a skewed tree), H can be O(N). In the best case (a balanced tree),
# H is O(log N).

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        # Helper function to calculate height and check balance simultaneously.
        # Returns -1 if the subtree is unbalanced, otherwise returns its height.
        def check_balance_and_height(node: Optional[TreeNode]) -> int:
            # Base case: An empty tree is balanced and has a height of 0.
            if not node:
                return 0

            # Recursively get the height and balance status of the left subtree.
            left_height = check_balance_and_height(node.left)
            # If the left subtree is already unbalanced, propagate -1 up.
            if left_height == -1:
                return -1

            # Recursively get the height and balance status of the right subtree.
            right_height = check_balance_and_height(node.right)
            # If the right subtree is already unbalanced, propagate -1 up.
            if right_height == -1:
                return -1

            # Check if the current node is balanced.
            # The difference in heights of left and right subtrees should not exceed 1.
            if abs(left_height - right_height) > 1:
                return -1  # Indicate that this subtree is unbalanced.

            # If balanced, return the height of the current node's subtree.
            # Height is 1 (for the current node) plus the maximum height of its children.
            return 1 + max(left_height, right_height)

        # Call the helper function starting from the root.
        # If the result is -1, the tree is unbalanced. Otherwise, it's balanced.
        return check_balance_and_height(root) != -1

```