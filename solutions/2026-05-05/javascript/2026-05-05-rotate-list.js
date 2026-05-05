// Problem: Rotate List
// Summary: Rotate a linked list to the right by k positions.
// Link: https://leetcode.com/problems/rotate-list/
//
// Approach:
// 1. Handle edge cases: if the list is empty or has only one node, or k is 0, return the head.
// 2. Calculate the length of the linked list.
// 3. Calculate the effective rotation amount: k % length. If effective_k is 0, no rotation is needed.
// 4. Find the new tail and the new head:
//    - The new tail will be (length - effective_k - 1) nodes from the original head.
//    - The new head will be the node after the new tail.
// 5. Perform the rotation:
//    - Break the link after the new tail.
//    - Connect the original tail to the original head.
//    - Return the new head.
//
// Time Complexity: O(N), where N is the number of nodes in the linked list. We traverse the list twice: once to find the length and the tail, and once to find the new tail.
// Space Complexity: O(1), as we only use a few extra pointers.
//
// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function(head, k) {
    // Edge case: empty list, single node list, or k = 0 (no rotation)
    if (!head || !head.next || k === 0) {
        return head;
    }

    // 1. Find the length of the list and the tail node
    let length = 1;
    let tail = head;
    while (tail.next) {
        tail = tail.next;
        length++;
    }

    // 2. Calculate the effective rotation amount
    // If k is a multiple of the length, no rotation is needed.
    const effectiveK = k % length;
    if (effectiveK === 0) {
        return head;
    }

    // 3. Find the new tail. The new tail is (length - effectiveK - 1) nodes from the start.
    // This means we need to move (length - effectiveK) steps from the head to reach the node *before* the new head.
    // So, the new tail is at index (length - effectiveK - 1).
    let newTailIndex = length - effectiveK - 1;
    let newTail = head;
    for (let i = 0; i < newTailIndex; i++) {
        newTail = newTail.next;
    }

    // 4. Identify the new head
    const newHead = newTail.next;

    // 5. Perform the rotation
    // Break the link after the new tail
    newTail.next = null;
    // Connect the original tail to the original head to form a circle temporarily
    tail.next = head;

    // 6. Return the new head
    return newHead;
};
```