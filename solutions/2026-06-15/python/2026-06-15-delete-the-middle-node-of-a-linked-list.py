```python
# Problem: Delete the Middle Node of a Linked List
# Link: https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/
# Approach:
# We can use the two-pointer (slow and fast pointer) technique to find the middle node.
# The fast pointer moves twice as fast as the slow pointer. When the fast pointer reaches the end of the list,
# the slow pointer will be at the middle node.
# To delete the middle node, we need to keep track of the node *before* the middle node.
# We can achieve this by initializing a 'prev' pointer to None and updating it to point to the slow pointer
# just before moving the slow pointer.
# If the list has only one node, there is no middle node to delete, so we return the head.
# Otherwise, after finding the middle node and the previous node, we update the 'next' pointer of the 'prev' node
# to skip the middle node, effectively deleting it.
# Time Complexity: O(n), where n is the number of nodes in the linked list. We traverse the list once.
# Space Complexity: O(1), as we only use a few extra pointers.

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def deleteMiddle(self, head: ListNode | None) -> ListNode | None:
        # Handle the edge case where the list is empty or has only one node.
        # If there's only one node, there's no middle node to delete.
        if not head or not head.next:
            return head

        slow = head
        fast = head
        prev = None # Pointer to the node before the middle node

        # Move the fast pointer two steps and the slow pointer one step.
        # When the fast pointer reaches the end, the slow pointer will be at the middle node.
        while fast and fast.next:
            prev = slow          # Keep track of the node before the slow pointer
            slow = slow.next     # Move slow pointer one step
            fast = fast.next.next # Move fast pointer two steps

        # 'slow' is now pointing to the middle node.
        # 'prev' is pointing to the node just before the middle node.

        # Delete the middle node by bypassing it.
        # We update the 'next' pointer of the 'prev' node to point to the node after 'slow'.
        prev.next = slow.next

        # Return the head of the modified linked list.
        return head

```