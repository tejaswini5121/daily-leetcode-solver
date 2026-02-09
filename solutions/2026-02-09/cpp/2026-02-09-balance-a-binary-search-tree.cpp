// Problem Summary: Rebalance a given Binary Search Tree to ensure its height is balanced.
// Link: https://leetcode.com/problems/balance-a-binary-search-tree/
// Approach:
// 1. Perform an in-order traversal of the given BST to get a sorted list of all node values.
// 2. Construct a new balanced BST from this sorted list using a recursive approach.
//    - The middle element of the sorted list will be the root of the balanced BST.
//    - Recursively build the left subtree from the left half of the list.
//    - Recursively build the right subtree from the right half of the list.
// Time Complexity: O(N), where N is the number of nodes.
//    - In-order traversal takes O(N) time.
//    - Building the new BST from a sorted array takes O(N) time.
// Space Complexity: O(N)
//    - To store the sorted list of node values.
//    - The recursion depth for building the BST can be O(log N) for a balanced tree, but O(N) in the worst case if the input BST is skewed. However, the primary space contributor is the auxiliary array.

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    // Main function to balance the BST
    TreeNode* balanceBST(TreeNode* root) {
        // Step 1: Perform in-order traversal to get sorted node values
        std::vector<int> sorted_nodes;
        inOrderTraversal(root, sorted_nodes);

        // Step 2: Construct a balanced BST from the sorted list
        return buildBalancedBST(sorted_nodes, 0, sorted_nodes.size() - 1);
    }

private:
    // Helper function to perform in-order traversal and store values in a vector
    void inOrderTraversal(TreeNode* node, std::vector<int>& sorted_nodes) {
        // Base case: if the node is null, return
        if (!node) {
            return;
        }
        // Traverse left subtree
        inOrderTraversal(node->left, sorted_nodes);
        // Visit current node (add its value to the vector)
        sorted_nodes.push_back(node->val);
        // Traverse right subtree
        inOrderTraversal(node->right, sorted_nodes);
    }

    // Helper function to build a balanced BST from a sorted vector
    // This function uses a recursive divide and conquer approach.
    // The middle element of the current sub-array becomes the root,
    // and its left and right children are built recursively from the
    // left and right halves of the sub-array respectively.
    TreeNode* buildBalancedBST(const std::vector<int>& sorted_nodes, int start, int end) {
        // Base case: if the start index is greater than the end index,
        // it means the sub-array is empty, so return nullptr.
        if (start > end) {
            return nullptr;
        }

        // Calculate the middle index of the current sub-array.
        // This element will be the root of the current subtree.
        int mid = start + (end - start) / 2;

        // Create a new TreeNode with the value at the middle index.
        TreeNode* root = new TreeNode(sorted_nodes[mid]);

        // Recursively build the left subtree using the elements from 'start' to 'mid - 1'.
        root->left = buildBalancedBST(sorted_nodes, start, mid - 1);

        // Recursively build the right subtree using the elements from 'mid + 1' to 'end'.
        root->right = buildBalancedBST(sorted_nodes, mid + 1, end);

        // Return the root of the newly constructed balanced subtree.
        return root;
    }
};
```