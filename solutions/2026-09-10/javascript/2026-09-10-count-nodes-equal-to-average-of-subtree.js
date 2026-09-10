/**
 * @file LeetCode Problem: Count Nodes Equal to Average of Subtree
 * @author Your Name
 * @link https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree/
 * @summary Counts nodes whose value equals the average of their subtree.
 *
 * Approach:
 * We can use a Depth-First Search (DFS) approach to traverse the tree. For each node,
 * we need to calculate the sum of values and the count of nodes in its subtree.
 * A recursive DFS function can return a pair: [sum of subtree, count of subtree].
 * Inside the DFS function, we recursively call it for the left and right children.
 * The current node's sum will be its value plus the sums from its children.
 * The current node's count will be 1 plus the counts from its children.
 * After calculating the subtree sum and count for a node, we check if the node's value
 * is equal to the floor of (subtree sum / subtree count). If it is, we increment a global counter.
 *
 * Time Complexity:
 * O(N), where N is the number of nodes in the tree. We visit each node exactly once
 * during the DFS traversal. For each node, we perform constant time operations (addition, division, comparison).
 *
 * Space Complexity:
 * O(H), where H is the height of the tree. This is due to the recursion stack depth.
 * In the worst case (a skewed tree), H can be N, resulting in O(N) space.
 * In the best case (a balanced tree), H is logN, resulting in O(logN) space.
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

// Global variable to store the count of nodes that satisfy the condition.
let count = 0;

/**
 * Counts nodes where the node's value is equal to the average of its subtree.
 * @param {TreeNode} root The root of the binary tree.
 * @return {number} The number of nodes satisfying the condition.
 */
var averageOfSubtree = function(root) {
    // Reset the global count for each new test case.
    count = 0;
    // Start the DFS traversal from the root.
    dfs(root);
    // Return the final count.
    return count;
};

/**
 * Performs a Depth-First Search traversal to calculate subtree sums, counts,
 * and check the average condition for each node.
 * @param {TreeNode} node The current node being visited.
 * @return {[number, number]} A pair containing [sum of subtree, count of subtree].
 */
function dfs(node) {
    // Base case: If the node is null, it contributes 0 sum and 0 count.
    if (!node) {
        return [0, 0];
    }

    // Recursively call DFS for the left and right children.
    const [leftSum, leftCount] = dfs(node.left);
    const [rightSum, rightCount] = dfs(node.right);

    // Calculate the total sum of the current node's subtree.
    // It's the current node's value plus the sums from its left and right subtrees.
    const currentSum = node.val + leftSum + rightSum;

    // Calculate the total count of nodes in the current node's subtree.
    // It's 1 (for the current node) plus the counts from its left and right subtrees.
    const currentCount = 1 + leftCount + rightCount;

    // Calculate the average of the subtree, rounded down.
    const average = Math.floor(currentSum / currentCount);

    // Check if the current node's value is equal to the calculated average.
    if (node.val === average) {
        // If it is, increment the global count.
        count++;
    }

    // Return the sum and count of the current subtree to its parent.
    return [currentSum, currentCount];
}
