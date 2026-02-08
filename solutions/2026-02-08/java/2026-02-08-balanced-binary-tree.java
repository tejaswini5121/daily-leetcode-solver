/**
 * Given a binary tree, determine if it is height-balanced.
 *
 * Link: https://leetcode.com/problems/balanced-binary-tree/
 *
 * Approach:
 * We can solve this problem using a recursive Depth-First Search (DFS) approach.
 * For each node, we need to calculate the height of its left and right subtrees.
 * If the absolute difference between the heights of the left and right subtrees is
 * greater than 1, the tree is not balanced. We can also use a special return value
 * (e.g., -1) from the helper function to indicate that a subtree is unbalanced.
 *
 * The helper function will return the height of the subtree rooted at the current node
 * if the subtree is balanced, and -1 if it's unbalanced.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree.
 * We visit each node exactly once. For each node, we compute its height recursively.
 *
 * Space Complexity: O(H), where H is the height of the tree.
 * This is due to the recursion stack. In the worst case (a skewed tree), H can be N.
 * In the best case (a perfectly balanced tree), H is log N.
 */
class Solution {

    /**
     * Definition for a binary tree node.
     */
    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode() {}
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }

    /**
     * Checks if the given binary tree is height-balanced.
     * @param root The root of the binary tree.
     * @return True if the tree is height-balanced, false otherwise.
     */
    public boolean isBalanced(TreeNode root) {
        // If the helper function returns -1, it means an unbalanced subtree was found.
        // Otherwise, it returns the height of the balanced tree.
        return checkHeight(root) != -1;
    }

    /**
     * Helper function to calculate the height of a subtree and check for balance.
     * It returns the height of the subtree if it's balanced, otherwise -1.
     * @param node The current node.
     * @return The height of the subtree rooted at 'node' if balanced, or -1 if unbalanced.
     */
    private int checkHeight(TreeNode node) {
        // Base case: An empty tree is considered balanced and has a height of 0.
        if (node == null) {
            return 0;
        }

        // Recursively get the height of the left subtree.
        int leftHeight = checkHeight(node.left);
        // If the left subtree is unbalanced, propagate the unbalanced state (-1).
        if (leftHeight == -1) {
            return -1;
        }

        // Recursively get the height of the right subtree.
        int rightHeight = checkHeight(node.right);
        // If the right subtree is unbalanced, propagate the unbalanced state (-1).
        if (rightHeight == -1) {
            return -1;
        }

        // Check if the current node is balanced.
        // The absolute difference in heights of left and right subtrees should not exceed 1.
        if (Math.abs(leftHeight - rightHeight) > 1) {
            // If unbalanced, return -1 to indicate this.
            return -1;
        } else {
            // If balanced, return the height of the current subtree.
            // The height of the current node is 1 + the maximum height of its children.
            return Math.max(leftHeight, rightHeight) + 1;
        }
    }
}
