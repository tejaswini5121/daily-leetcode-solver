// Problem: Balanced Binary Tree
// Link: https://leetcode.com/problems/balanced-binary-tree/
//
// Approach:
// We can solve this problem by recursively calculating the height of each subtree.
// For a node to be part of a height-balanced tree, two conditions must be met:
// 1. Its left subtree must be height-balanced.
// 2. Its right subtree must be height-balanced.
// 3. The absolute difference between the heights of its left and right subtrees must be no more than 1.
//
// We can use a helper function `getHeight` that returns the height of a subtree.
// If a subtree is not balanced, we can signal this by returning -1.
// The `getHeight` function works as follows:
// - If the node is null, its height is 0.
// - Recursively calculate the height of the left and right subtrees.
// - If either subtree returns -1 (indicating it's not balanced), propagate -1 upwards.
// - If the absolute difference between the left and right subtree heights is greater than 1, return -1.
// - Otherwise, return the maximum of the left and right subtree heights plus 1.
//
// The main `isBalanced` function will call `getHeight` on the root.
// If `getHeight` returns -1, the tree is not balanced; otherwise, it is.
//
// Time Complexity:
// O(N), where N is the number of nodes in the tree.
// Each node is visited at most once by the `getHeight` function.
//
// Space Complexity:
// O(H), where H is the height of the tree.
// This is due to the recursion stack. In the worst case (a skewed tree), H can be N,
// resulting in O(N) space. In the best case (a balanced tree), H is log N,
// resulting in O(log N) space.
//
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    // Helper function to calculate the height of a subtree and check for balance.
    // Returns the height of the subtree if it's balanced, otherwise returns -1.
    int getHeight(TreeNode* node) {
        // Base case: An empty tree has a height of 0 and is balanced.
        if (!node) {
            return 0;
        }

        // Recursively get the height of the left subtree.
        int leftHeight = getHeight(node->left);
        // If the left subtree is not balanced, propagate the imbalance signal (-1).
        if (leftHeight == -1) {
            return -1;
        }

        // Recursively get the height of the right subtree.
        int rightHeight = getHeight(node->right);
        // If the right subtree is not balanced, propagate the imbalance signal (-1).
        if (rightHeight == -1) {
            return -1;
        }

        // Check if the current node's subtrees are balanced.
        // The absolute difference in heights must not be greater than 1.
        if (abs(leftHeight - rightHeight) > 1) {
            return -1; // Indicate that this subtree is not balanced.
        }

        // If balanced, return the height of the current node's subtree.
        // Height is 1 (for the current node) plus the height of the taller subtree.
        return max(leftHeight, rightHeight) + 1;
    }

    // Main function to determine if the binary tree is height-balanced.
    bool isBalanced(TreeNode* root) {
        // Call the helper function. If it returns -1, the tree is not balanced.
        // Otherwise, it's balanced.
        return getHeight(root) != -1;
    }
};
