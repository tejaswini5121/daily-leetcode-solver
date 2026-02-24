```java
/**
 * Problem: Sum of Root To Leaf Binary Numbers
 * Summary: Calculate the sum of all binary numbers formed by root-to-leaf paths in a binary tree.
 * Link: https://leetcode.com/problems/sum-of-root-to-leaf-binary-numbers/
 *
 * Approach:
 * We can use a Depth-First Search (DFS) approach to traverse the tree.
 * During the traversal, we maintain the current binary number being formed along the path from the root.
 * When we move from a parent node to a child node, we update the current binary number by shifting the parent's number left by one bit and adding the child's value.
 * When we reach a leaf node (a node with no left and no right children), we add the binary number formed by this path to a running total.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree. We visit each node exactly once.
 * Space Complexity: O(H) in the worst case, where H is the height of the tree, due to the recursion stack. In the worst case (a skewed tree), H can be N. In the best case (a balanced tree), H is log N.
 */
class Solution {
    // Variable to store the total sum of all root-to-leaf binary numbers.
    private int totalSum = 0;

    /**
     * Main function to calculate the sum of root-to-leaf binary numbers.
     *
     * @param root The root of the binary tree.
     * @return The sum of all binary numbers represented by root-to-leaf paths.
     */
    public int sumRootToLeaf(TreeNode root) {
        // Start the DFS traversal from the root with an initial current number of 0.
        dfs(root, 0);
        return totalSum;
    }

    /**
     * Performs a Depth-First Search (DFS) to traverse the tree and calculate binary numbers.
     *
     * @param node The current node being visited.
     * @param currentNumber The binary number formed by the path from the root to the parent of the current node.
     */
    private void dfs(TreeNode node, int currentNumber) {
        // Base case: If the current node is null, we've gone past a leaf or started with an empty tree.
        if (node == null) {
            return;
        }

        // Update the current binary number:
        // Shift the previous number left by one bit (equivalent to multiplying by 2)
        // and add the current node's value (0 or 1).
        currentNumber = (currentNumber << 1) | node.val;

        // Check if the current node is a leaf node.
        // A leaf node has no left child and no right child.
        if (node.left == null && node.right == null) {
            // If it's a leaf node, add the formed binary number to the total sum.
            totalSum += currentNumber;
            return; // Stop further recursion for this path as we've reached a leaf.
        }

        // Recursively call dfs for the left child.
        dfs(node.left, currentNumber);

        // Recursively call dfs for the right child.
        dfs(node.right, currentNumber);
    }

    // Definition for a binary tree node.
    public static class TreeNode {
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
}
```