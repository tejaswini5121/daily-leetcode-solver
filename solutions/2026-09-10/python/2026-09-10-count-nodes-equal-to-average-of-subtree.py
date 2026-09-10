```python
# Problem: Count Nodes Equal to Average of Subtree
# Link: https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree/
# Approach:
# We can use a Depth-First Search (DFS) approach to traverse the tree.
# For each node, we need to calculate the sum of its subtree and the count of nodes in its subtree.
# A post-order traversal is suitable because we need the information from the children before processing the parent.
# The DFS function will return a tuple: (sum_of_subtree, count_of_nodes_in_subtree).
# During the traversal, for each node, we calculate its subtree sum and count.
# Then, we compute the average (sum // count). If the node's value equals this average, we increment a counter.
#
# Time Complexity: O(N), where N is the number of nodes in the tree. Each node is visited exactly once.
# Space Complexity: O(H) in the best case (balanced tree) and O(N) in the worst case (skewed tree), where H is the height of the tree. This is due to the recursion stack used by DFS.

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def averageOfSubtree(self, root: TreeNode | None) -> int:
        # Initialize a counter for nodes whose value equals the average of their subtree.
        self.count = 0

        # Helper function to perform DFS and calculate subtree sum and node count.
        def dfs(node):
            # Base case: if the node is None, return sum 0 and count 0.
            if not node:
                return 0, 0

            # Recursively call dfs for left and right children.
            left_sum, left_count = dfs(node.left)
            right_sum, right_count = dfs(node.right)

            # Calculate the sum of the current subtree (node's value + children's subtree sums).
            current_subtree_sum = node.val + left_sum + right_sum
            # Calculate the count of nodes in the current subtree (1 for the current node + children's node counts).
            current_subtree_count = 1 + left_count + right_count

            # Calculate the average of the current subtree.
            # The problem specifies rounding down to the nearest integer.
            average = current_subtree_sum // current_subtree_count

            # Check if the current node's value is equal to the calculated average.
            if node.val == average:
                # If they are equal, increment the global counter.
                self.count += 1

            # Return the sum and count of the current subtree to be used by its parent.
            return current_subtree_sum, current_subtree_count

        # Start the DFS traversal from the root.
        dfs(root)
        # Return the final count of nodes matching the criteria.
        return self.count

```