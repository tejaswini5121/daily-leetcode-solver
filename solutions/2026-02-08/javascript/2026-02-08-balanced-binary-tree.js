/**
 * @param {TreeNode} root
 * @return {boolean}
 */
// Given a binary tree, determine if it is height-balanced.
// Link: https://leetcode.com/problems/balanced-binary-tree/
//
// Approach:
// We can solve this problem using a recursive Depth-First Search (DFS) approach.
// For each node, we need to calculate the height of its left and right subtrees.
// A tree is height-balanced if for every node, the difference in height between
// its left and right subtrees is no more than 1.
//
// To efficiently do this, we can create a helper function that returns the height
// of a subtree. This helper function will also implicitly check for balance.
// If at any point a subtree is found to be unbalanced, we can propagate this
// information up the recursion stack. We can use a special return value (e.g., -1)
// to indicate an unbalanced subtree.
//
// The helper function `getHeightAndCheckBalance(node)` will:
// 1. Base Case: If the node is null, its height is 0, and it's balanced. Return 0.
// 2. Recursively call itself for the left child: `leftHeight = getHeightAndCheckBalance(node.left)`.
// 3. If `leftHeight` is -1, it means the left subtree is unbalanced. Return -1 immediately.
// 4. Recursively call itself for the right child: `rightHeight = getHeightAndCheckBalance(node.right)`.
// 5. If `rightHeight` is -1, it means the right subtree is unbalanced. Return -1 immediately.
// 6. Check balance at the current node: If `abs(leftHeight - rightHeight) > 1`, the current node
//    makes the tree unbalanced. Return -1.
// 7. If balanced, return the height of the current subtree: `max(leftHeight, rightHeight) + 1`.
//
// The main `isBalanced` function will call `getHeightAndCheckBalance(root)` and return true
// if the result is not -1, and false otherwise.
//
// Time Complexity: O(N), where N is the number of nodes in the tree.
// Each node is visited exactly once. For each node, we perform constant time operations
// (comparisons, arithmetic operations, and function calls that return in constant time
// or propagate a result).
//
// Space Complexity: O(H), where H is the height of the tree. This is due to the
// recursion call stack. In the worst case (a skewed tree), H can be N, leading to O(N) space.
// In the best case (a perfectly balanced tree), H is log N, leading to O(log N) space.
// Therefore, the space complexity is O(H).
//
// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

const isBalanced = function(root) {
    /**
     * Helper function to calculate height and check balance simultaneously.
     * Returns the height of the subtree rooted at 'node' if it's balanced,
     * otherwise returns -1 to indicate an imbalance.
     * @param {TreeNode} node - The current node being processed.
     * @returns {number} The height of the subtree if balanced, or -1 if unbalanced.
     */
    const getHeightAndCheckBalance = (node) => {
        // Base case: An empty tree (null node) has a height of 0 and is balanced.
        if (!node) {
            return 0;
        }

        // Recursively get the height of the left subtree.
        const leftHeight = getHeightAndCheckBalance(node.left);
        // If the left subtree is unbalanced, propagate the imbalance signal (-1).
        if (leftHeight === -1) {
            return -1;
        }

        // Recursively get the height of the right subtree.
        const rightHeight = getHeightAndCheckBalance(node.right);
        // If the right subtree is unbalanced, propagate the imbalance signal (-1).
        if (rightHeight === -1) {
            return -1;
        }

        // Check if the current node is balanced.
        // The difference in heights of left and right subtrees must not exceed 1.
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1; // Indicate imbalance at this node.
        }

        // If the current node is balanced, return its height.
        // The height is 1 (for the current node) plus the maximum height of its children.
        return Math.max(leftHeight, rightHeight) + 1;
    };

    // Call the helper function starting from the root.
    // If it returns -1, the tree is unbalanced. Otherwise, it's balanced.
    return getHeightAndCheckBalance(root) !== -1;
};
```