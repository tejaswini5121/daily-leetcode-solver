```python
# Problem: Create Binary Tree From Descriptions
# Link: https://leetcode.com/problems/create-binary-tree-from-descriptions/
# Approach:
# 1. We need to build a binary tree from a list of parent-child relationships.
# 2. To efficiently access nodes by their values, we'll use a hash map (dictionary in Python) to store TreeNode objects.
# 3. We also need to identify the root node. The root is the node that is a parent but never a child.
#    We can track all child nodes in a set. The node that appears as a parent but not in the set of children is the root.
# 4. Iterate through the `descriptions` list:
#    a. For each `[parent_val, child_val, is_left]`:
#       i. Get or create the `parent_node` and `child_node` from the hash map.
#       ii. If `is_left` is 1, set `parent_node.left = child_node`.
#       iii. If `is_left` is 0, set `parent_node.right = child_node`.
#       iv. Add `child_val` to a set of `children_values` to identify non-root nodes.
# 5. After processing all descriptions, iterate through the `nodes` hash map.
#    The key that is not present in the `children_values` set is the root's value.
# 6. Return the root node.
#
# Time Complexity: O(N), where N is the number of descriptions. We iterate through the descriptions once to build the tree and populate the hash map. Then, we iterate through the hash map (at most N nodes) to find the root.
# Space Complexity: O(N), where N is the number of unique node values. This is due to the hash map storing TreeNode objects and the set storing child values. In the worst case, all values are unique and are either parents or children.

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def createBinaryTree(self, descriptions: list[list[int]]) -> TreeNode | None:
        # A dictionary to store TreeNode objects, keyed by their values for quick access.
        nodes = {}
        # A set to store the values of all child nodes. This helps us identify the root node later.
        children_values = set()

        # Helper function to get or create a TreeNode for a given value.
        def get_or_create_node(val):
            if val not in nodes:
                nodes[val] = TreeNode(val)
            return nodes[val]

        # Iterate through each description to build the tree structure.
        for parent_val, child_val, is_left in descriptions:
            # Get the TreeNode for the parent and child values.
            parent_node = get_or_create_node(parent_val)
            child_node = get_or_create_node(child_val)

            # Add the child's value to the set of children.
            children_values.add(child_val)

            # Assign the child node to its parent based on whether it's a left or right child.
            if is_left:
                parent_node.left = child_node
            else:
                parent_node.right = child_node

        # Find the root node. The root node is the one that exists as a parent but is never a child.
        # Iterate through all the nodes we've created.
        root_node = None
        for val, node in nodes.items():
            # If a node's value is not found in the set of children values, it means it's a root.
            if val not in children_values:
                root_node = node
                # Since the problem guarantees a valid tree, there will be exactly one root.
                break

        # Return the root of the constructed binary tree.
        return root_node

```