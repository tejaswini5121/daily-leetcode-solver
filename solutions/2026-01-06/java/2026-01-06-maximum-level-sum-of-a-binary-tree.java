/**
 * Problem Summary: Find the level in a binary tree with the maximum sum of node values.
 * Problem Link: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/
 *
 * Approach:
 * We can solve this problem using Breadth-First Search (BFS). BFS naturally processes the tree level by level.
 * We'll maintain a queue for BFS and a variable to keep track of the current level.
 * For each level, we'll iterate through all nodes at that level, sum their values, and compare this sum
 * with the maximum sum found so far. If the current level's sum is greater, we update the maximum sum
 * and the corresponding level.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree. Each node is visited exactly once during the BFS.
 * Space Complexity: O(W), where W is the maximum width of the tree. In the worst case (a complete binary tree),
 *                  the space complexity can be O(N/2), which is O(N).
 */

import java.util.LinkedList;
import java.util.Queue;

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

class Solution {
    /**
     * Finds the smallest level x such that the sum of all the values of nodes at level x is maximal.
     *
     * @param root The root of the binary tree.
     * @return The smallest level with the maximum sum.
     */
    public int maxLevelSum(TreeNode root) {
        // Initialize variables to store the maximum sum found so far and the level at which it occurred.
        int maxSum = Integer.MIN_VALUE; // Start with the smallest possible integer value.
        int maxLevel = 1;              // The root is at level 1.

        // Initialize a queue for BFS. A LinkedList implements the Queue interface.
        Queue<TreeNode> queue = new LinkedList<>();
        // Add the root node to the queue to start the BFS.
        queue.offer(root);

        // Initialize the current level counter.
        int currentLevel = 1;

        // Continue BFS as long as there are nodes in the queue.
        while (!queue.isEmpty()) {
            // Get the number of nodes at the current level.
            // This is crucial for processing one level at a time.
            int levelSize = queue.size();
            // Initialize the sum for the current level.
            int currentSum = 0;

            // Iterate through all nodes at the current level.
            for (int i = 0; i < levelSize; i++) {
                // Dequeue a node from the front of the queue.
                TreeNode currentNode = queue.poll();
                // Add the value of the current node to the sum for this level.
                currentSum += currentNode.val;

                // Enqueue the left child if it exists.
                if (currentNode.left != null) {
                    queue.offer(currentNode.left);
                }
                // Enqueue the right child if it exists.
                if (currentNode.right != null) {
                    queue.offer(currentNode.right);
                }
            }

            // After processing all nodes at the current level, compare its sum with the maximum sum found so far.
            // If the current level's sum is greater than the maxSum, update maxSum and maxLevel.
            // We use '>' to ensure we return the *smallest* level if there's a tie in sums.
            if (currentSum > maxSum) {
                maxSum = currentSum;
                maxLevel = currentLevel;
            }

            // Move to the next level.
            currentLevel++;
        }

        // Return the level with the maximum sum.
        return maxLevel;
    }
}
