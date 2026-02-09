// Problem: Balance a Binary Search Tree
// Link: https://leetcode.com/problems/balance-a-binary-search-tree/
// Approach:
// 1. Perform an in-order traversal of the given BST to get a sorted list of node values.
//    An in-order traversal of a BST naturally produces a sorted sequence.
// 2. Construct a balanced BST from the sorted list using a recursive helper function.
//    This function will work like building a BST from a sorted array. The middle element
//    of the sorted list becomes the root of the current subtree. The left half of the
//    list forms the left subtree, and the right half forms the right subtree.
//    This divide-and-conquer approach ensures that the resulting BST is balanced because
//    each subtree's root is chosen to be the median of its respective sorted segment.
// Time Complexity: O(N), where N is the number of nodes in the BST.
//    - In-order traversal takes O(N) time.
//    - Building the new BST from the sorted list takes O(N) time, as each node is visited once.
// Space Complexity: O(N), where N is the number of nodes in the BST.
//    - O(N) for storing the sorted list of node values.
//    - O(log N) on average (O(N) in the worst case for a skewed tree) for the recursion stack during in-order traversal.
//    - O(log N) on average (O(N) in the worst case for a skewed tree) for the recursion stack during the construction of the balanced BST.
//    The dominant factor is O(N) for the list.

import java.util.ArrayList;
import java.util.List;

/**
 * Definition for a binary tree node.
 */
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
     * Balances a given Binary Search Tree.
     *
     * @param root The root of the input Binary Search Tree.
     * @return The root of the balanced Binary Search Tree.
     */
    public TreeNode balanceBST(TreeNode root) {
        // List to store node values in sorted order from in-order traversal.
        List<Integer> sortedValues = new ArrayList<>();

        // Perform in-order traversal to get sorted node values.
        inOrderTraversal(root, sortedValues);

        // Build a balanced BST from the sorted list.
        return buildBalancedBST(sortedValues, 0, sortedValues.size() - 1);
    }

    /**
     * Performs an in-order traversal of the BST and collects node values into a list.
     *
     * @param node The current node in the traversal.
     * @param values The list to store the sorted node values.
     */
    private void inOrderTraversal(TreeNode node, List<Integer> values) {
        // Base case: if the node is null, return.
        if (node == null) {
            return;
        }

        // Traverse the left subtree.
        inOrderTraversal(node.left, values);
        // Add the current node's value to the list.
        values.add(node.val);
        // Traverse the right subtree.
        inOrderTraversal(node.right, values);
    }

    /**
     * Recursively builds a balanced BST from a sorted list of values.
     * The middle element becomes the root, and the left/right halves form subtrees.
     *
     * @param values The sorted list of node values.
     * @param start  The starting index of the current sublist.
     * @param end    The ending index of the current sublist.
     * @return The root of the balanced subtree.
     */
    private TreeNode buildBalancedBST(List<Integer> values, int start, int end) {
        // Base case: if the start index is greater than the end index, it means this
        // sublist is empty, so return null (representing an empty subtree).
        if (start > end) {
            return null;
        }

        // Find the middle index of the current sublist. This element will become the root
        // of the current subtree to ensure balance.
        int mid = start + (end - start) / 2;

        // Create a new TreeNode with the value at the middle index.
        TreeNode root = new TreeNode(values.get(mid));

        // Recursively build the left subtree from the elements before the middle element.
        root.left = buildBalancedBST(values, start, mid - 1);
        // Recursively build the right subtree from the elements after the middle element.
        root.right = buildBalancedBST(values, mid + 1, end);

        // Return the constructed root of the balanced subtree.
        return root;
    }
}
