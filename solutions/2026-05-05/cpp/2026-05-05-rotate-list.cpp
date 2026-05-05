// Problem Summary: Rotate a linked list to the right by k places.
// Link: https://leetcode.com/problems/rotate-list/
// Approach:
// 1. Handle edge cases: if the list is empty or has only one node, or k is 0, return the original head.
// 2. Calculate the length of the linked list.
// 3. Take the modulo of k with the length to get the effective number of rotations. If k % length is 0, no rotation is needed.
// 4. Find the new tail of the rotated list. This will be the node at (length - k - 1) position from the beginning.
// 5. The node after the new tail will be the new head.
// 6. Break the link after the new tail.
// 7. Connect the original tail of the list to the original head.
// 8. Return the new head.
//
// Time Complexity: O(N), where N is the number of nodes in the linked list. We traverse the list twice: once to find the length and the tail, and once to find the new tail.
// Space Complexity: O(1), as we only use a few pointers and do not use any extra space proportional to the input size.

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* rotateRight(ListNode* head, int k) {
        // Handle edge cases: empty list, single node list, or k = 0
        if (!head || !head->next || k == 0) {
            return head;
        }

        // 1. Calculate the length of the linked list and find the tail node.
        ListNode* tail = head;
        int length = 1;
        while (tail->next) {
            tail = tail->next;
            length++;
        }

        // 2. Calculate the effective number of rotations.
        // k can be very large, so we only care about k modulo the length.
        k %= length;

        // If k is 0 after modulo, it means no rotation is needed.
        if (k == 0) {
            return head;
        }

        // 3. Find the new tail of the rotated list.
        // The new tail will be at position (length - k - 1) from the beginning.
        ListNode* newTail = head;
        for (int i = 0; i < length - k - 1; ++i) {
            newTail = newTail->next;
        }

        // 4. The node after the new tail will be the new head.
        ListNode* newHead = newTail->next;

        // 5. Break the link after the new tail.
        newTail->next = nullptr;

        // 6. Connect the original tail of the list to the original head.
        tail->next = head;

        // 7. Return the new head.
        return newHead;
    }
};
