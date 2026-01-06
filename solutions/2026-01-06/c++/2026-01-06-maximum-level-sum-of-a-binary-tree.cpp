// Problem Summary: Find the level in a binary tree that has the maximum sum of node values. If multiple levels have the same maximum sum, return the smallest (earliest) such level number. The root is at level 1.
// Link: https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/
// Approach Explanation: We use a Breadth-First Search (BFS) approach. BFS naturally processes a tree level by level. We maintain a queue for nodes to visit. In each iteration, we process all nodes currently in the queue, which represent a single level of the tree. While processing a level, we sum up node values. After processing all nodes for a level, we compare its sum with the maximum sum found so far. If the current level's sum is greater, we update the maximum sum and the corresponding level number. We keep track of the current level using a counter.
// Time Complexity: O(N), where N is the number of nodes in the binary tree. Each node is visited and processed exactly once (enqueued and dequeued).
// Space Complexity: O(W), where W is the maximum width of the tree. In the worst case (e.g., a complete binary tree), W can be N/2, so the space complexity can be O(N) for storing nodes in the queue.

#include <queue>      // Required for std::queue
#include <limits>     // Required for std::numeric_limits<long long>::min()

// Definition for a binary tree node.
// This struct is typically provided by the LeetCode environment.
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
        // According to constraints, root will always be non-null (1 <= N <= 10^4).
        // If it were possible for root to be null, we might return 0 or throw an exception.
        
        // Initialize a queue for Breadth-First Search (BFS).
        // The queue will store TreeNode pointers, allowing us to traverse level by level.
        std::queue<TreeNode*> q;
        q.push(root); // Start BFS by adding the root node to the queue.

        // Initialize variables to track the maximum sum found across all levels
        // and the level number associated with that maximum sum.
        // We use long long for max_sum to safely handle potential large sums (N * max_node_val).
        // A sum of 10^4 nodes * 10^5 value = 10^9, which fits in int, but long long is safer.
        // Initialize max_sum to the smallest possible long long value because node values can be negative.
        long long max_sum = std::numeric_limits<long long>::min();
        int max_level = 0; // This will store the level number (1-indexed) of the max sum.

        // current_level tracks the level number we are currently processing.
        // The root is level 1, its children are level 2, and so on.
        int current_level = 1;

        // Perform BFS traversal until the queue is empty, meaning all nodes have been visited.
        while (!q.empty()) {
            // Get the number of nodes at the current level.
            // This is crucial to process all nodes of the current level before moving to the next.
            int level_size = q.size();
            long long current_level_sum = 0; // Sum of node values for the current level.

            // Iterate through all nodes currently at the front of the queue (representing the current level).
            for (int i = 0; i < level_size; ++i) {
                TreeNode* node = q.front(); // Get the node at the front of the queue.
                q.pop();                    // Remove it from the queue as it's being processed.

                current_level_sum += node->val; // Add the node's value to the current level's sum.

                // If the node has a left child, add it to the queue for processing in the next level.
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                // If the node has a right child, add it to the queue for processing in the next level.
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }

            // After processing all nodes for the current level, compare its sum with the overall max_sum.
            // If the current level's sum is strictly greater, update max_sum and max_level.
            // The condition `current_level_sum > max_sum` ensures that if two levels have the same
            // maximum sum, we keep the *smallest* level number (the one encountered first).
            if (current_level_sum > max_sum) {
                max_sum = current_level_sum;
                max_level = current_level;
            }

            // Increment current_level to prepare for processing the next level.
            current_level++;
        }

        // Return the level number that had the maximum sum.
        return max_level;
    }
};