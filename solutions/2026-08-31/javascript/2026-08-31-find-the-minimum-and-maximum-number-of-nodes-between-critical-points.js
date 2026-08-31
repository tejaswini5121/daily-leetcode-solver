/*
 * Problem: Find the Minimum and Maximum Number of Nodes Between Critical Points
 * Link: https://leetcode.com/problems/find-the-minimum-and-maximum-number-of-nodes-between-critical-points/
 *
 * Approach Explanation:
 * The problem requires finding local maxima and minima (critical points) in a linked list
 * and then calculating the minimum and maximum distances between any two distinct critical points.
 *
 * 1. Initialization:
 *    - Initialize `prevNode` to `head`, `currNode` to `head.next`, and `index` to 1 (for 0-based indexing of nodes).
 *    - `firstCriticalPointIndex`: Stores the index of the very first critical point found. Initialized to -1.
 *    - `prevCriticalPointIndex`: Stores the index of the most recently found critical point. Initialized to -1.
 *    - `minDistance`: Stores the minimum distance between adjacent critical points. Initialized to `Infinity`.
 *    - `maxDistance`: Stores the maximum distance, which is always between the `firstCriticalPointIndex` and the `prevCriticalPointIndex` (the last one found). Initialized to -1.
 *
 * 2. Iteration:
 *    - Traverse the linked list using a `while` loop that continues as long as `currNode` and `currNode.next` are not null.
 *      This ensures that `currNode` always has both a `prevNode` and a `nextNode` to check for critical point conditions.
 *    - Inside the loop, determine if `currNode` is a local maxima (`currNode.val > prevNode.val && currNode.val > currNode.next.val`)
 *      or a local minima (`currNode.val < prevNode.val && currNode.val < currNode.next.val`).
 *
 * 3. Critical Point Handling:
 *    - If `currNode` is a critical point:
 *      - If `firstCriticalPointIndex` is -1, set `firstCriticalPointIndex` to the current `index`. This marks the first critical point.
 *      - Otherwise (if it's not the first critical point):
 *        - Update `minDistance` by taking the minimum of its current value and the distance between the current critical point and `prevCriticalPointIndex` (`index - prevCriticalPointIndex`).
 *        - Update `maxDistance` by calculating the distance between the current critical point and `firstCriticalPointIndex` (`index - firstCriticalPointIndex`).
 *      - In both cases, update `prevCriticalPointIndex` to the current `index`.
 *
 * 4. Pointers Update:
 *    - Advance the pointers: `prevNode = currNode`, `currNode = currNode.next`, and increment `index`.
 *
 * 5. Result Handling:
 *    - After the loop, if `firstCriticalPointIndex` is still -1 (no critical points found) or
 *      if `firstCriticalPointIndex` is equal to `prevCriticalPointIndex` (only one critical point found),
 *      return `[-1, -1]` as there are fewer than two critical points.
 *    - Otherwise, return `[minDistance, maxDistance]`.
 *
 * Time Complexity: O(N)
 * The algorithm makes a single pass through the linked list, performing constant-time operations for each node.
 * N is the number of nodes in the linked list.
 *
 * Space Complexity: O(1)
 * The algorithm uses a fixed number of variables regardless of the input list size.
 */

// Definition for singly-linked list.
// This constructor is typically provided by the LeetCode environment during execution.
// It's included here for completeness, making the file runnable standalone.
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}

/**
 * @param {ListNode} head
 * @return {number[]}
 */
var nodesBetweenCriticalPoints = function(head) {
    // If the list has fewer than 3 nodes, it's impossible to have a critical point
    // because a critical point requires both a previous and a next node.
    if (!head || !head.next || !head.next.next) {
        return [-1, -1];
    }

    // Initialize pointers and index for traversal
    let prevNode = head;
    let currNode = head.next;
    let index = 1; // 0-based index: head is 0, head.next is 1, etc.

    // Variables to track critical points
    let firstCriticalPointIndex = -1; // Stores the index of the first critical point found
    let prevCriticalPointIndex = -1;  // Stores the index of the most recently found critical point

    // Variables to store min and max distances
    let minDistance = Infinity; // Initialize with a very large value to find the minimum
    let maxDistance = -1;       // Initialize with -1, will be updated if two CPs are found

    // Traverse the linked list
    // The loop condition `currNode && currNode.next` ensures that `currNode`
    // always has both a `prevNode` (which is `prevNode`) and a `nextNode` (`currNode.next`)
    // available for checking critical point conditions.
    while (currNode && currNode.next) {
        const nextNode = currNode.next;

        // Check if the current node is a local maxima or a local minima
        const isLocalMaxima = (currNode.val > prevNode.val && currNode.val > nextNode.val);
        const isLocalMinima = (currNode.val < prevNode.val && currNode.val < nextNode.val);

        if (isLocalMaxima || isLocalMinima) {
            // Found a critical point
            if (firstCriticalPointIndex === -1) {
                // This is the first critical point encountered
                firstCriticalPointIndex = index;
            } else {
                // This is a subsequent critical point.
                // Update minDistance: distance to the immediately preceding critical point
                minDistance = Math.min(minDistance, index - prevCriticalPointIndex);
                // Update maxDistance: distance from the first critical point to the current one.
                // This will always track the maximum possible distance because `firstCriticalPointIndex`
                // remains fixed and `index` is always increasing.
                maxDistance = index - firstCriticalPointIndex;
            }
            // Update the index of the most recently found critical point
            prevCriticalPointIndex = index;
        }

        // Move to the next nodes for the next iteration
        prevNode = currNode;
        currNode = nextNode;
        index++;
    }

    // After the traversal, check if at least two critical points were found.
    // If `firstCriticalPointIndex` is still -1, no critical points were found.
    // If `firstCriticalPointIndex` is equal to `prevCriticalPointIndex`, only one critical point was found.
    // In both these scenarios, it's impossible to calculate a distance between two *distinct* critical points.
    if (firstCriticalPointIndex === -1 || firstCriticalPointIndex === prevCriticalPointIndex) {
        return [-1, -1];
    }

    // If two or more critical points were found, return the calculated min and max distances.
    return [minDistance, maxDistance];
};