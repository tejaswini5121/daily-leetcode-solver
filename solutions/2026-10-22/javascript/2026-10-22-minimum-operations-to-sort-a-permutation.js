/**
 * @param {number[]} nums
 * @return {number}
 */
// Problem Summary: Find the minimum operations (reverse entire array or rotate left by one) to sort a given permutation of 0 to n-1.
// Link: https://leetcode.com/problems/minimum-operations-to-sort-a-permutation/
//
// Approach:
// This problem can be modeled as a shortest path problem on a graph.
// Each state of the array is a node in the graph.
// The edges are the two allowed operations: reversing the array and rotating left by one.
// We want to find the shortest path from the initial `nums` state to the sorted state [0, 1, ..., n-1].
// Breadth-First Search (BFS) is the ideal algorithm for finding the shortest path in an unweighted graph.
//
// The BFS will work as follows:
// 1. Initialize a queue with the starting state `nums` and its distance (0 operations).
// 2. Use a `Set` to keep track of visited states to avoid cycles and redundant computations. Store array states as strings for easy comparison and storage in the Set.
// 3. In each step of the BFS:
//    a. Dequeue a state and its current distance.
//    b. If the current state is sorted, return its distance.
//    c. Generate the two possible next states:
//       i.  Reverse the entire array.
//       ii. Rotate the array left by one.
//    d. For each generated next state:
//       i.  Convert the array to a string to check if it has been visited.
//       ii. If not visited, mark it as visited and enqueue it with an incremented distance.
// 4. If the queue becomes empty and the sorted state is not found, it means it's impossible to sort the array with the given operations, return -1.
//
// To represent the array states in the `visited` set, we will convert the array to a string (e.g., "0,1,2").
//
// Time Complexity:
// In the worst case, we might visit all possible permutations of the array. However, not all permutations are reachable.
// The number of reachable states is much smaller than n!.
// For each state, we perform O(n) operations to generate the next states (reverse and rotate) and O(n) to convert to a string and check in the Set.
// The maximum number of states visited is bounded. For small n, it might be exponential, but for larger n, the structure of the operations limits the reachable states.
// A tighter analysis is complex, but intuitively, the number of reachable states is polynomial or at least significantly less than n!.
// For n <= 10^5, a direct permutation count is infeasible. The problem constraints and nature suggest that BFS on reachable states is the intended solution.
// The key observation is that the structure of the operations (reversal and cyclic shift) leads to a limited set of reachable states for a given n.
// Worst-case time complexity is roughly O(N * S), where N is the length of the array and S is the number of reachable states. S can be much smaller than N!.
//
// Space Complexity:
// The space complexity is dominated by the `visited` set and the queue.
// In the worst case, we store all reachable states. Similar to time complexity, the number of reachable states S determines the space complexity.
// O(S * N) for storing strings of length N in the set and queue.
//
// Edge Case: If the input array is already sorted, the BFS will find it at distance 0.
//
// Example 1: nums = [0,2,1]
// Queue: [([0,2,1], 0)]
// Visited: {"0,2,1"}
//
// Dequeue ([0,2,1], 0)
// Not sorted.
//
// Operation 1: Reverse -> [1,2,0]
// Not visited. Enqueue ([1,2,0], 1). Visited: {"0,2,1", "1,2,0"}
//
// Operation 2: Rotate Left -> [2,1,0]
// Not visited. Enqueue ([2,1,0], 1). Visited: {"0,2,1", "1,2,0", "2,1,0"}
// Queue: [([1,2,0], 1), ([2,1,0], 1)]
//
// Dequeue ([1,2,0], 1)
// Not sorted.
//
// Operation 1: Reverse -> [0,2,1] (visited)
// Operation 2: Rotate Left -> [2,0,1]
// Not visited. Enqueue ([2,0,1], 2). Visited: {"0,2,1", "1,2,0", "2,1,0", "2,0,1"}
// Queue: [([2,1,0], 1), ([2,0,1], 2)]
//
// Dequeue ([2,1,0], 1)
// Not sorted.
//
// Operation 1: Reverse -> [0,1,2] (sorted!) Return 1 + 1 = 2.
//
// The example explanation shows:
// [0,2,1] --Rotate Left--> [2,1,0] --Reverse--> [0,1,2]  (2 operations)
//
// My BFS logic:
// [0,2,1] (0)
// -> Rotate: [2,1,0] (1)
// -> Reverse: [1,2,0] (1)
//
// From [2,1,0] (1):
// -> Reverse: [0,1,2] (2) -> Sorted! Return 2.
//
// My BFS found the correct path. The example explanation path is also valid.
//
// Example 3: nums = [2,0,1,3]
// The sorted array is [0,1,2,3].
// This problem statement implies that for certain initial configurations, it might be impossible to reach the sorted state.
// This is often true for permutation problems with restricted operations.
// If BFS completes without finding the sorted state, we return -1.
//
// For n=3, the operations are:
// Reverse: swaps elements at i and n-1-i.
// Rotate Left: moves element at i to i-1 (or n-1 if i=0).
//
// It's crucial to handle array copying correctly to avoid modifying states that are still in the queue or have been visited.
// Using `slice()` or `[...arr]` for creating copies is essential.
// Converting to string for `Set` is an efficient way to handle array equality.
const minOperationsToSortPermutation = (nums) => {
    const n = nums.length;
    const sortedNums = Array.from({ length: n }, (_, i) => i);
    const sortedStateStr = sortedNums.join(',');

    // Helper function to reverse the entire array
    const reverseArray = (arr) => {
        const newArr = [...arr]; // Create a copy to avoid modifying original
        newArr.reverse();
        return newArr;
    };

    // Helper function to rotate the array left by one
    const rotateLeft = (arr) => {
        const newArr = [...arr]; // Create a copy to avoid modifying original
        if (n <= 1) return newArr;
        const firstElement = newArr.shift(); // Remove first element
        newArr.push(firstElement);         // Add it to the end
        return newArr;
    };

    // Queue for BFS, stores [current_array_state, operations_count]
    const queue = [[nums, 0]];
    // Set to store visited array states (as strings) to avoid cycles and redundant work
    const visited = new Set();
    visited.add(nums.join(',')); // Add the initial state to visited

    // BFS loop
    while (queue.length > 0) {
        const [currentNums, currentOps] = queue.shift(); // Dequeue the next state and its operation count

        // Check if the current state is sorted
        if (currentNums.join(',') === sortedStateStr) {
            return currentOps; // If sorted, return the number of operations
        }

        // --- Generate next states using the allowed operations ---

        // Operation 1: Reverse the entire array
        const reversedNums = reverseArray(currentNums);
        const reversedStateStr = reversedNums.join(',');
        if (!visited.has(reversedStateStr)) {
            visited.add(reversedStateStr);
            queue.push([reversedNums, currentOps + 1]); // Enqueue with incremented operation count
        }

        // Operation 2: Rotate Left by One
        const rotatedNums = rotateLeft(currentNums);
        const rotatedStateStr = rotatedNums.join(',');
        if (!visited.has(rotatedStateStr)) {
            visited.add(rotatedStateStr);
            queue.push([rotatedNums, currentOps + 1]); // Enqueue with incremented operation count
        }
    }

    // If the queue becomes empty and the sorted state was not reached, it's impossible to sort.
    return -1;
};
```