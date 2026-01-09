```java
/**
 * Problem: Smallest Subtree with all the Deepest Nodes
 * Link: https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/
 *
 * Approach:
 * We can solve this problem by using a post-order traversal (DFS).
 * For each node, we can return a pair: the depth of the subtree rooted at this node, and the node itself if it's the smallest subtree containing all deepest nodes within its subtree.
 *
 * The post-order traversal ensures that we process children before their parent.
 * When we are at a node, we first recursively call the function on its left and right children.
 * Each recursive call will return a pair (depth, LCA node).
 *
 * Let's define a helper function `dfs(node)` that returns a `Pair<Integer, TreeNode>`:
 * - `depth`: the maximum depth of the subtree rooted at `node`.
 * - `lcaNode`: the node that is the smallest subtree containing all deepest nodes within the subtree of `node`.
 *
 * Base Case:
 * If `node` is null, return `Pair(-1, null)` (depth -1 signifies an empty tree).
 *
 * Recursive Step:
 * 1. Recursively call `dfs(node.left)` to get `leftResult = (leftDepth, leftLca)`.
 * 2. Recursively call `dfs(node.right)` to get `rightResult = (rightDepth, rightLca)`.
 *
 * Now, compare `leftDepth` and `rightDepth`:
 * - If `leftDepth > rightDepth`: The deepest nodes are in the left subtree. The LCA of these deepest nodes is `leftLca`. The depth of the current subtree is `leftDepth + 1`. So, return `Pair(leftDepth + 1, leftLca)`.
 * - If `rightDepth > leftDepth`: The deepest nodes are in the right subtree. The LCA of these deepest nodes is `rightLca`. The depth of the current subtree is `rightDepth + 1`. So, return `Pair(rightDepth + 1, rightLca)`.
 * - If `leftDepth == rightDepth`: The deepest nodes are in both subtrees (or the current node is the deepest if both children return depth -1). The current node `node` is the smallest subtree that contains all these deepest nodes. The depth of the current subtree is `leftDepth + 1` (or `rightDepth + 1`). So, return `Pair(leftDepth + 1, node)`.
 *
 * The final result will be the `lcaNode` returned by calling `dfs(root)`.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree. We visit each node exactly once.
 * Space Complexity: O(H), where H is the height of the tree. This is due to the recursion stack. In the worst case (a skewed tree), H can be N. In the best case (a balanced tree), H is log N.
 */
// Definition for a binary tree node.
class TreeNode {
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

// Helper class to return depth and LCA node from DFS
class Pair<K, V> {
    K key; // Depth
    V value; // LCA Node

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
}

class Solution {
    /**
     * Finds the smallest subtree containing all the deepest nodes in a binary tree.
     *
     * @param root The root of the binary tree.
     * @return The root of the smallest subtree containing all deepest nodes.
     */
    public TreeNode subtreeWithAllDeepest(TreeNode root) {
        // Call the DFS helper function starting from the root.
        // The helper function returns a Pair containing the depth of the subtree
        // and the smallest subtree with all deepest nodes within that subtree.
        // We only need the TreeNode part of the result.
        return dfs(root).value;
    }

    /**
     * Performs a Depth-First Search (DFS) to find the depth and the smallest subtree
     * containing all deepest nodes within the current subtree.
     *
     * @param node The current node being visited.
     * @return A Pair where 'key' is the depth of the subtree rooted at 'node',
     *         and 'value' is the TreeNode representing the smallest subtree
     *         with all deepest nodes within the subtree of 'node'.
     */
    private Pair<Integer, TreeNode> dfs(TreeNode node) {
        // Base case: If the node is null, it represents an empty subtree.
        // Return depth -1 to indicate this, and null for the LCA node.
        if (node == null) {
            return new Pair<>(-1, null);
        }

        // Recursively call dfs on the left child.
        // leftResult will contain: leftResult.key (depth of left subtree), leftResult.value (LCA in left subtree).
        Pair<Integer, TreeNode> leftResult = dfs(node.left);

        // Recursively call dfs on the right child.
        // rightResult will contain: rightResult.key (depth of right subtree), rightResult.value (LCA in right subtree).
        Pair<Integer, TreeNode> rightResult = dfs(node.right);

        // Get the depths of the left and right subtrees.
        int leftDepth = leftResult.key;
        int rightDepth = rightResult.key;

        // Compare the depths of the left and right subtrees to determine the deepest nodes.

        // Case 1: The deepest nodes are all in the left subtree.
        // This happens if the left subtree's depth is greater than the right subtree's depth.
        if (leftDepth > rightDepth) {
            // The LCA for the deepest nodes in the entire subtree rooted at 'node'
            // will be the LCA found in the left subtree.
            // The depth of the current subtree is one more than the depth of the left subtree.
            return new Pair<>(leftDepth + 1, leftResult.value);
        }
        // Case 2: The deepest nodes are all in the right subtree.
        // This happens if the right subtree's depth is greater than the left subtree's depth.
        else if (rightDepth > leftDepth) {
            // The LCA for the deepest nodes in the entire subtree rooted at 'node'
            // will be the LCA found in the right subtree.
            // The depth of the current subtree is one more than the depth of the right subtree.
            return new Pair<>(rightDepth + 1, rightResult.value);
        }
        // Case 3: The deepest nodes are present in both left and right subtrees,
        // or the current node is the only deepest node (when both children have depth -1).
        // This happens if the depths of the left and right subtrees are equal.
        else { // leftDepth == rightDepth
            // In this case, the current node 'node' is the smallest subtree
            // that contains all the deepest nodes because it's the common ancestor
            // of nodes at the maximum depth.
            // The depth of the current subtree is one more than the equal depth of its children.
            return new Pair<>(leftDepth + 1, node);
        }
    }
}
```