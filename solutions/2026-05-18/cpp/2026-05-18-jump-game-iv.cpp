```cpp
// LeetCode Problem: Jump Game IV
// Summary: Find the minimum steps to reach the last index of an array using three types of jumps.
// Link: https://leetcode.com/problems/jump-game-iv/
//
// Approach:
// This problem can be effectively solved using Breadth-First Search (BFS).
// We start at index 0 and explore possible jumps level by level.
// The state in our BFS will be the current index and the number of steps taken to reach it.
// To efficiently find all indices 'j' where arr[i] == arr[j], we pre-process the array
// and store the indices for each unique value in a hash map (std::unordered_map).
//
// The BFS proceeds as follows:
// 1. Initialize a queue for BFS and add the starting index (0) with 0 steps.
// 2. Initialize a set or boolean array to keep track of visited indices to avoid cycles and redundant computations.
// 3. Use a hash map `val_to_indices` to store lists of indices for each value in `arr`.
// 4. While the queue is not empty:
//    a. Dequeue the current index `curr_idx` and its steps `curr_steps`.
//    b. If `curr_idx` is the last index, return `curr_steps`.
//    c. Explore the three types of jumps:
//       i. Jump to `curr_idx + 1` (if valid and not visited): Enqueue and mark as visited.
//       ii. Jump to `curr_idx - 1` (if valid and not visited): Enqueue and mark as visited.
//       iii. Jump to any index `next_idx` where `arr[curr_idx] == arr[next_idx]`:
//           - Iterate through all indices stored in `val_to_indices[arr[curr_idx]]`.
//           - For each `next_idx` (if not `curr_idx` and not visited): Enqueue and mark as visited.
//           - **Optimization**: After exploring all jumps for a specific value `arr[curr_idx]`, clear the entry
//             `val_to_indices[arr[curr_idx]]`. This is crucial because if we revisit this value later,
//             all reachable indices for this value would have already been explored at an earlier or equal
//             number of steps, thus preventing redundant exploration and improving time complexity.
//
// Time Complexity: O(N), where N is the length of the array.
// - Building the hash map: O(N)
// - BFS traversal: Each index is enqueued and dequeued at most once.
// - When processing an index `i` with value `v`:
//   - `i+1` and `i-1` jumps are O(1).
//   - Jumps to indices with the same value `v`: If `k` is the number of occurrences of `v`, we iterate through them.
//     However, crucially, once we process all occurrences of a value `v`, we clear its entry from the map.
//     This means each index will be part of a "same value jump exploration" at most once.
//     Therefore, the total number of "same value jumps" considered across the entire BFS is bounded by O(N).
// - Overall, each index and each jump connection is processed a constant number of times.
//
// Space Complexity: O(N), where N is the length of the array.
// - The hash map `val_to_indices` can store up to N indices in the worst case (all elements are unique).
// - The BFS queue can store up to N indices.
// - The visited set can store up to N indices.
//
// IMPORTANT NOTE ON OPTIMIZATION: Clearing the `val_to_indices[arr[curr_idx]]` entry after processing it
// is vital. Without this, if a value appears many times, we might re-explore all its occurrences
// multiple times, potentially leading to O(N^2) time complexity in the worst case.
//
// Example Walkthrough (arr = [100,-23,-23,404,100,23,23,23,3,404]):
// N = 10
// val_to_indices:
// 100: [0, 4]
// -23: [1, 2]
// 404: [3, 9]
// 23: [5, 6, 7]
// 3: [8]
//
// Queue: [(0, 0)] (index, steps)
// Visited: {0}
//
// Dequeue (0, 0). arr[0] = 100.
//   - Jump to 0+1 = 1. Valid, not visited. Enqueue (1, 1). Visited: {0, 1}.
//   - Jump to 0-1 = -1. Invalid.
//   - Jumps for value 100: Indices [0, 4].
//     - next_idx = 0: same as curr_idx. Skip.
//     - next_idx = 4: Valid, not visited. Enqueue (4, 1). Visited: {0, 1, 4}.
//   - Clear val_to_indices[100]. Map: {-23:[1,2], 404:[3,9], 23:[5,6,7], 3:[8]}
// Queue: [(1, 1), (4, 1)]
//
// Dequeue (1, 1). arr[1] = -23.
//   - Jump to 1+1 = 2. Valid, not visited. Enqueue (2, 2). Visited: {0, 1, 4, 2}.
//   - Jump to 1-1 = 0. Visited. Skip.
//   - Jumps for value -23: Indices [1, 2].
//     - next_idx = 1: same as curr_idx. Skip.
//     - next_idx = 2: already enqueued for steps 2. (This is okay, BFS handles it).
//   - Clear val_to_indices[-23]. Map: {404:[3,9], 23:[5,6,7], 3:[8]}
// Queue: [(4, 1), (2, 2)]
//
// Dequeue (4, 1). arr[4] = 100.
//   - Jump to 4+1 = 5. Valid, not visited. Enqueue (5, 2). Visited: {0, 1, 4, 2, 5}.
//   - Jump to 4-1 = 3. Valid, not visited. Enqueue (3, 2). Visited: {0, 1, 4, 2, 5, 3}.
//   - Jumps for value 100: (already cleared, no more same-value jumps for 100 from index 4).
// Queue: [(2, 2), (5, 2), (3, 2)]
//
// Dequeue (2, 2). arr[2] = -23.
//   - Jump to 2+1 = 3. Visited. Skip.
//   - Jump to 2-1 = 1. Visited. Skip.
//   - Jumps for value -23: (already cleared).
// Queue: [(5, 2), (3, 2)]
//
// Dequeue (5, 2). arr[5] = 23.
//   - Jump to 5+1 = 6. Valid, not visited. Enqueue (6, 3). Visited: {0, 1, 4, 2, 5, 3, 6}.
//   - Jump to 5-1 = 4. Visited. Skip.
//   - Jumps for value 23: Indices [5, 6, 7].
//     - next_idx = 5: skip.
//     - next_idx = 6: already enqueued.
//     - next_idx = 7: Valid, not visited. Enqueue (7, 3). Visited: {0, 1, 4, 2, 5, 3, 6, 7}.
//   - Clear val_to_indices[23]. Map: {404:[3,9], 3:[8]}
// Queue: [(3, 2), (6, 3), (7, 3)]
//
// Dequeue (3, 2). arr[3] = 404.
//   - Jump to 3+1 = 4. Visited. Skip.
//   - Jump to 3-1 = 2. Visited. Skip.
//   - Jumps for value 404: Indices [3, 9].
//     - next_idx = 3: skip.
//     - next_idx = 9: Valid, not visited. Enqueue (9, 3). Visited: {0, 1, 4, 2, 5, 3, 6, 7, 9}.
//   - Clear val_to_indices[404]. Map: {3:[8]}
// Queue: [(6, 3), (7, 3), (9, 3)]
//
// Dequeue (6, 3). arr[6] = 23. (Value 23 was cleared, so no same-value jumps)
//   - Jump to 6+1 = 7. Visited. Skip.
//   - Jump to 6-1 = 5. Visited. Skip.
// Queue: [(7, 3), (9, 3)]
//
// Dequeue (7, 3). arr[7] = 23. (Value 23 was cleared)
//   - Jump to 7+1 = 8. Valid, not visited. Enqueue (8, 4). Visited: {0, 1, 4, 2, 5, 3, 6, 7, 9, 8}.
//   - Jump to 7-1 = 6. Visited. Skip.
// Queue: [(9, 3), (8, 4)]
//
// Dequeue (9, 3). arr[9] = 404.
//   - Index 9 is the last index (N-1). Return steps = 3.
// The output is 3.
//
// The example walkthrough confirms the logic and the importance of clearing the map entries.
// The indices are 0-based.
//
// For C++ implementation:
// - `std::vector<int>` for the input array.
// - `std::unordered_map<int, std::vector<int>>` for `val_to_indices`.
// - `std::queue<std::pair<int, int>>` for the BFS queue.
// - `std::vector<bool>` or `std::unordered_set<int>` for visited indices. `std::vector<bool>` is generally more space-efficient.

#include <vector>
#include <queue>
#include <unordered_map>
#include <utility> // For std::pair

class Solution {
public:
    int minJumps(std::vector<int>& arr) {
        int n = arr.size();

        // Edge case: If the array has only one element, we are already at the last index.
        if (n <= 1) {
            return 0;
        }

        // Map to store indices for each unique value.
        // Key: value from the array
        // Value: list of indices where this value appears
        std::unordered_map<int, std::vector<int>> val_to_indices;
        for (int i = 0; i < n; ++i) {
            val_to_indices[arr[i]].push_back(i);
        }

        // Queue for BFS: stores pairs of (current_index, steps_taken)
        std::queue<std::pair<int, int>> q;
        q.push({0, 0}); // Start at index 0 with 0 steps

        // Vector to keep track of visited indices.
        // Using vector<bool> is space-efficient.
        std::vector<bool> visited(n, false);
        visited[0] = true; // Mark the starting index as visited

        // BFS loop
        while (!q.empty()) {
            // Get the current index and its steps from the front of the queue
            std::pair<int, int> current = q.front();
            q.pop();
            int curr_idx = current.first;
            int curr_steps = current.second;

            // If we reached the last index, return the number of steps
            if (curr_idx == n - 1) {
                return curr_steps;
            }

            // Explore possible jumps:

            // 1. Jump to i + 1
            int next_idx_plus_1 = curr_idx + 1;
            if (next_idx_plus_1 < n && !visited[next_idx_plus_1]) {
                visited[next_idx_plus_1] = true;
                q.push({next_idx_plus_1, curr_steps + 1});
            }

            // 2. Jump to i - 1
            int next_idx_minus_1 = curr_idx - 1;
            if (next_idx_minus_1 >= 0 && !visited[next_idx_minus_1]) {
                visited[next_idx_minus_1] = true;
                q.push({next_idx_minus_1, curr_steps + 1});
            }

            // 3. Jump to j where arr[i] == arr[j] and i != j
            int current_value = arr[curr_idx];
            // Check if this value still has indices to explore in the map.
            // This is the crucial optimization: once we process all indices for a value,
            // we clear the entry to avoid redundant work.
            if (val_to_indices.count(current_value)) {
                for (int next_idx_same_val : val_to_indices[current_value]) {
                    // We are already checking curr_idx != j implicitly by not exploring it if it's visited.
                    // However, explicitly checking avoids adding curr_idx itself if it's the only one.
                    if (!visited[next_idx_same_val]) {
                        visited[next_idx_same_val] = true;
                        q.push({next_idx_same_val, curr_steps + 1});
                    }
                }
                // Optimization: Clear the list of indices for this value.
                // Once we have explored all possible jumps from any occurrence of `current_value`
                // to other occurrences of `current_value` at the current step level,
                // we don't need to do it again for this value because we would be reaching them
                // at the same or a higher number of steps.
                val_to_indices.erase(current_value);
            }
        }

        // This part should ideally not be reached given the problem constraints
        // where a solution is always guaranteed (since N >= 1 and we can always jump i+1/i-1).
        // However, it's good practice to have a return statement for all paths.
        return -1; // Should not happen
    }
};
```