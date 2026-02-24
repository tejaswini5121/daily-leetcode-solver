```python
# Problem: Sum of Root To Leaf Binary Numbers
# Summary: Given a binary tree where each node is 0 or 1, calculate the sum of binary numbers represented by root-to-leaf paths.
# Link: https://leetcode.com/problems/sum-of-root-to-leaf-binary-numbers/
# Approach:
# We can use a Depth-First Search (DFS) approach to traverse the tree.
# During the traversal, we maintain the current binary number represented by the path from the root to the current node.
# When we reach a leaf node, we convert the current binary number to its decimal equivalent and add it to a running total.
# To efficiently build the binary number, for each step down from a parent to a child, we can left-shift the current number by 1 and add the child's value.
# For example, if the current number is '10' (decimal 2) and the child's value is '1', the new number becomes '101' (decimal 5). This is equivalent to (current_number * 2) + child_value.
# Time Complexity: O(N), where N is the number of nodes in the tree. Each node is visited exactly once.
# Space Complexity: O(H) in the average case and O(N) in the worst case (for a skewed tree), where H is the height of the tree. This is due to the recursion stack used by DFS.

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def sumRootToLeaf(self, root: TreeNode | None) -> int:
        # Initialize the total sum of all root-to-leaf binary numbers
        self.total_sum = 0

        # Helper function for Depth-First Search
        def dfs(node: TreeNode | None, current_number: int):
            # Base case: If the current node is None, we have gone past a leaf, so return
            if not node:
                return

            # Update the current binary number by left-shifting and adding the current node's value
            # This effectively appends the current node's bit to the binary representation
            current_number = (current_number << 1) | node.val

            # Check if the current node is a leaf node
            if not node.left and not node.right:
                # If it's a leaf, add the decimal value of the current_number to the total sum
                self.total_sum += current_number
                return

            # Recursively call dfs for the left child
            dfs(node.left, current_number)
            # Recursively call dfs for the right child
            dfs(node.right, current_number)

        # Start the DFS traversal from the root node with an initial current_number of 0
        dfs(root, 0)

        # Return the accumulated total sum
        return self.total_sum

```