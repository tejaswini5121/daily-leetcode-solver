/**
 * @fileoverview LeetCode Problem: Jump Game IV
 * Problem Summary: Find the minimum steps to reach the last index of an array with special jump rules.
 * Link: https://leetcode.com/problems/jump-game-iv/
 *
 * Approach:
 * This problem can be modeled as a shortest path problem on a graph.
 * The nodes of the graph are the indices of the array.
 * The edges represent possible jumps:
 * 1. From index `i` to `i+1` (if `i+1` is within bounds).
 * 2. From index `i` to `i-1` (if `i-1` is within bounds).
 * 3. From index `i` to any index `j` where `arr[i] == arr[j]` and `i != j`.
 *
 * Since we are looking for the minimum number of steps, Breadth-First Search (BFS) is the ideal algorithm.
 *
 * To efficiently find all indices `j` with `arr[i] == arr[j]`, we can pre-process the array and store the indices for each value in a hash map (or JavaScript object). The keys of the map will be the array values, and the values will be arrays of indices where that value appears.
 *
 * BFS Implementation Details:
 * - We use a queue to store the indices to visit and their corresponding distance from the start. Each element in the queue will be an array like `[index, steps]`.
 * - We use a `visited` set to keep track of visited indices to avoid cycles and redundant computations.
 * - We start BFS from index 0 with 0 steps.
 * - In each BFS step, we dequeue an element `[currentIndex, currentSteps]`.
 * - If `currentIndex` is the last index, we return `currentSteps`.
 * - We explore the three types of jumps:
 *   - `currentIndex + 1`: If valid and not visited, enqueue it with `currentSteps + 1` and mark as visited.
 *   - `currentIndex - 1`: If valid and not visited, enqueue it with `currentSteps + 1` and mark as visited.
 *   - Jumps to indices with the same value:
 *     - Retrieve the list of indices from the pre-computed hash map for `arr[currentIndex]`.
 *     - For each such `nextIndex`:
 *       - If `nextIndex` is not visited, enqueue it with `currentSteps + 1` and mark as visited.
 *     - **Optimization**: After processing all jumps to indices with the same value from `arr[currentIndex]`, we clear the list of indices for `arr[currentIndex]` in the hash map. This is a crucial optimization because if we visit an index `k` and later encounter another index `i` where `arr[i] == arr[k]`, we've already explored all paths originating from `k`. Re-exploring them from `i` would be redundant and could lead to TLE (Time Limit Exceeded) on large test cases. This effectively makes each distinct value's group of indices contribute to the BFS exploration only once.
 *
 * Time Complexity:
 * Let N be the length of the array.
 * - Pre-processing the hash map: O(N) to iterate through the array and populate the map.
 * - BFS: In the worst case, each index can be enqueued and dequeued at most once.
 *   - For the `i+1` and `i-1` jumps, each index is considered twice.
 *   - For jumps to indices with the same value, each group of identical values is processed once due to the optimization. In total, over all BFS steps, we process each unique value's index list at most once.
 *   - The total number of edges considered can be up to O(N) for `i+1`/`i-1` jumps and potentially O(N^2) if many elements are identical. However, with the optimization of clearing the map entries after processing, each element is effectively visited and processed for its value-based jumps only once.
 *   - Therefore, the BFS part is O(N).
 * Overall Time Complexity: O(N)
 *
 * Space Complexity:
 * - Hash map: In the worst case, if all elements are distinct, it stores N entries. If all elements are the same, it stores one entry with N indices. So, O(N).
 * - Queue: In the worst case, the queue can store up to O(N) elements.
 * - Visited set: Stores up to O(N) elements.
 * Overall Space Complexity: O(N)
 */

function minJump(arr) {
    // If the array has only one element, we are already at the last index.
    if (arr.length === 1) {
        return 0;
    }

    // Create a map to store indices for each value in the array.
    // Key: value from arr, Value: array of indices where this value appears.
    const graph = new Map();
    for (let i = 0; i < arr.length; i++) {
        if (!graph.has(arr[i])) {
            graph.set(arr[i], []);
        }
        graph.get(arr[i]).push(i);
    }

    // Initialize a queue for BFS. Each element is [index, steps].
    const queue = [[0, 0]]; // Start at index 0 with 0 steps.

    // Use a Set to keep track of visited indices to avoid cycles and redundant processing.
    const visited = new Set([0]); // Mark the starting index as visited.

    // The target index is the last index of the array.
    const targetIndex = arr.length - 1;

    // Perform BFS.
    while (queue.length > 0) {
        // Dequeue the current index and its steps.
        const [currentIndex, currentSteps] = queue.shift();

        // If we have reached the last index, return the number of steps.
        if (currentIndex === targetIndex) {
            return currentSteps;
        }

        // Explore possible jumps:

        // 1. Jump to the right (i + 1).
        const nextIndexRight = currentIndex + 1;
        if (nextIndexRight < arr.length && !visited.has(nextIndexRight)) {
            visited.add(nextIndexRight);
            queue.push([nextIndexRight, currentSteps + 1]);
        }

        // 2. Jump to the left (i - 1).
        const nextIndexLeft = currentIndex - 1;
        if (nextIndexLeft >= 0 && !visited.has(nextIndexLeft)) {
            visited.add(nextIndexLeft);
            queue.push([nextIndexLeft, currentSteps + 1]);
        }

        // 3. Jump to indices with the same value (j where arr[i] == arr[j] and i != j).
        const currentValue = arr[currentIndex];
        // Check if there are any indices with the same value that we haven't processed yet.
        if (graph.has(currentValue)) {
            const indicesWithSameValue = graph.get(currentValue);

            for (const nextIndexSameValue of indicesWithSameValue) {
                // Ensure we don't jump to the current index itself.
                if (nextIndexSameValue !== currentIndex && !visited.has(nextIndexSameValue)) {
                    visited.add(nextIndexSameValue);
                    queue.push([nextIndexSameValue, currentSteps + 1]);
                }
            }
            // IMPORTANT OPTIMIZATION:
            // After exploring all jumps for the current value, remove this value from the graph.
            // This prevents redundant exploration of paths from other indices with the same value
            // once we have already processed them. This is crucial for performance.
            graph.delete(currentValue);
        }
    }

    // This part should theoretically not be reached if a path exists,
    // as per problem constraints and typical LeetCode problem design.
    // However, returning -1 or throwing an error can be done for robustness.
    // For this problem, a path is guaranteed to exist if arr.length >= 1.
    return -1; // Should not happen given the problem constraints.
}
```