/*
Problem Summary: Find the level in a binary tree with the maximum sum of node values. If multiple levels have the same maximum sum, return the smallest level number.
Problem Link: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/

Approach Explanation:
This problem is a classic application of Breadth-First Search (BFS). BFS naturally explores the tree level by level.
We can use a queue to manage the nodes to visit. At each step, we process all nodes currently in the queue, which represent a single level of the tree.
1. Initialize `maxSum` to a very small number (or the root's value) and `maxLevel` to 1.
2. Initialize `currentLevel` to 1.
3. Create a queue and add the root node to it.
4. While the queue is not empty:
   a. Get the `size` of the queue. This `size` represents the number of nodes at the `currentLevel`.
   b. Initialize `currentLevelSum` to 0.
   c. Iterate `size` times:
      i. Dequeue a node from the front of the queue.
      ii. Add its value to `currentLevelSum`.
      iii. If the node has a left child, enqueue it.
      iv. If the node has a right child, enqueue it.
   d. After processing all nodes at `currentLevel`, compare `currentLevelSum` with `maxSum`.
      If `currentLevelSum` is greater than `maxSum`:
         Update `maxSum = currentLevelSum`.
         Update `maxLevel = currentLevel`.
   e. Increment `currentLevel`.
5. Return `maxLevel`.

Time Complexity: O(N), where N is the number of nodes in the tree.
Each node is enqueued and dequeued exactly once. Processing each node (summing its value, checking for children) takes constant time. Therefore, the total time complexity is proportional to the number of nodes.

Space Complexity: O(W), where W is the maximum width of the tree.
In the worst case (a complete binary tree), the queue can hold up to N/2 nodes at the lowest level. So, the space complexity is proportional to the maximum number of nodes at any single level. In the absolute worst case (a perfectly balanced tree), this is O(N).
*/

// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val);
    this.left = (left===undefined ? null : left);
    this.right = (right===undefined ? null : right);
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxLevelSum = function(root) {
    // If the tree is empty, though constraints say N >= 1, it's good practice.
    if (!root) {
        return 0; // Or throw an error, depending on problem spec for empty tree
    }

    // Initialize variables to keep track of the maximum sum found so far
    // and the level at which that sum occurred.
    // Constraints: -10^5 <= Node.val <= 10^5, N >= 1.
    // The minimum sum for a single node is -10^5. We need a value smaller than any possible sum.
    // Using Number.MIN_SAFE_INTEGER is a robust choice.
    let maxSum = Number.MIN_SAFE_INTEGER; 
    let maxLevel = 1; // According to problem, root is level 1

    // Initialize the current level counter
    let currentLevel = 1;

    // Initialize a queue for BFS. Start by adding the root node.
    let queue = [root];

    // Continue BFS as long as there are nodes in the queue to process
    while (queue.length > 0) {
        // Get the number of nodes at the current level.
        // We process all these nodes before moving to the next level.
        let levelSize = queue.length;
        // Initialize the sum for the current level
        let currentLevelSum = 0;

        // Iterate through all nodes at the current level
        for (let i = 0; i < levelSize; i++) {
            // Dequeue the first node from the queue
            let node = queue.shift();
            // Add its value to the current level's sum
            currentLevelSum += node.val;

            // If the node has a left child, enqueue it for the next level
            if (node.left) {
                queue.push(node.left);
            }
            // If the node has a right child, enqueue it for the next level
            if (node.right) {
                queue.push(node.right);
            }
        }

        // After processing all nodes at the current level,
        // compare its sum with the maximum sum found so far.
        // We return the *smallest* level x if there are ties,
        // so we only update if currentLevelSum is *strictly greater* than maxSum.
        if (currentLevelSum > maxSum) {
            maxSum = currentLevelSum; // Update the maximum sum
            maxLevel = currentLevel;  // Update the level with the maximum sum
        }

        // Move to the next level
        currentLevel++;
    }

    // Return the level with the maximum sum.
    return maxLevel;
};