// Problem: Jump Game III
// Summary: Given an array of non-negative integers and a starting index, determine if you can reach any index with a value of 0 by jumping forward or backward by the value at the current index.
// Link: https://leetcode.com/problems/jump-game-iii/
// Approach: This problem can be solved using either Breadth-First Search (BFS) or Depth-First Search (DFS).
// We will use BFS here. We'll maintain a queue of indices to visit and a set to keep track of visited indices to avoid cycles and redundant computations.
// Starting from the given 'start' index, we add it to the queue and mark it as visited.
// While the queue is not empty, we dequeue an index. If the value at this index is 0, we have found a path and return true.
// Otherwise, we calculate the two possible next indices: current index + arr[current index] and current index - arr[current index].
// For each of these potential next indices, we check if they are within the array bounds and if they haven't been visited yet. If both conditions are met, we add them to the queue and mark them as visited.
// If the queue becomes empty and we haven't found an index with value 0, it means it's impossible to reach such an index, so we return false.
// Time Complexity: O(N), where N is the length of the array. In the worst case, we visit each index at most once.
// Space Complexity: O(N), where N is the length of the array. This is due to the queue and the visited set, which can store up to N elements in the worst case.
/**
 * @param {number[]} arr
 * @param {number} start
 * @return {boolean}
 */
const canReach = (arr, start) => {
    // Get the length of the array
    const n = arr.length;
    // Initialize a queue for BFS, starting with the initial 'start' index
    const queue = [start];
    // Initialize a set to keep track of visited indices to prevent cycles
    const visited = new Set();
    // Add the starting index to the visited set
    visited.add(start);

    // Perform BFS
    while (queue.length > 0) {
        // Dequeue the current index from the front of the queue
        const currentIndex = queue.shift();

        // If the value at the current index is 0, we have reached the target
        if (arr[currentIndex] === 0) {
            return true;
        }

        // Calculate the possible next indices: jump forward and jump backward
        const jumpForwardIndex = currentIndex + arr[currentIndex];
        const jumpBackwardIndex = currentIndex - arr[currentIndex];

        // Check and enqueue the forward jump if it's valid
        // A jump is valid if it's within the array bounds (0 <= index < n)
        // and if the index has not been visited yet.
        if (jumpForwardIndex >= 0 && jumpForwardIndex < n && !visited.has(jumpForwardIndex)) {
            queue.push(jumpForwardIndex);
            visited.add(jumpForwardIndex);
        }

        // Check and enqueue the backward jump if it's valid
        // A jump is valid if it's within the array bounds (0 <= index < n)
        // and if the index has not been visited yet.
        if (jumpBackwardIndex >= 0 && jumpBackwardIndex < n && !visited.has(jumpBackwardIndex)) {
            queue.push(jumpBackwardIndex);
            visited.add(jumpBackwardIndex);
        }
    }

    // If the queue becomes empty and we haven't found an index with value 0, return false
    return false;
};
```