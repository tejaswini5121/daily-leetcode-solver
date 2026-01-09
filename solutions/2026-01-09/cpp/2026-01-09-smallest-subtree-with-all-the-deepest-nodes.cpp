```cpp
/*
Problem Summary: Find the smallest subtree containing all nodes at the maximum depth in a binary tree.

Link: https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/

Approach:
We can solve this problem using a post-order Depth First Search (DFS) traversal.
For each node, we can return a pair: the depth of the subtree rooted at that node and the root of the smallest subtree containing all deepest nodes within that subtree.

The base case is a null node, which has a depth of 0 and a null subtree.

For a non-null node, we recursively call DFS on its left and right children.
Let `left_result` be the result from the left child and `right_result` be the result from the right child.
The depth of the current node's subtree will be 1 + max(left_result.depth, right_result.depth).

Now, we need to determine the smallest subtree containing all deepest nodes.
1. If `left_result.depth` is greater than `right_result.depth`, it means the deepest nodes are entirely within the left subtree. So, the smallest subtree for the current node is `left_result.subtree_root`.
2. If `right_result.depth` is greater than `left_result.depth`, it means the deepest nodes are entirely within the right subtree. So, the smallest subtree for the current node is `right_result.subtree_root`.
3. If `left_result.depth` equals `right_result.depth`, it means the deepest nodes are present in both subtrees (or there are no deepest nodes if both depths are 0). In this case, the current node itself is the root of the smallest subtree that contains all these deepest nodes. So, the smallest subtree for the current node is the current node itself.

The function will return this calculated depth and subtree root. The initial call with the root of the tree will yield the final answer.

Time Complexity: O(N), where N is the number of nodes in the tree. We visit each node exactly once during the DFS traversal.
Space Complexity: O(H) in the average case (balanced tree) and O(N) in the worst case (skewed tree), where H is the height of the tree. This is due to the recursion stack.
*/

#include <iostream>
#include <algorithm>
#include <vector>

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    // Helper struct to store the result of the DFS: depth and the root of the smallest subtree.
    struct DFSResult {
        int depth;
        TreeNode* subtree_root;
    };

    /**
     * @brief Finds the smallest subtree containing all deepest nodes.
     * 
     * @param root The root of the binary tree.
     * @return TreeNode* The root of the smallest subtree.
     */
    TreeNode* subtreeWithAllDeepest(TreeNode* root) {
        // Call the helper DFS function and return the subtree_root part of the result.
        return dfs(root).subtree_root;
    }

private:
    /**
     * @brief Performs a post-order DFS traversal to find the depth and the smallest subtree.
     * 
     * @param node The current node being visited.
     * @return DFSResult A struct containing the depth of the subtree rooted at 'node' and the root of the smallest subtree within it.
     */
    DFSResult dfs(TreeNode* node) {
        // Base case: If the node is null, its depth is 0 and its subtree root is null.
        if (!node) {
            return {0, nullptr};
        }

        // Recursively call DFS on the left child.
        DFSResult left_result = dfs(node->left);
        // Recursively call DFS on the right child.
        DFSResult right_result = dfs(node->right);

        // Calculate the depth of the current node's subtree.
        // It's 1 (for the current node) plus the maximum depth of its children's subtrees.
        int current_depth = 1 + std::max(left_result.depth, right_result.depth);

        // Determine the root of the smallest subtree containing all deepest nodes.
        if (left_result.depth > right_result.depth) {
            // If the left subtree is deeper, the deepest nodes are all in the left subtree.
            // The smallest subtree is the one found in the left subtree.
            return {current_depth, left_result.subtree_root};
        } else if (right_result.depth > left_result.depth) {
            // If the right subtree is deeper, the deepest nodes are all in the right subtree.
            // The smallest subtree is the one found in the right subtree.
            return {current_depth, right_result.subtree_root};
        } else {
            // If both subtrees have the same depth, it means the deepest nodes are found
            // in both subtrees, or the current node is itself a deepest node.
            // In this case, the current node is the root of the smallest subtree
            // that contains all these deepest nodes.
            return {current_depth, node};
        }
    }
};
```