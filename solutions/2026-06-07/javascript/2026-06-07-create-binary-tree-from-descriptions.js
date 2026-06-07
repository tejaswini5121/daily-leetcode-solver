/**
 * @param {number[][]} descriptions
 * @return {TreeNode}
 */
// Problem: Create Binary Tree From Descriptions
// Link: https://leetcode.com/problems/create-binary-tree-from-descriptions/
// Approach:
// 1. Use a map to store TreeNode objects for each value encountered. This allows for efficient lookup and creation of nodes.
// 2. Maintain a set of all child nodes. The root node will be the one that is a parent but not a child of any other node.
// 3. Iterate through the descriptions. For each [parent, child, isLeft]:
//    a. Get or create the parent and child TreeNode objects from the map.
//    b. If isLeft is 1, set the child as the left child of the parent.
//    c. If isLeft is 0, set the child as the right child of the parent.
//    d. Add the child's value to the set of children.
// 4. After processing all descriptions, iterate through the parent nodes stored in the map. The node whose value is not present in the set of children is the root.
//
// Time Complexity: O(N), where N is the number of descriptions. We iterate through the descriptions once to build the tree and once to find the root. Map operations (get, set) take O(1) on average.
// Space Complexity: O(N), where N is the number of unique node values. This is due to the map storing TreeNode objects and the set storing child node values.
//
// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

var createBinaryTree = function(descriptions) {
    // Map to store TreeNode objects, keyed by their values.
    const nodeMap = new Map();
    // Set to store the values of all children. This helps in identifying the root node.
    const children = new Set();

    // Helper function to get or create a TreeNode from the map.
    const getNode = (val) => {
        if (!nodeMap.has(val)) {
            nodeMap.set(val, new TreeNode(val));
        }
        return nodeMap.get(val);
    };

    // Iterate through each description to build the tree structure.
    for (const [parentVal, childVal, isLeft] of descriptions) {
        // Get or create the parent and child nodes.
        const parentNode = getNode(parentVal);
        const childNode = getNode(childVal);

        // Add the child's value to the set of children.
        children.add(childVal);

        // Set the child as either the left or right child of the parent.
        if (isLeft === 1) {
            parentNode.left = childNode;
        } else {
            parentNode.right = childNode;
        }
    }

    // Find the root node. The root node is the one that is a parent but never a child.
    let root = null;
    // Iterate through all the nodes that were created (i.e., keys in the nodeMap).
    for (const [val, node] of nodeMap.entries()) {
        // If a node's value is not in the children set, it means it has no parent, so it's the root.
        if (!children.has(val)) {
            root = node;
            break; // Found the root, no need to continue searching.
        }
    }

    // Return the identified root node.
    return root;
};
```