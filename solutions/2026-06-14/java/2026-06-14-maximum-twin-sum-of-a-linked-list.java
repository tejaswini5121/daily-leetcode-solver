```java
/**
 * Problem Summary: Find the maximum sum of a node and its twin in a linked list of even length.
 * A twin of the i-th node is the (n-1-i)-th node, where n is the list length.
 * Link: https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/
 *
 * Approach:
 * 1. Find the middle of the linked list using the slow and fast pointer technique.
 * 2. While moving the slow pointer to the middle, reverse the first half of the linked list.
 * 3. Once the middle is found, iterate through the reversed first half and the second half simultaneously.
 * 4. Calculate the twin sum for each pair of nodes and keep track of the maximum sum.
 *
 * Time Complexity: O(n) - We traverse the list to find the middle, reverse the first half, and then traverse again to find the max twin sum.
 * Space Complexity: O(1) - We only use a few pointers, not proportional to the input size.
 */

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
    public int pairSum(ListNode head) {
        // Find the middle of the linked list and reverse the first half.
        ListNode slow = head;
        ListNode fast = head;
        ListNode prev = null; // Pointer to build the reversed first half

        // Move fast pointer two steps at a time and slow pointer one step.
        // While doing so, reverse the first half of the list.
        while (fast != null && fast.next != null) {
            fast = fast.next.next; // Move fast pointer two steps

            ListNode temp = slow.next; // Store the next node of slow
            slow.next = prev; // Reverse the link of slow node
            prev = slow;      // Move prev to the current slow node
            slow = temp;      // Move slow pointer one step
        }

        // At this point, 'prev' points to the head of the reversed first half.
        // 'slow' points to the head of the second half of the original list.
        // If the list has an odd number of nodes (which is not the case here since n is even),
        // 'slow' would be at the middle node. For even length lists, 'slow' is the start of the second half.

        int maxSum = 0;

        // Iterate through the reversed first half and the second half simultaneously.
        // Calculate the twin sum for each pair and update maxSum.
        while (prev != null && slow != null) {
            int currentSum = prev.val + slow.val; // Calculate twin sum
            maxSum = Math.max(maxSum, currentSum); // Update maximum sum

            prev = prev.next; // Move to the next node in the reversed first half
            slow = slow.next; // Move to the next node in the second half
        }

        return maxSum;
    }

    // Helper class for ListNode (if not provided by LeetCode environment)
    public static class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    // Example Usage (for testing purposes)
    public static void main(String[] args) {
        Solution sol = new Solution();

        // Example 1: head = [5,4,2,1]
        ListNode head1 = new ListNode(5, new ListNode(4, new ListNode(2, new ListNode(1))));
        System.out.println("Example 1 Output: " + sol.pairSum(head1)); // Expected: 6

        // Example 2: head = [4,2,2,3]
        ListNode head2 = new ListNode(4, new ListNode(2, new ListNode(2, new ListNode(3))));
        System.out.println("Example 2 Output: " + sol.pairSum(head2)); // Expected: 7

        // Example 3: head = [1,100000]
        ListNode head3 = new ListNode(1, new ListNode(100000));
        System.out.println("Example 3 Output: " + sol.pairSum(head3)); // Expected: 100001
    }
}
```