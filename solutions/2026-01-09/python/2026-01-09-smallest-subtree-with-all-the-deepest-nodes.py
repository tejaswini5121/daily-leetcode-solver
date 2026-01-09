```python
# Problem Summary: Find the smallest subtree containing all nodes at the maximum depth.
# Link: https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/
# Approach:
# We can solve this problem using a recursive Depth-First Search (DFS) approach.
# For each node, we'll calculate the depth of its left and right subtrees.
# If the depths of the left and right subtrees are equal, it means this current node
# is the root of the smallest subtree that contains all deepest nodes from both sides.
# If the left subtree is deeper, the answer must lie in the left subtree.
# If the right subtree is deeper, the answer must lie in the right subtree.
# The base case for the recursion is a null node, which returns a depth of 0 and None.
# The function returns a tuple: (depth of subtree, root of smallest subtree).
# Time Complexity: O(N), where N is the number of nodes in the tree. We visit each node once.
# Space Complexity: O(H) in the average case (balanced tree) and O(N) in the worst case (skewed tree) due to recursion stack depth.

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def subtreeWithAllDeepest(self, root: TreeNode | None) -> TreeNode | None:
        # Helper function to perform DFS and return (depth, subtree_root)
        def dfs(node: TreeNode | None) -> tuple[int, TreeNode | None]:
            # Base case: if the node is null, its depth is 0 and it doesn't contribute a subtree
            if not node:
                return 0, None

            # Recursively find the depth and smallest subtree for the left child
            left_depth, left_subtree = dfs(node.left)
            # Recursively find the depth and smallest subtree for the right child
            right_depth, right_subtree = dfs(node.right)

            # If the depths of the left and right subtrees are equal,
            # this current node is the root of the smallest subtree containing all deepest nodes.
            if left_depth == right_depth:
                return left_depth + 1, node
            # If the left subtree is deeper, the smallest subtree must be within the left subtree.
            elif left_depth > right_depth:
                return left_depth + 1, left_subtree
            # If the right subtree is deeper, the smallest subtree must be within the right subtree.
            else:  # right_depth > left_depth
                return right_depth + 1, right_subtree

        # Call the DFS helper function starting from the root
        # We only need the subtree root, so we ignore the depth returned.
        _, result_subtree = dfs(root)
        return result_subtree

```