/**
 * Problem: Create Binary Tree From Descriptions
 * Link: https://leetcode.com/problems/create-binary-tree-from-descriptions/
 *
 * Summary:
 * This problem asks us to construct a binary tree given a list of parent-child
 * relationships with information about whether the child is left or right.
 * We need to identify the root and build the tree structure.
 *
 * Approach:
 * 1. Identify all unique node values to easily create TreeNode objects as needed.
 * 2. Use two hash maps:
 *    - `nodeMap`: To store TreeNode objects for each value, so we can quickly
 *                 access or create them.
 *    - `parentSet`: To keep track of all values that are children. This helps
 *                   us identify the root node, which is the value that is never
 *                   a child.
 * 3. Iterate through the `descriptions` array:
 *    - For each description `[parentVal, childVal, isLeft]`:
 *      - Get or create the TreeNode for `parentVal` from `nodeMap`.
 *      - Get or create the TreeNode for `childVal` from `nodeMap`.
 *      - If `isLeft` is 1, set the left child of the parent node to the child node.
 *      - If `isLeft` is 0, set the right child of the parent node to the child node.
 *      - Add `childVal` to the `parentSet`.
 * 4. After processing all descriptions, iterate through the keys in `nodeMap`.
 *    The key that is not present in `parentSet` is the root of the tree.
 * 5. Return the TreeNode corresponding to the root value.
 *
 * Time Complexity:
 * O(N), where N is the number of descriptions.
 * We iterate through the descriptions once to build the tree.
 * We iterate through the unique node values (at most 2N) to find the root.
 * Map operations (put, get, containsKey) are O(1) on average.
 *
 * Space Complexity:
 * O(N), where N is the number of unique node values.
 * The `nodeMap` can store up to 2N nodes.
 * The `parentSet` can store up to N child values.
 */

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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
     * Constructs a binary tree from a given list of descriptions.
     *
     * @param descriptions A 2D integer array where descriptions[i] = [parenti, childi, isLefti]
     *                     indicates that parenti is the parent of childi, and isLefti determines
     *                     if childi is the left (1) or right (0) child.
     * @return The root node of the constructed binary tree.
     */
    public TreeNode createBinaryTree(int[][] descriptions) {
        // Map to store TreeNode objects for each value. Key: node value, Value: TreeNode object.
        Map<Integer, TreeNode> nodeMap = new HashMap<>();
        // Set to store all values that appear as children. This helps identify the root.
        Set<Integer> childSet = new HashSet<>();

        // Iterate through each description to build the tree structure.
        for (int[] description : descriptions) {
            int parentVal = description[0];
            int childVal = description[1];
            int isLeft = description[2];

            // Get or create the parent TreeNode.
            // The computeIfAbsent method is used here for conciseness:
            // if parentVal is already a key, it returns its value; otherwise, it
            // creates a new TreeNode with parentVal and puts it into the map,
            // then returns the new TreeNode.
            TreeNode parentNode = nodeMap.computeIfAbsent(parentVal, TreeNode::new);

            // Get or create the child TreeNode.
            TreeNode childNode = nodeMap.computeIfAbsent(childVal, TreeNode::new);

            // Set the child as either the left or right child of the parent.
            if (isLeft == 1) {
                parentNode.left = childNode;
            } else {
                parentNode.right = childNode;
            }

            // Add the child's value to the childSet.
            childSet.add(childVal);
        }

        // Find the root node. The root is the node value that is present in nodeMap
        // but NOT present in childSet (i.e., it's never a child).
        TreeNode root = null;
        for (int val : nodeMap.keySet()) {
            if (!childSet.contains(val)) {
                root = nodeMap.get(val);
                break; // Found the root, no need to check further.
            }
        }

        // Return the root of the constructed binary tree.
        return root;
    }
}