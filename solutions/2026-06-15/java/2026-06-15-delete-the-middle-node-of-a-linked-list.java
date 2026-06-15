// Problem: Delete the Middle Node of a Linked List
// Link: https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/
// Approach:
// We use the fast and slow pointer technique to find the middle node.
// The fast pointer moves two steps at a time, while the slow pointer moves one step at a time.
// When the fast pointer reaches the end of the list, the slow pointer will be at the middle node.
// To delete the middle node, we need to keep track of the node *before* the middle node.
// We can achieve this by initializing a `prev` pointer to null and updating it to `slow`
// just before moving `slow` in each iteration.
// Once the middle node is found, we set `prev.next` to `slow.next`, effectively skipping the middle node.
// A special case is when the list has only one node. In this case, the middle node is the only node,
// and deleting it results in an empty list, so we return null.
//
// Time Complexity: O(n), where n is the number of nodes in the linked list.
// We traverse the list once with the slow and fast pointers.
// Space Complexity: O(1), as we only use a few extra pointers.

/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    /**
     * Deletes the middle node of a singly-linked list.
     *
     * @param head The head of the linked list.
     * @return The head of the modified linked list.
     */
    public ListNode deleteMiddle(ListNode head) {
        // Handle the edge case where the list has only one node.
        // In this case, the middle node is the only node, and deleting it
        // results in an empty list.
        if (head.next == null) {
            return null;
        }

        ListNode slow = head; // Slow pointer moves one step at a time.
        ListNode fast = head; // Fast pointer moves two steps at a time.
        ListNode prev = null; // Pointer to the node before the slow pointer.

        // Traverse the list using the fast and slow pointers.
        // The fast pointer will reach the end of the list first.
        // When fast reaches the end, slow will be at the middle node.
        while (fast != null && fast.next != null) {
            prev = slow; // Update prev to be the current slow pointer before moving slow.
            slow = slow.next; // Move slow pointer one step.
            fast = fast.next.next; // Move fast pointer two steps.
        }

        // At this point, 'slow' is the middle node.
        // 'prev' is the node just before the middle node.
        // We delete the middle node by linking 'prev' to 'slow.next'.
        // This effectively bypasses the 'slow' node.
        prev.next = slow.next;

        // Return the head of the modified linked list.
        return head;
    }

    // Definition for singly-linked list.
    public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }
}
