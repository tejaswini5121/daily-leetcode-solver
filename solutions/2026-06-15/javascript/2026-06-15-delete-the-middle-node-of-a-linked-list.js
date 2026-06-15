/**
 * @param {ListNode} head
 * @return {ListNode}
 */

/*
Problem Summary:
Given the head of a singly linked list, delete the middle node and return the head of the modified list.
The middle node is defined as the floor(n/2)-th node (0-indexed) in a list of size n.

Link: https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/

Approach:
The problem requires us to find and delete the middle node of a linked list.
A common technique for finding the middle of a linked list is using two pointers: a slow pointer and a fast pointer.
The slow pointer moves one step at a time, while the fast pointer moves two steps at a time.
When the fast pointer reaches the end of the list (or null), the slow pointer will be at the middle node.

To delete the middle node, we need to keep track of the node *before* the middle node.
We can achieve this by initializing a 'prev' pointer to null and updating it to point to the slow pointer just before moving the slow pointer.

Edge Cases:
1. If the list has only one node (n=1), the middle node is the first node (index 0). Deleting it results in an empty list.
2. If the list has two nodes (n=2), the middle node is the second node (index 1). We need to set the next of the first node to null.

Algorithm:
1. Handle the edge case where the head is null or the list has only one node. If head is null or head.next is null, return null (or head as per problem statement for single node).
2. Initialize `slow = head`, `fast = head`, and `prev = null`.
3. Iterate while `fast` is not null and `fast.next` is not null:
    a. Update `prev = slow`.
    b. Move `slow = slow.next`.
    c. Move `fast = fast.next.next`.
4. After the loop, `slow` points to the middle node, and `prev` points to the node before the middle node.
5. To delete the middle node, set `prev.next = slow.next`.
6. Return the original `head`.

Time Complexity: O(n), where n is the number of nodes in the linked list. We traverse the list at most once with the two pointers.
Space Complexity: O(1), as we only use a constant amount of extra space for pointers.
*/

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
// Assume ListNode definition is available globally or provided by the environment.
// For local testing, you might uncomment and use this:
/*
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
*/

function deleteMiddle(head) {
    // Handle the edge case of an empty list or a list with only one node.
    // If the list has only one node, the middle node is the first node itself.
    // Deleting it results in an empty list, so we return null.
    if (!head || !head.next) {
        return null;
    }

    // Initialize slow and fast pointers for finding the middle node.
    // `slow` moves one step at a time, `fast` moves two steps at a time.
    let slow = head;
    let fast = head;
    // `prev` will keep track of the node just before the `slow` pointer.
    // This is necessary to re-link the list after deleting the middle node.
    let prev = null;

    // Iterate through the list. The loop terminates when `fast` reaches the end of the list.
    // `fast != null` ensures we don't access `next` on a null `fast` pointer.
    // `fast.next != null` ensures we don't access `next.next` on a null `fast.next` pointer.
    while (fast !== null && fast.next !== null) {
        // Before moving `slow`, update `prev` to point to the current `slow`.
        prev = slow;
        // Move `slow` one step forward.
        slow = slow.next;
        // Move `fast` two steps forward.
        fast = fast.next.next;
    }

    // At this point, `slow` is pointing to the middle node.
    // `prev` is pointing to the node immediately preceding the middle node.

    // To delete the middle node (`slow`), we bypass it by connecting `prev` to `slow.next`.
    // This effectively removes `slow` from the linked list.
    prev.next = slow.next;

    // Return the head of the modified linked list.
    return head;
}