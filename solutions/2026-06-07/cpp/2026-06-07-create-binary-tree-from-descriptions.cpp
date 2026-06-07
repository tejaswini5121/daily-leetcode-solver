```cpp
/**
 * Problem: Create Binary Tree From Descriptions
 *
 * Given a 2D array of descriptions, construct a binary tree. Each description
 * specifies a parent, a child, and whether the child is the left or right child.
 * Return the root of the constructed binary tree.
 *
 * Link: https://leetcode.com/problems/create-binary-tree-from-descriptions/
 *
 * Approach:
 * 1. Use a hash map (unordered_map) to store TreeNode pointers, keyed by their values.
 *    This allows efficient lookup and creation of nodes.
 * 2. Maintain a set of all child node values. This will help us identify the root node,
 *    as the root is the only node that is a parent but never a child.
 * 3. Iterate through the descriptions:
 *    a. For each description [parentVal, childVal, isLeft]:
 *       i. Get or create the parent node.
 *       ii. Get or create the child node.
 *       iii. Add the childVal to the set of children.
 *       iv. Link the child to the parent based on isLeft.
 * 4. After processing all descriptions, iterate through the parent nodes (keys in the node map).
 *    The node whose value is NOT present in the set of children is the root.
 * 5. Return the root node.
 *
 * Time Complexity: O(N), where N is the number of descriptions.
 *   - We iterate through descriptions once to build the tree and populate the sets.
 *   - Finding the root involves iterating through parent nodes, at most N nodes.
 *   - Hash map operations (insertion, lookup) are O(1) on average.
 *
 * Space Complexity: O(N), where N is the number of descriptions.
 *   - The hash map `nodeMap` stores at most N unique nodes.
 *   - The set `children` stores at most N unique child values.
 */

#include <vector>
#include <unordered_map>
#include <unordered_set>

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    TreeNode* createBinaryTree(std::vector<std::vector<int>>& descriptions) {
        // Map to store TreeNode pointers, keyed by their integer values.
        // This allows us to quickly find or create a node for a given value.
        std::unordered_map<int, TreeNode*> nodeMap;

        // Set to keep track of all node values that are children.
        // The root node will be the one that is a parent but never a child.
        std::unordered_set<int> children;

        // Iterate through each description to build the tree structure.
        for (const auto& desc : descriptions) {
            int parentVal = desc[0];
            int childVal = desc[1];
            int isLeft = desc[2];

            // Ensure the parent node exists in our map. If not, create it.
            if (nodeMap.find(parentVal) == nodeMap.end()) {
                nodeMap[parentVal] = new TreeNode(parentVal);
            }
            // Ensure the child node exists in our map. If not, create it.
            if (nodeMap.find(childVal) == nodeMap.end()) {
                nodeMap[childVal] = new TreeNode(childVal);
            }

            // Add the child's value to the set of children.
            children.insert(childVal);

            // Get pointers to the parent and child nodes.
            TreeNode* parentNode = nodeMap[parentVal];
            TreeNode* childNode = nodeMap[childVal];

            // Link the child to the parent.
            if (isLeft) {
                // If isLeft is 1, childNode is the left child of parentNode.
                parentNode->left = childNode;
            } else {
                // If isLeft is 0, childNode is the right child of parentNode.
                parentNode->right = childNode;
            }
        }

        TreeNode* root = nullptr;
        // Iterate through all the nodes we've created (which are also parents in at least one description).
        for (auto const& [val, node] : nodeMap) {
            // If a node's value is not present in the 'children' set, it means this node
            // is never a child of any other node. Therefore, it must be the root.
            if (children.find(val) == children.end()) {
                root = node;
                break; // We found the root, no need to continue searching.
            }
        }

        return root;
    }
};
```