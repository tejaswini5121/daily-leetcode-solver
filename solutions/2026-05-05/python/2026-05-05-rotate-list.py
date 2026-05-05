```python
# Rotates a linked list to the right by k places.
# Link: https://leetcode.com/problems/rotate-list/
#
# Approach:
# 1. Handle edge cases: If the list is empty, has only one node, or k is 0, return the original head.
# 2. Calculate the length of the linked list and find the tail node.
# 3. Make the list circular by connecting the tail to the head.
# 4. Calculate the effective rotation amount: k % length.
# 5. Find the new tail node: This will be the node (length - k - 1) steps from the original head.
# 6. Find the new head node: This will be the node immediately after the new tail.
# 7. Break the circle by setting the new tail's next pointer to None.
# 8. Return the new head.
#
# Time Complexity: O(N), where N is the number of nodes in the linked list.
# We traverse the list twice: once to find the length and tail, and once to find the new tail.
#
# Space Complexity: O(1), as we only use a few extra variables.

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def rotateRight(self, head: ListNode | None, k: int) -> ListNode | None:
        # Handle edge cases: empty list, single node list, or k is 0
        if not head or not head.next or k == 0:
            return head

        # 1. Calculate the length of the linked list and find the tail node.
        length = 1
        tail = head
        while tail.next:
            tail = tail.next
            length += 1

        # 2. Calculate the effective rotation amount.
        # We only care about the remainder of k divided by the length of the list.
        # If k is a multiple of the length, no rotation is needed.
        k = k % length
        if k == 0:
            return head

        # 3. Make the list circular by connecting the tail to the head.
        tail.next = head

        # 4. Find the new tail node.
        # The new tail will be (length - k - 1) steps from the original head.
        # For example, if length is 5 and k is 2, we need to move (5 - 2 - 1) = 2 steps.
        # The node at index 2 (0-indexed) will be the new tail.
        steps_to_new_tail = length - k - 1
        new_tail = head
        for _ in range(steps_to_new_tail):
            new_tail = new_tail.next

        # 5. Find the new head node.
        # The new head is the node immediately after the new tail.
        new_head = new_tail.next

        # 6. Break the circle by setting the new tail's next pointer to None.
        new_tail.next = None

        # 7. Return the new head.
        return new_head

```