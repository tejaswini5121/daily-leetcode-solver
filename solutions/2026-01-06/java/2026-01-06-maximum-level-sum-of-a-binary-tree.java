import java.util.LinkedList;
import java.util.Queue;

// Definition for a binary tree node.
// This class is typically provided by the LeetCode environment,
// but included here for a complete, runnable file.
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

/*
 * Problem Summary:
 * Given the root of a binary tree, find the level (starting from 1 for the root) that has the maximum sum of its node values.
 * If multiple levels have the same maximum sum, return the smallest level number among them.
 *
 * Link: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/
 *
 * Approach Explanation:
 * This problem is optimally solved using Breadth-First Search (BFS), also known as level-order traversal.
 * The BFS algorithm allows us to process the tree one level at a time.
 *
 * The steps are as follows:
 * 1. Initialize a `Queue` (specifically, a `LinkedList` implementation) to manage nodes for BFS.
 * 2. Initialize `maxSum` to `Long.MIN_VALUE` to correctly track the largest sum, considering sums can be negative.
 * 3. Initialize `maxLevel` to 0, which will store the level number with the `maxSum`.
 * 4. Initialize `currentLevel` to 1, representing the level we are currently processing.
 * 5. If the `root` is `null`, return 0 (though constraints state at least one node, so `root` won't be null).
 * 6. Add the `root` to the queue to start the BFS.
 * 7. While the queue is not empty:
 *    a. Get the `size` of the queue. This `size` indicates exactly how many nodes are at the `currentLevel`.
 *    b. Initialize `currentLevelSum` to 0 for accumulating the sum of node values at this level.
 *    c. Iterate `size` times:
 *       i. Dequeue a `node` from the front of the queue.
 *       ii. Add the `node.val` to `currentLevelSum`.
 *       iii. If the `node` has a `left` child, enqueue it.
 *       iv. If the `node` has a `right` child, enqueue it.
 *    d. After processing all nodes for the `currentLevel`:
 *       i. Compare `currentLevelSum` with `maxSum`.
 *       ii. If `currentLevelSum` is strictly greater than `maxSum`, update `maxSum` to `currentLevelSum`
 *          and `maxLevel` to `currentLevel`. Using `>` ensures that if multiple levels have the same
 *          maximum sum, we keep the smallest level number encountered first.
 *       iii. Increment `currentLevel` to move to the next level.
 * 8. Once the queue is empty, all levels have been processed. Return `maxLevel`.
 *
 * Time Complexity:
 * O(N), where N is the number of nodes in the binary tree.
 * Each node is visited (added to the queue and removed from the queue) exactly once.
 * Performing constant time operations for each node (adding to sum, checking children, enqueuing children).
 *
 * Space Complexity:
 * O(W), where W is the maximum width of the binary tree.
 * In the worst-case scenario (e.g., a complete binary tree), the queue might store up to N/2 nodes
 * at the widest level. Therefore, the space complexity can be considered O(N) in the worst case.
 */
class Solution {
    public int maxLevelSum(TreeNode root) {
        // If the tree is empty, return 0. Problem constraints usually guarantee root is not null (N >= 1).
        if (root == null) {
            return 0;
        }

        // Queue for BFS traversal. Using LinkedList as an implementation of Queue.
        Queue<TreeNode> queue = new LinkedList<>();
        // Add the root node to start the BFS.
        queue.offer(root);

        // Variables to keep track of the maximum sum found and its corresponding level.
        long maxSum = Long.MIN_VALUE; // Initialize with the smallest possible long value. Sums can be negative.
        int maxLevel = 0;             // Stores the level number with the maximum sum.
        int currentLevel = 1;         // Tracks the current level number, starting from 1 for the root.

        // Perform BFS level by level.
        while (!queue.isEmpty()) {
            // Get the number of nodes at the current level.
            int levelSize = queue.size();
            // Initialize sum for the current level. Use long to prevent potential overflow
            // as sum of 10^4 nodes with value 10^5 can be 10^9, which fits in int, but
            // using long is safer for larger potential sums or different constraints.
            long currentLevelSum = 0;

            // Iterate through all nodes at the current level.
            for (int i = 0; i < levelSize; i++) {
                // Dequeue a node from the front of the queue.
                TreeNode node = queue.poll();
                // Add its value to the current level's sum.
                currentLevelSum += node.val;

                // Enqueue the left child if it exists.
                if (node.left != null) {
                    queue.offer(node.left);
                }
                // Enqueue the right child if it exists.
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }

            // After processing all nodes at the current level, compare its sum with maxSum.
            // We use '>' to ensure that if multiple levels have the same maximum sum,
            // we pick the smallest level number (the one encountered first).
            if (currentLevelSum > maxSum) {
                maxSum = currentLevelSum; // Update maxSum.
                maxLevel = currentLevel;  // Update maxLevel.
            }

            // Move to the next level.
            currentLevel++;
        }

        // Return the level with the maximum sum.
        return maxLevel;
    }
}