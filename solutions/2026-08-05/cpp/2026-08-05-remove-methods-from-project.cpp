// Problem: Remove Methods From Project
// Link: https://leetcode.com/problems/remove-methods-from-project/
// Approach:
// 1. Identify all "suspicious" methods. A method is suspicious if it's `k` or if it's invoked (directly or indirectly) by `k`. This can be found using a graph traversal (DFS or BFS) starting from `k`.
// 2. Build an "invoker" graph to determine which methods invoke other methods. This is the reverse of the `invocations` graph.
// 3. For each suspicious method, check if any method *outside* the set of suspicious methods invokes it.
// 4. If *any* suspicious method is invoked by a non-suspicious method, then no suspicious methods can be removed, and we return all methods.
// 5. Otherwise, if all suspicious methods are only invoked by other suspicious methods (or not at all by non-suspicious methods), then all suspicious methods can be removed. We return the set of non-suspicious methods.
//
// Time Complexity:
// - Building adjacency lists for both invocation and invoker graphs: O(N + E), where N is the number of methods and E is the number of invocations.
// - DFS/BFS to find all methods reachable from `k`: O(N + E).
// - Iterating through suspicious methods and checking their invokers: In the worst case, each suspicious method might have multiple invokers. Checking if an invoker is suspicious takes O(1) if using a set. Total: O(N + E).
// Overall Time Complexity: O(N + E)
//
// Space Complexity:
// - Adjacency lists for invocation and invoker graphs: O(N + E).
// - Set to store suspicious methods: O(N).
// - Visited array/set for DFS/BFS: O(N).
// - Result vector: O(N).
// Overall Space Complexity: O(N + E)

#include <vector>
#include <queue>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    std::vector<int> kthSmallest(int n, int k, std::vector<std::vector<int>>& invocations) {
        // Adjacency list to represent method invocations: adj[u] contains methods invoked by u
        std::vector<std::vector<int>> adj(n);
        // Adjacency list to represent inverse invocations (who invokes a method): rev_adj[v] contains methods that invoke v
        std::vector<std::vector<int>> rev_adj(n);

        // Build the adjacency lists
        for (const auto& inv : invocations) {
            int u = inv[0]; // invoking method
            int v = inv[1]; // invoked method
            adj[u].push_back(v);
            rev_adj[v].push_back(u);
        }

        // Step 1: Find all suspicious methods using BFS starting from k
        std::unordered_set<int> suspicious_methods;
        std::queue<int> q;
        std::vector<bool> visited_suspicious(n, false);

        // Start BFS from method k
        q.push(k);
        visited_suspicious[k] = true;
        suspicious_methods.insert(k);

        while (!q.empty()) {
            int current_method = q.front();
            q.pop();

            // Explore methods invoked by current_method
            for (int neighbor : adj[current_method]) {
                if (!visited_suspicious[neighbor]) {
                    visited_suspicious[neighbor] = true;
                    q.push(neighbor);
                    suspicious_methods.insert(neighbor);
                }
            }
        }

        // Step 2 & 3: Check if any suspicious method is invoked by a non-suspicious method
        bool can_remove_suspicious = true;
        for (int suspicious_method : suspicious_methods) {
            // For each suspicious method, check its direct invokers
            for (int invoker : rev_adj[suspicious_method]) {
                // If an invoker is NOT in the set of suspicious methods,
                // then this suspicious method cannot be removed.
                if (suspicious_methods.find(invoker) == suspicious_methods.end()) {
                    can_remove_suspicious = false;
                    break; // No need to check further invokers for this suspicious_method
                }
            }
            if (!can_remove_suspicious) {
                break; // If one suspicious method can't be removed, then none can be removed.
            }
        }

        // Step 4 & 5: Determine the result
        std::vector<int> remaining_methods;
        if (!can_remove_suspicious) {
            // If it's not possible to remove all suspicious methods, return all methods
            for (int i = 0; i < n; ++i) {
                remaining_methods.push_back(i);
            }
        } else {
            // If all suspicious methods can be removed, return the non-suspicious ones
            for (int i = 0; i < n; ++i) {
                if (suspicious_methods.find(i) == suspicious_methods.end()) {
                    remaining_methods.push_back(i);
                }
            }
        }

        return remaining_methods;
    }
};
