// Problem Summary:
// This problem involves identifying "critical points" (local maxima or minima) in a linked list.
// A node is a local maxima if its value is strictly greater than its neighbors, and a local minima if strictly smaller.
// The task is to find the minimum and maximum distances between any two distinct critical points.
// If fewer than two critical points exist, return [-1, -1].
//
// Link: https://leetcode.com/problems/find-the-minimum-and-maximum-number-of-nodes-between-critical-points/
//
// Approach Explanation:
// The approach involves a single pass through the linked list to identify all critical points and their positions (0-indexed).
// We maintain three pointers: `prev`, `curr`, and `next` to check the conditions for local maxima/minima.
// We also track the current node's `position`.
// To find the minimum and maximum distances efficiently without storing all critical points in a list,
// we keep track of:
// 1. `firstCriticalPointPosition`: The position of the very first critical point encountered.
// 2. `lastCriticalPointPosition`: The position of the most recently encountered critical point (which serves as the "previous" critical point for distance calculation, and the overall last one).
// 3. `minDistance`: The minimum distance found so far between any two *adjacent* critical points.
//
// We iterate starting from the second node (`head.next`) because the first and last nodes cannot be critical points
// (they lack a previous or next node, respectively).
// If a critical point is found:
//   - If it's the first one, `firstCriticalPointPosition` is set.
//   - Otherwise, `minDistance` is updated with `currentPosition - lastCriticalPointPosition`.
//   - `lastCriticalPointPosition` is always updated to the `currentPosition` of the newly found critical point.
// After the traversal, if `firstCriticalPointPosition` is still -1 or `firstCriticalPointPosition == lastCriticalPointPosition`
// (meaning 0 or 1 critical points were found), we return `[-1, -1]`.
// Otherwise, `maxDistance` is simply `lastCriticalPointPosition - firstCriticalPointPosition` (the distance
// between the first and the overall last critical point), and `minDistance` holds the smallest distance found.
//
// Time Complexity: O(N)
// We traverse the linked list exactly once. N is the number of nodes in the list.
// Each node processing involves a constant number of operations.
//
// Space Complexity: O(1)
// We use a constant number of extra variables to store pointers and indices, regardless of the list size.
// No auxiliary data structures (like arrays or lists) that grow with N are used.

class Solution {

    // Definition for singly-linked list.
    // This class is typically provided by the LeetCode environment.
    // Including it here for standalone compilation.
    public static class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    public int[] nodesBetweenCriticalPoints(ListNode head) {
        // Handle edge cases: A linked list must have at least 3 nodes to potentially have any critical points.
        // A critical point requires both a previous and a next node.
        // If head is null, or only one node (head.next is null), or only two nodes (head.next.next is null),
        // no critical points can exist.
        if (head == null || head.next == null || head.next.next == null) {
            return new int[]{-1, -1};
        }

        // Pointers for iterating through the list.
        // 'prev' points to the node before 'curr'.
        // 'curr' points to the node currently being evaluated.
        ListNode prev = head;
        ListNode curr = head.next;
        // 'currentPosition' is the 0-indexed position of the 'curr' node.
        // We start 'curr' at index 1 (the second node) because the first node cannot be a critical point.
        int currentPosition = 1;

        // Variables to store information about critical points.
        // 'firstCriticalPointPosition' stores the position of the first critical point found.
        int firstCriticalPointPosition = -1;
        // 'lastCriticalPointPosition' stores the position of the most recently found critical point.
        // This is used both to track the overall last CP and to calculate min distance with the current CP.
        int lastCriticalPointPosition = -1;
        // 'minDistance' stores the minimum distance found so far between any two *adjacent* critical points.
        // Initialize to max value to ensure any valid distance will be smaller.
        int minDistance = Integer.MAX_VALUE;

        // Iterate through the list. The loop condition `curr.next != null` ensures that `curr`
        // always has a `prev` (from the previous iteration) and a `next` node.
        // This means `curr` can be evaluated as a critical point.
        while (curr.next != null) {
            // Check if 'curr' is a local maxima: current value > previous value AND current value > next value.
            boolean isLocalMaxima = (curr.val > prev.val && curr.val > curr.next.val);
            // Check if 'curr' is a local minima: current value < previous value AND current value < next value.
            boolean isLocalMinima = (curr.val < prev.val && curr.val < curr.next.val);

            // If 'curr' is a critical point (either a local maxima or minima)
            if (isLocalMaxima || isLocalMinima) {
                // If this is the very first critical point we've encountered
                if (firstCriticalPointPosition == -1) {
                    firstCriticalPointPosition = currentPosition;
                } else {
                    // If it's not the first critical point, calculate the distance from the
                    // previously found critical point (`lastCriticalPointPosition`)
                    // and update `minDistance` if this new distance is smaller.
                    minDistance = Math.min(minDistance, currentPosition - lastCriticalPointPosition);
                }
                // Update `lastCriticalPointPosition` to the current node's position,
                // as it is now the most recently found critical point.
                lastCriticalPointPosition = currentPosition;
            }

            // Move the pointers forward for the next iteration.
            prev = curr;
            curr = curr.next;
            // Increment the position counter for the new 'curr' node.
            currentPosition++;
        }

        // After iterating through the entire list, determine the result.
        // If `firstCriticalPointPosition` is still -1, it means no critical points were found.
        // If `firstCriticalPointPosition` is equal to `lastCriticalPointPosition`, it means only one
        // critical point was found (or none if `firstCriticalPointPosition` is -1).
        // In both these cases, we need at least two distinct critical points.
        if (firstCriticalPointPosition == -1 || firstCriticalPointPosition == lastCriticalPointPosition) {
            // Return [-1, -1] as per problem statement if fewer than two critical points exist.
            return new int[]{-1, -1};
        } else {
            // If two or more critical points were found, calculate the maximum distance.
            // The maximum distance is simply the distance between the very first and the very last critical point.
            int maxDistance = lastCriticalPointPosition - firstCriticalPointPosition;
            // Return the calculated minimum and maximum distances.
            return new int[]{minDistance, maxDistance};
        }
    }
}