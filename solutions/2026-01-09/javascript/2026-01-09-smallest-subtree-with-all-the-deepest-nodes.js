/**
 * @param {TreeNode} root
 * @return {TreeNode}
 *
 * Problem Summary: Find the smallest subtree containing all deepest nodes.
 * Link: https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/
 *
 * Approach:
 * This problem can be solved using a recursive Depth-First Search (DFS) approach.
 * The core idea is to return a pair from the DFS function:
 * 1. The root of the smallest subtree containing all deepest nodes found so far in the current subtree.
 * 2. The depth of the deepest node in the current subtree.
 *
 * For each node, we recursively call DFS on its left and right children.
 * - If both left and right subtrees return the same maximum depth, it means the deepest nodes are present in both subtrees. In this case, the current node is the LCA of those deepest nodes, and thus the root of the smallest subtree containing them.
 * - If the left subtree has a greater depth, then the smallest subtree containing all deepest nodes must be within the left subtree. We return the result from the left subtree.
 * - If the right subtree has a greater depth, then the smallest subtree containing all deepest nodes must be within the right subtree. We return the result from the right subtree.
 * - If a node is a leaf, it's the deepest node in its own subtree, so we return the node itself and its depth (which is 1).
 *
 * The base case for the recursion is when a node is null, in which case we return null and a depth of 0.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree. Each node is visited exactly once during the DFS traversal.
 * Space Complexity: O(H), where H is the height of the tree. This is due to the recursion stack. In the worst case (a skewed tree), H can be N, resulting in O(N) space. In the best case (a balanced tree), H is log N, resulting in O(log N) space.
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
function subtreeWithAllDeepest(root) {
    /**
     * Helper function to perform DFS and return the deepest subtree root and its depth.
     * @param {TreeNode} node - The current node being processed.
     * @returns {[TreeNode, number]} - A tuple where the first element is the root of the smallest subtree containing all deepest nodes in the current subtree, and the second element is the depth of that subtree.
     */
    function dfs(node) {
        // Base case: if the node is null, return null and depth 0.
        if (!node) {
            return [null, 0];
        }

        // Recursively call DFS on the left and right children.
        const [leftSubtreeRoot, leftDepth] = dfs(node.left);
        const [rightSubtreeRoot, rightDepth] = dfs(node.right);

        // Compare the depths of the left and right subtrees.
        if (leftDepth > rightDepth) {
            // If left subtree is deeper, the smallest subtree with all deepest nodes
            // must be in the left subtree.
            return [leftSubtreeRoot, leftDepth + 1];
        } else if (rightDepth > leftDepth) {
            // If right subtree is deeper, the smallest subtree with all deepest nodes
            // must be in the right subtree.
            return [rightSubtreeRoot, rightDepth + 1];
        } else {
            // If depths are equal, it means the deepest nodes are present in both
            // subtrees. The current node is the LCA of these deepest nodes,
            // and thus the root of the smallest subtree containing them.
            return [node, leftDepth + 1];
        }
    }

    // Call the DFS helper function starting from the root.
    // The first element of the returned tuple is the root of the smallest subtree.
    const [resultSubtreeRoot, _] = dfs(root);
    return resultSubtreeRoot;
}
```