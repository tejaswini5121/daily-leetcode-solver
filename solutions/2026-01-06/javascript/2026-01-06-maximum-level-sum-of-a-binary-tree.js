/**
 * @brief Finds the smallest level in a binary tree that has the maximum sum of node values.
 *
 * Problem: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/
 *
 * Approach:
 * We can use Breadth-First Search (BFS) to traverse the tree level by level.
 * We'll maintain a queue for BFS and a variable to keep track of the current level.
 * For each level, we'll iterate through all nodes at that level, calculate their sum,
 * and compare it with the maximum sum found so far. If the current level's sum is greater,
 * we update the maximum sum and the corresponding level.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree.
 * We visit each node exactly once during the BFS traversal.
 *
 * Space Complexity: O(W), where W is the maximum width of the tree.
 * In the worst case (a complete binary tree), the queue can hold up to N/2 nodes,
 * which is proportional to the width of the tree.
 */

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
var maxLevelSum = function(root) {
    // Initialize the maximum sum found so far to negative infinity.
    // This ensures that the sum of the first level will always be greater.
    let maxSum = -Infinity;
    // Initialize the level corresponding to the maximum sum.
    // The root is at level 1.
    let maxLevel = 0;
    // Initialize the current level to 1.
    let currentLevel = 1;

    // Use a queue for Breadth-First Search (BFS).
    // Start with the root node.
    const queue = [root];

    // Continue BFS as long as there are nodes in the queue.
    while (queue.length > 0) {
        // Get the number of nodes at the current level.
        // This is important to process nodes level by level.
        const levelSize = queue.length;
        // Initialize the sum of node values for the current level.
        let currentLevelSum = 0;

        // Iterate through all nodes at the current level.
        for (let i = 0; i < levelSize; i++) {
            // Dequeue the first node from the queue.
            const currentNode = queue.shift();

            // Add the current node's value to the sum for this level.
            currentLevelSum += currentNode.val;

            // If the current node has a left child, enqueue it for the next level.
            if (currentNode.left !== null) {
                queue.push(currentNode.left);
            }
            // If the current node has a right child, enqueue it for the next level.
            if (currentNode.right !== null) {
                queue.push(currentNode.right);
            }
        }

        // After processing all nodes at the current level, compare its sum
        // with the maximum sum found so far.
        if (currentLevelSum > maxSum) {
            // If the current level's sum is greater, update maxSum and maxLevel.
            maxSum = currentLevelSum;
            maxLevel = currentLevel;
        }

        // Move to the next level.
        currentLevel++;
    }

    // Return the level with the maximum sum.
    return maxLevel;
};
```