// Problem: Maximum Level Sum of a Binary Tree
// Link: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/
//
// Approach:
// We can use Breadth-First Search (BFS) to traverse the tree level by level.
// We will maintain a queue for BFS and a variable to keep track of the current level.
// For each level, we calculate the sum of node values.
// We also keep track of the maximum sum found so far and the corresponding level.
// If the current level's sum is greater than the maximum sum, we update the maximum sum and the result level.
// If the current level's sum is equal to the maximum sum, we update the result level only if the current level is smaller than the current result level (to satisfy the "smallest level" requirement).
//
// Time Complexity: O(N), where N is the number of nodes in the tree.
// Each node is visited exactly once during the BFS traversal.
//
// Space Complexity: O(W), where W is the maximum width of the tree.
// In the worst case (a complete binary tree), the queue can hold up to N/2 nodes,
// resulting in O(N) space. For a skewed tree, it can be O(1).
//

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
#include <queue>
#include <vector>
#include <limits>

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
    int maxLevelSum(TreeNode* root) {
        // Initialize the maximum sum found so far to the smallest possible integer value.
        // This ensures that any sum from the tree will be greater.
        int maxSum = std::numeric_limits<int>::min();
        // Initialize the result level to 0. This will be updated as we find maximum sums.
        int resultLevel = 0;
        // Initialize the current level to 0. We will increment it as we process each level.
        int currentLevel = 0;

        // Use a queue for Breadth-First Search (BFS).
        // The queue will store tree nodes to be visited.
        std::queue<TreeNode*> q;

        // If the root is null, it's an empty tree, so return 0 (or handle as per problem constraints, though constraints say at least 1 node).
        if (root == nullptr) {
            return 0;
        }

        // Start BFS by adding the root node to the queue.
        q.push(root);

        // Continue BFS as long as the queue is not empty.
        while (!q.empty()) {
            // Increment the current level. The root is at level 1.
            currentLevel++;
            // Get the number of nodes at the current level. This is important for processing all nodes of a single level before moving to the next.
            int levelSize = q.size();
            // Initialize the sum for the current level.
            int currentSum = 0;

            // Process all nodes at the current level.
            for (int i = 0; i < levelSize; ++i) {
                // Dequeue the front node from the queue.
                TreeNode* currentNode = q.front();
                q.pop();

                // Add the value of the current node to the current level's sum.
                currentSum += currentNode->val;

                // Enqueue the left child if it exists.
                if (currentNode->left != nullptr) {
                    q.push(currentNode->left);
                }
                // Enqueue the right child if it exists.
                if (currentNode->right != nullptr) {
                    q.push(currentNode->right);
                }
            }

            // After processing all nodes at the current level, check if its sum is the maximum found so far.
            // If the current level's sum is greater than the maximum sum found so far,
            // update maxSum and resultLevel.
            if (currentSum > maxSum) {
                maxSum = currentSum;
                resultLevel = currentLevel;
            }
            // If the current level's sum is equal to the maximum sum found so far,
            // we need to ensure we return the *smallest* level. Since we are processing
            // levels in increasing order (1, 2, 3, ...), if we encounter a sum that
            // equals the maxSum, the currentLevel will inherently be larger than the
            // previously recorded resultLevel for that maxSum. Therefore, we don't
            // need an explicit check for `currentSum == maxSum` and updating `resultLevel`
            // because the `currentSum > maxSum` condition handles finding the first
            // occurrence of the maximal sum at the smallest level.
            // The logic `if (currentSum > maxSum)` already correctly prioritizes smaller levels.
        }

        // Return the level with the maximum sum.
        return resultLevel;
    }
};
