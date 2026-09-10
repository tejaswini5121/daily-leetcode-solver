```cpp
/**
 * @brief Counts the number of nodes in a binary tree whose value equals the average of their subtree.
 * 
 * @link https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree/
 * 
 * @approach
 * We can use a Depth-First Search (DFS) approach to solve this problem.
 * For each node, we need to calculate the sum of all values in its subtree and the count of nodes in its subtree.
 * A post-order traversal is suitable for this. We define a recursive helper function that returns a pair:
 * {sum of subtree, count of subtree nodes}.
 * Inside the helper function:
 * 1. Recursively call the function for the left child and store its results.
 * 2. Recursively call the function for the right child and store its results.
 * 3. Calculate the current node's subtree sum by adding its own value to the sums returned from its children.
 * 4. Calculate the current node's subtree node count by adding 1 (for the current node) to the counts returned from its children.
 * 5. Calculate the average of the current subtree: sum / count.
 * 6. If the node's value equals this average, increment a global counter.
 * 7. Return the calculated subtree sum and count for the current node.
 * 
 * The base case for the recursion is a null node, which returns {0, 0}.
 * 
 * @time_complexity O(N), where N is the number of nodes in the tree. Each node is visited exactly once during the DFS traversal.
 * @space_complexity O(H), where H is the height of the tree. This is due to the recursion stack depth. In the worst case (a skewed tree), H can be N. In the best case (a balanced tree), H is log N.
 */

#include <iostream>
#include <vector>
#include <numeric>

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
    int count = 0; // Global counter to store the number of nodes that satisfy the condition.

    // Helper function for DFS traversal.
    // Returns a pair: {sum of subtree, count of nodes in subtree}.
    std::pair<int, int> dfs(TreeNode* node) {
        // Base case: if the node is null, return {0, 0} (no sum, no nodes).
        if (!node) {
            return {0, 0};
        }

        // Recursively call DFS for the left child.
        std::pair<int, int> left_subtree_info = dfs(node->left);
        // Recursively call DFS for the right child.
        std::pair<int, int> right_subtree_info = dfs(node->right);

        // Calculate the sum of the current subtree.
        // It's the current node's value + sum from the left subtree + sum from the right subtree.
        int current_subtree_sum = node->val + left_subtree_info.first + right_subtree_info.first;
        
        // Calculate the count of nodes in the current subtree.
        // It's 1 (for the current node) + count from the left subtree + count from the right subtree.
        int current_subtree_count = 1 + left_subtree_info.second + right_subtree_info.second;

        // Calculate the average of the current subtree.
        // The problem states to round down to the nearest integer, which integer division naturally does.
        int average = current_subtree_sum / current_subtree_count;

        // Check if the current node's value is equal to the calculated average.
        if (node->val == average) {
            count++; // If it is, increment the global counter.
        }

        // Return the sum and count of the current subtree for its parent to use.
        return {current_subtree_sum, current_subtree_count};
    }

    // Main function to count nodes equal to the average of their subtree.
    int averageOfSubtree(TreeNode* root) {
        count = 0; // Reset the counter for each new call.
        dfs(root); // Start the DFS traversal from the root.
        return count; // Return the final count.
    }
};
```