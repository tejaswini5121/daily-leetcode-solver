// Summary: Calculate the sum of binary numbers represented by root-to-leaf paths in a binary tree.
// Link: https://leetcode.com/problems/sum-of-root-to-leaf-binary-numbers/
// Approach: We can use Depth-First Search (DFS) to traverse the tree. During the traversal, we maintain the current binary number formed by the path from the root to the current node. When we reach a leaf node, we add the binary number represented by that path to our total sum.
//
// The binary number can be built efficiently. For a given node with value 'val' and a current binary number 'currentNum', the new binary number for its children will be (currentNum * 2) + val. This is because shifting a binary number left by one position is equivalent to multiplying by 2, and then we add the current node's value.
//
// Time Complexity: O(N), where N is the number of nodes in the tree. We visit each node exactly once during the DFS traversal.
// Space Complexity: O(H) in the average case (balanced tree) and O(N) in the worst case (skewed tree), where H is the height of the tree. This is due to the recursion stack used by the DFS.

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumRootToLeaf = function(root) {
    // Variable to store the total sum of root-to-leaf binary numbers.
    let totalSum = 0;

    /**
     * Helper function for Depth-First Search (DFS) traversal.
     * @param {TreeNode} node - The current node being visited.
     * @param {number} currentNum - The binary number formed by the path from the root to the parent of the current node.
     */
    function dfs(node, currentNum) {
        // If the current node is null, we have reached the end of a path that doesn't lead to a leaf.
        if (!node) {
            return;
        }

        // Update the current binary number.
        // Shift the bits of currentNum to the left by one (multiply by 2) and add the current node's value.
        // This effectively appends the current node's bit to the binary representation.
        currentNum = (currentNum << 1) | node.val; // Using bitwise OR is equivalent to adding node.val if node.val is 0 or 1.

        // Check if the current node is a leaf node.
        // A leaf node has no left child and no right child.
        if (!node.left && !node.right) {
            // If it's a leaf node, add the binary number represented by this path to the total sum.
            totalSum += currentNum;
            return; // Stop further traversal down this path.
        }

        // Recursively call dfs for the left child.
        dfs(node.left, currentNum);
        // Recursively call dfs for the right child.
        dfs(node.right, currentNum);
    }

    // Start the DFS traversal from the root node with an initial current number of 0.
    dfs(root, 0);

    // Return the total sum of all root-to-leaf binary numbers.
    return totalSum;
};
```