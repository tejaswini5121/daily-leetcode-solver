```cpp
/**
 * Problem: Sum of Root To Leaf Binary Numbers
 * Link: https://leetcode.com/problems/sum-of-root-to-leaf-binary-numbers/
 *
 * Problem Summary:
 * Calculate the sum of all binary numbers formed by root-to-leaf paths in a binary tree
 * where each node's value is either 0 or 1.
 *
 * Approach:
 * We can use a Depth-First Search (DFS) approach to traverse the tree.
 * During the traversal, we maintain a current number being built from the path.
 * When we move from a parent node to a child node, we "shift" the current number left
 * by one bit (multiply by 2) and add the child's value.
 * When we reach a leaf node (a node with no children), we add the binary number
 * represented by the path to a running total sum.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree.
 * We visit each node exactly once during the DFS traversal.
 *
 * Space Complexity: O(H) in the average case and O(N) in the worst case,
 * where H is the height of the tree. This is due to the recursion stack for DFS.
 * In a balanced tree, H is log N. In a skewed tree, H can be N.
 */

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
    // Main function to initiate the sum calculation.
    int sumRootToLeaf(TreeNode* root) {
        // Initialize the total sum to 0.
        int totalSum = 0;
        // Call the helper DFS function to traverse the tree and calculate the sum.
        // The initial current number is 0.
        dfs(root, 0, totalSum);
        // Return the final accumulated sum.
        return totalSum;
    }

private:
    /**
     * Helper function to perform Depth-First Search (DFS) on the binary tree.
     *
     * @param node The current node being visited.
     * @param currentNumber The binary number formed by the path from the root to the parent of the current node.
     * @param totalSum A reference to the variable storing the total sum of root-to-leaf binary numbers.
     */
    void dfs(TreeNode* node, int currentNumber, int& totalSum) {
        // If the current node is null, we have reached the end of a path, so return.
        if (!node) {
            return;
        }

        // Update the current number by shifting it left by one bit (multiplying by 2)
        // and adding the value of the current node. This effectively appends the node's bit.
        currentNumber = (currentNumber << 1) | node->val;

        // Check if the current node is a leaf node (has no left and no right children).
        if (!node->left && !node->right) {
            // If it's a leaf node, the `currentNumber` now represents the binary number
            // for the path from the root to this leaf. Add it to the total sum.
            totalSum += currentNumber;
            // Once a leaf is processed, we don't need to go further down this path.
            return;
        }

        // If it's not a leaf node, recursively call DFS for the left child.
        // The updated `currentNumber` is passed down.
        dfs(node->left, currentNumber, totalSum);

        // Recursively call DFS for the right child.
        // The updated `currentNumber` is passed down.
        dfs(node->right, currentNumber, totalSum);
    }
};
```