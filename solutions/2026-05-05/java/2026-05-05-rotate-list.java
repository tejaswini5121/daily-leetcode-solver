// Rotate the given linked list to the right by k places.
// Problem Link: https://leetcode.com/problems/rotate-list/
//
// Approach:
// 1. Handle edge cases: If the list is empty, has only one node, or k is 0, return the original head.
// 2. Find the length of the linked list and identify the tail node.
// 3. Connect the tail node to the head to form a circular linked list.
// 4. Calculate the effective rotation steps: `k = k % length`. If `k` is 0 after this, it means no rotation is needed, so break the circle and return the original head.
// 5. Determine the new tail: The new tail will be `length - k - 1` nodes from the original head.
// 6. Find the new head: The new head will be the node immediately after the new tail.
// 7. Break the circular link by setting the `next` pointer of the new tail to `null`.
// 8. Return the new head.
//
// Time Complexity: O(N), where N is the number of nodes in the linked list.
// We iterate through the list twice: once to find the length and tail, and once to find the new tail.
//
// Space Complexity: O(1), as we only use a few extra variables to store pointers and the length.

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
    public ListNode rotateRight(ListNode head, int k) {
        // Handle edge cases: empty list, single node, or no rotation needed.
        if (head == null || head.next == null || k == 0) {
            return head;
        }

        // 1. Find the length of the list and the tail node.
        ListNode tail = head;
        int length = 1;
        while (tail.next != null) {
            tail = tail.next;
            length++;
        }

        // 2. Connect the tail to the head to form a circular linked list.
        tail.next = head;

        // 3. Calculate the effective rotation steps.
        // We need to move `length - k % length` steps to find the new tail.
        // For example, if length is 5 and k is 2, we need to move 5 - (2 % 5) = 3 steps.
        // This means the 3rd node (0-indexed) will be the new tail.
        // The node after that will be the new head.
        k = k % length; // Ensure k is within the bounds of the list length.

        // If k is 0 after modulo, it means no rotation is needed.
        // We should break the circle and return the original head.
        if (k == 0) {
            tail.next = null; // Break the circle.
            return head;
        }

        // 4. Find the new tail.
        // The new tail will be `length - k - 1` nodes away from the original head.
        ListNode newTail = head;
        for (int i = 0; i < length - k - 1; i++) {
            newTail = newTail.next;
        }

        // 5. Determine the new head.
        ListNode newHead = newTail.next;

        // 6. Break the circular link by setting the next pointer of the new tail to null.
        newTail.next = null;

        // 7. Return the new head.
        return newHead;
    }
}
```