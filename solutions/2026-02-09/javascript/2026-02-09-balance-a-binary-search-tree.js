// Problem: Balance a Binary Search Tree
// Link: https://leetcode.com/problems/balance-a-binary-search-tree/
//
// Approach:
// The problem asks us to rebalance a given Binary Search Tree (BST) so that it becomes balanced,
// meaning the heights of the two subtrees of any node never differ by more than 1.
//
// The core idea is to leverage the properties of a BST. An in-order traversal of a BST
// visits nodes in ascending order. If we perform an in-order traversal and store all the
// node values in an array, this array will be sorted.
//
// Once we have a sorted array of all node values, we can construct a balanced BST
// from this sorted array. A common and effective way to build a balanced BST from a
// sorted array is to use a recursive divide and conquer approach.
//
// 1. In-order Traversal:
//    - Define a recursive function (e.g., `inorder`) that performs an in-order traversal
//      of the input BST.
//    - During the traversal, append each node's value to a list (e.g., `sortedValues`).
//
// 2. Build Balanced BST from Sorted Array:
//    - Define another recursive function (e.g., `buildBalancedBST`) that takes a
//      subarray (defined by start and end indices) of the `sortedValues` array as input.
//    - Base Case: If the start index is greater than the end index, it means the subarray
//      is empty, so return `null`.
//    - Recursive Step:
//      - Find the middle index of the current subarray.
//      - Create a new `TreeNode` with the value at the middle index. This node will be
//        the root of the current subtree.
//      - Recursively build the left subtree by calling `buildBalancedBST` on the
//        left half of the subarray (from `start` to `mid - 1`).
//      - Recursively build the right subtree by calling `buildBalancedBST` on the
//        right half of the subarray (from `mid + 1` to `end`).
//      - Assign the returned left and right subtrees to the `left` and `right`
//        properties of the current node.
//      - Return the current node.
//
// The initial call to `buildBalancedBST` will be with the entire `sortedValues` array.
//
// Time Complexity:
// - In-order Traversal: O(N), where N is the number of nodes in the BST, because we visit each node exactly once.
// - Building Balanced BST from Sorted Array: O(N), because we create N nodes and each node creation involves a constant amount of work. The recursive calls effectively partition the array, leading to a structure that is balanced.
// - Overall Time Complexity: O(N) + O(N) = O(N).
//
// Space Complexity:
// - Storing Sorted Values: O(N) to store all node values in an array.
// - Recursion Call Stack: O(log N) in the best case (perfectly balanced tree) and O(N) in the worst case (skewed tree) for both traversals and BST construction. However, since we are aiming to build a balanced tree, the recursion depth for building will be O(log N).
// - Overall Space Complexity: O(N) due to the storage of sorted values.
//
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
 * @return {TreeNode}
 */
var balanceBST = function(root) {
    // Array to store node values in sorted order after in-order traversal.
    const sortedValues = [];

    /**
     * Performs an in-order traversal of the BST and populates the sortedValues array.
     * @param {TreeNode} node The current node to visit.
     */
    const inorder = (node) => {
        if (!node) {
            return; // Base case: if the node is null, stop recursion.
        }
        // Recursively traverse the left subtree.
        inorder(node.left);
        // Visit the current node: add its value to the sortedValues array.
        sortedValues.push(node.val);
        // Recursively traverse the right subtree.
        inorder(node.right);
    };

    // Start the in-order traversal from the root to get all values in sorted order.
    inorder(root);

    /**
     * Constructs a balanced BST from a sorted array of values.
     * @param {number} start The starting index of the current subarray.
     * @param {number} end The ending index of the current subarray.
     * @return {TreeNode | null} The root of the balanced BST for the given subarray.
     */
    const buildBalancedBST = (start, end) => {
        // Base case: if the start index is greater than the end index, the subarray is empty.
        if (start > end) {
            return null;
        }

        // Find the middle index of the current subarray.
        // This middle element will become the root of the current subtree, ensuring balance.
        const mid = Math.floor((start + end) / 2);

        // Create a new TreeNode with the value at the middle index.
        const newNode = new TreeNode(sortedValues[mid]);

        // Recursively build the left subtree using the left half of the subarray.
        newNode.left = buildBalancedBST(start, mid - 1);
        // Recursively build the right subtree using the right half of the subarray.
        newNode.right = buildBalancedBST(mid + 1, end);

        // Return the newly created node, which is the root of this balanced subtree.
        return newNode;
    };

    // Build the balanced BST from the sortedValues array.
    // The initial call uses the entire range of the array (from index 0 to the last index).
    return buildBalancedBST(0, sortedValues.length - 1);
};

// Definition for a binary tree node. (Provided for completeness, typically this would be globally available or imported)
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}
