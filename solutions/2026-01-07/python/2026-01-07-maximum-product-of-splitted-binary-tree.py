# Problem Summary:
# Given a binary tree, find an edge to remove such that the product of the sums of the two resulting subtrees is maximized. Return this maximum product modulo 10^9 + 7.
# Problem Link: https://leetcode.com/problems/maximum-product-of-splitted-binary-tree/

# Approach Explanation:
# The problem asks us to find an edge to remove that splits the tree into two subtrees, and we want to maximize the product of their sums.
# Let `total_sum` be the sum of all node values in the original tree.
# If we remove an edge such that one of the resulting subtrees has a sum `s`, then the other subtree will necessarily have a sum `total_sum - s`.
# Our goal is to maximize `s * (total_sum - s)`.
#
# The approach involves two depth-first search (DFS) passes:
# 1.  **First DFS Pass (Calculate Total Sum):** Traverse the entire tree to calculate the sum of all node values. This `total_sum` will be used as a reference for calculating the second subtree's sum in the product calculation.
# 2.  **Second DFS Pass (Calculate Subtree Sums and Max Product):** Traverse the tree again. For each node, calculate the sum of the subtree rooted at that node. Let this be `current_subtree_sum`. If we imagine cutting the edge *above* this node (i.e., the edge connecting this node to its parent), then we have two subtrees: one is the `current_subtree_sum`, and the other is `total_sum - current_subtree_sum`. Calculate their product `current_subtree_sum * (total_sum - current_subtree_sum)` and update a global maximum product if this product is greater.
#
# The maximization must happen before taking the modulo. Only the final result should be modulo `10^9 + 7`.

# Time Complexity:
# O(N), where N is the number of nodes in the binary tree.
# The first DFS pass visits each node exactly once to calculate the total sum.
# The second DFS pass also visits each node exactly once to calculate subtree sums and update the maximum product.
# Thus, the total time complexity is linear with respect to the number of nodes.

# Space Complexity:
# O(H), where H is the height of the binary tree.
# This space is used by the recursion stack for the DFS traversals. In the worst case (a skewed tree), H can be equal to N, leading to O(N) space. In the best case (a balanced tree), H is O(log N).

# Definition for a binary tree node.
# This class is typically provided by LeetCode.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxProduct(self, root: TreeNode) -> int:
        # Initialize a variable to store the total sum of all nodes in the tree.
        # This will be calculated in the first DFS pass.
        total_tree_sum = 0
        
        # Initialize a variable to store the maximum product found.
        # This will be updated in the second DFS pass.
        # We initialize it to 0 as node values are positive, so products will be non-negative.
        max_product_found = 0
        
        # Define the modulo constant as specified in the problem.
        MOD = 10**9 + 7

        # --- First DFS Pass: Calculate the total sum of the entire tree ---
        # This helper function performs a post-order traversal to sum all node values.
        def calculate_total_sum_dfs(node):
            # Base case: if the node is None, it contributes 0 to the sum.
            if not node:
                return 0
            # Recursively sum the current node's value with its left and right subtrees' sums.
            return node.val + calculate_total_sum_dfs(node.left) + calculate_total_sum_dfs(node.right)

        # Execute the first DFS pass to get the total sum of the tree.
        total_tree_sum = calculate_total_sum_dfs(root)

        # --- Second DFS Pass: Calculate subtree sums and find the maximum product ---
        # This helper function performs a post-order traversal.
        # For each node, it calculates its subtree sum and considers it as a potential split point.
        # It also updates the 'max_product_found' variable in the outer scope.
        def calculate_subtree_sums_and_products_dfs(node):
            # The 'nonlocal' keyword is used to indicate that 'max_product_found'
            # refers to the variable in the enclosing scope (Solution.maxProduct method),
            # not a new local variable.
            nonlocal max_product_found
            
            # Base case: if the node is None, its subtree sum is 0.
            if not node:
                return 0
            
            # Recursively get the sums of the left and right subtrees.
            left_subtree_sum = calculate_subtree_sums_and_products_dfs(node.left)
            right_subtree_sum = calculate_subtree_sums_and_products_dfs(node.right)
            
            # Calculate the sum of the subtree rooted at the current node.
            current_subtree_sum = node.val + left_subtree_sum + right_subtree_sum
            
            # Consider this 'current_subtree_sum' as the sum of one part after splitting.
            # The other part's sum would be 'total_tree_sum - current_subtree_sum'.
            # Calculate their product.
            current_product = current_subtree_sum * (total_tree_sum - current_subtree_sum)
            
            # Update the global maximum product if the current product is greater.
            max_product_found = max(max_product_found, current_product)
            
            # Return the sum of the subtree rooted at the current node.
            # This sum will be used by its parent node in the recursion.
            return current_subtree_sum

        # Execute the second DFS pass.
        # The return value of this call (which would be total_tree_sum) is not explicitly used,
        # but its side effect of updating 'max_product_found' is what we need.
        calculate_subtree_sums_and_products_dfs(root)
        
        # Return the final maximum product found, modulo 10^9 + 7.
        # The maximization was performed on the full values before applying the modulo.
        return max_product_found % MOD