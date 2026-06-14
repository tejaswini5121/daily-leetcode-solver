/**
 * @param {ListNode} head
 * @return {number}
 */
// Problem: Maximum Twin Sum of a Linked List
// Link: https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/
// Approach:
// 1. Find the middle of the linked list using the fast and slow pointer technique.
// 2. Reverse the second half of the linked list.
// 3. Iterate through the first half and the reversed second half simultaneously, calculating the twin sum for each pair of nodes.
// 4. Keep track of the maximum twin sum encountered.
// Time Complexity: O(n), where n is the number of nodes in the linked list.
//   - Finding the middle: O(n/2) = O(n)
//   - Reversing the second half: O(n/2) = O(n)
//   - Calculating twin sums: O(n/2) = O(n)
// Space Complexity: O(1), as we are modifying the linked list in-place and using only a few extra pointers.
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
var pairSum = function(head) {
    // Initialize slow and fast pointers to traverse the list.
    let slow = head;
    let fast = head;

    // Move slow pointer one step at a time and fast pointer two steps at a time.
    // When fast reaches the end, slow will be at the middle of the list.
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Now, 'slow' is pointing to the start of the second half of the linked list.
    // We need to reverse the second half to easily pair nodes with their twins.

    let prev = null;
    let current = slow;
    let nextNode = null;

    // Reverse the second half of the linked list.
    while (current) {
        nextNode = current.next; // Store the next node
        current.next = prev;    // Reverse the current node's pointer
        prev = current;         // Move 'prev' one step forward
        current = nextNode;     // Move 'current' one step forward
    }
    // After the loop, 'prev' will be the head of the reversed second half.

    // Now, 'head' is the start of the first half and 'prev' is the start of the reversed second half.
    // We can now iterate through both halves simultaneously to calculate twin sums.
    let maxTwinSum = 0;
    let firstHalf = head;
    let secondHalfReversed = prev;

    // Iterate as long as both pointers are valid.
    while (secondHalfReversed) {
        // Calculate the sum of the current node from the first half and its twin from the reversed second half.
        const currentTwinSum = firstHalf.val + secondHalfReversed.val;
        // Update the maximum twin sum found so far.
        maxTwinSum = Math.max(maxTwinSum, currentTwinSum);

        // Move both pointers to their next respective nodes.
        firstHalf = firstHalf.next;
        secondHalfReversed = secondHalfReversed.next;
    }

    // Return the maximum twin sum found.
    return maxTwinSum;
};
```