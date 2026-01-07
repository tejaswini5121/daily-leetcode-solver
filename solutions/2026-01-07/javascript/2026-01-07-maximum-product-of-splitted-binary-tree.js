/**
 * Problem: Maximum Product of Splitted Binary Tree
 * Summary: Find the maximum product of subtree sums after removing one edge.
 * Link: https://leetcode.com/problems/maximum-product-of-splitted-binary-tree/
 *
 * Approach:
 * The core idea is to calculate the sum of all nodes in the tree first.
 * Then, we can perform a second traversal (DFS) to calculate the sum of each subtree.
 * For each subtree, if we cut the edge connecting it to its parent, the sum of the other
 * part of the tree will be `total_sum - subtree_sum`. We then calculate the product
 * `subtree_sum * (total_sum - subtree_sum)` and keep track of the maximum product found.
 *
 * To avoid recalculating subtree sums multiple times and to efficiently get the `total_sum`,
 * we can use a two-pass DFS approach.
 *
 * Pass 1: Calculate the total sum of all nodes in the tree.
 * Pass 2: Perform DFS. For each node, calculate its subtree sum. During this traversal,
 * for every subtree sum encountered (except the whole tree itself, which we don't cut an edge from),
 * calculate the potential product: `subtree_sum * (total_sum - subtree_sum)`. Update the global
 * maximum product.
 *
 * The modulo operation `10^9 + 7` should be applied to the final result, but importantly,
 * the maximization should happen *before* applying the modulo.
 *
 * Time Complexity: O(N), where N is the number of nodes in the tree.
 * We perform two DFS traversals, each visiting every node once.
 *
 * Space Complexity: O(H), where H is the height of the tree.
 * This is due to the recursion stack for DFS. In the worst case (a skewed tree), H can be N.
 * In the best case (a balanced tree), H is log N.
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

// Global variables to store the total sum and maximum product.
let totalSum = 0;
let maxProduct = 0;
const MOD = 10 ** 9 + 7;

/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxProduct = function(root) {
    // Reset global variables for each test case.
    totalSum = 0;
    maxProduct = 0;

    // First DFS to calculate the total sum of the tree.
    calculateTotalSum(root);

    // Second DFS to find the maximum product.
    // We pass totalSum to the second DFS.
    calculateMaxProduct(root, totalSum);

    // Return the maximum product modulo 10^9 + 7.
    // Note: The maximization happened before applying modulo.
    return maxProduct % MOD;
};

/**
 * Helper function to calculate the sum of all nodes in the tree.
 * @param {TreeNode} node The current node.
 */
function calculateTotalSum(node) {
    // Base case: if the node is null, its sum is 0.
    if (!node) {
        return 0;
    }

    // Recursively calculate the sum of the left and right subtrees.
    const leftSum = calculateTotalSum(node.left);
    const rightSum = calculateTotalSum(node.right);

    // The sum of the current subtree is the node's value plus the sums of its children.
    const currentSubtreeSum = node.val + leftSum + rightSum;

    // Add the current subtree sum to the global total sum.
    totalSum += currentSubtreeSum;

    // Return the sum of the current subtree.
    return currentSubtreeSum;
}

/**
 * Helper function to perform DFS and calculate the maximum product.
 * @param {TreeNode} node The current node.
 * @param {number} totalSum The sum of all nodes in the original tree.
 * @returns {number} The sum of the current subtree.
 */
function calculateMaxProduct(node, totalSum) {
    // Base case: if the node is null, its sum is 0.
    if (!node) {
        return 0;
    }

    // Recursively calculate the sum of the left and right subtrees.
    const leftSum = calculateMaxProduct(node.left, totalSum);
    const rightSum = calculateMaxProduct(node.right, totalSum);

    // The sum of the current subtree is the node's value plus the sums of its children.
    const currentSubtreeSum = node.val + leftSum + rightSum;

    // If we cut the edge above this `currentSubtreeSum`, the other part of the tree
    // will have a sum of `totalSum - currentSubtreeSum`.
    // Calculate the product and update `maxProduct` if it's greater.
    // We consider `currentSubtreeSum` and `totalSum - currentSubtreeSum` as the two subtree sums.
    const potentialProduct = currentSubtreeSum * (totalSum - currentSubtreeSum);
    maxProduct = Math.max(maxProduct, potentialProduct);

    // Return the sum of the current subtree.
    return currentSubtreeSum;
}
```