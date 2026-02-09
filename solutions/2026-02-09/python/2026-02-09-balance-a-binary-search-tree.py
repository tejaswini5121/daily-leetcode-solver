```python
# Balance a Binary Search Tree
# Link: https://leetcode.com/problems/balance-a-binary-search-tree/
# Approach:
# The core idea is to first extract all node values from the BST into a sorted list.
# A standard in-order traversal of a BST naturally produces a sorted list of its elements.
# Once we have the sorted list, we can construct a balanced BST from it.
# A balanced BST can be built recursively by picking the middle element of the sorted list as the root,
# and then recursively building the left subtree from the left half of the list and the right subtree
# from the right half of the list. This divide and conquer approach ensures that the tree remains balanced.
#
# Time Complexity:
# 1. In-order traversal to get sorted list: O(N), where N is the number of nodes.
# 2. Building the balanced BST from the sorted list: O(N), as each node is processed once.
# Total time complexity is O(N).
#
# Space Complexity:
# 1. Storing the sorted list of node values: O(N).
# 2. Recursion stack for building the BST: O(log N) in the best case (balanced tree) and O(N) in the worst case (skewed tree, though we are building a balanced tree so it will be O(log N)).
# Total space complexity is O(N) due to the list.

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def balanceBST(self, root: TreeNode) -> TreeNode:
        # Step 1: Perform an in-order traversal to get all node values in a sorted list.
        sorted_values = []

        def inorder_traversal(node):
            if not node:
                return
            inorder_traversal(node.left)
            sorted_values.append(node.val)
            inorder_traversal(node.right)

        inorder_traversal(root)

        # Step 2: Build a balanced BST from the sorted list.
        # This function recursively constructs the tree.
        def build_balanced_tree(values, start, end):
            # Base case: if the start index is greater than the end index, it means this subtree is empty.
            if start > end:
                return None

            # Find the middle element to use as the root of the current subtree.
            mid = (start + end) // 2
            # Create the root node with the middle value.
            node = TreeNode(values[mid])

            # Recursively build the left subtree using the left half of the array.
            node.left = build_balanced_tree(values, start, mid - 1)
            # Recursively build the right subtree using the right half of the array.
            node.right = build_balanced_tree(values, mid + 1, end)

            # Return the constructed node (which is the root of this subtree).
            return node

        # Call the build_balanced_tree function with the entire sorted_values list.
        return build_balanced_tree(sorted_values, 0, len(sorted_values) - 1)

```