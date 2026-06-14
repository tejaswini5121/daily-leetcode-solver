```cpp
// Problem: Maximum Twin Sum of a Linked List
// Link: https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/
//
// Approach:
// The problem asks for the maximum sum of a node and its twin. A twin of the i-th node (0-indexed)
// is the (n-1-i)-th node, where n is the even length of the linked list. This means we need to pair
// the first half of the list with the reversed second half.
//
// We can solve this by:
// 1. Finding the middle of the linked list. We can use the fast and slow pointer technique. The slow
//    pointer will end up at the head of the second half of the list when the fast pointer reaches the end.
// 2. Reversing the second half of the linked list. This will allow us to easily access the twin nodes
//    in a parallel traversal.
// 3. Traversing the first half of the original list and the reversed second half simultaneously.
//    For each pair of nodes (one from the first half, one from the reversed second half), calculate
//    their sum and keep track of the maximum sum found so far.
//
// Time Complexity:
// O(n), where n is the number of nodes in the linked list.
// - Finding the middle: O(n/2) which is O(n).
// - Reversing the second half: O(n/2) which is O(n).
// - Traversing and summing: O(n/2) which is O(n).
//
// Space Complexity:
// O(1). We are only using a few extra pointers for traversal and manipulation, no additional data structures
// that scale with the input size are used.
//

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
    int pairSum(ListNode* head) {
        // 1. Find the middle of the linked list using fast and slow pointers.
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        // 'slow' is now at the head of the second half of the list.

        // 2. Reverse the second half of the linked list.
        ListNode* prev = nullptr;
        ListNode* current = slow;
        ListNode* next_node = nullptr;
        while (current != nullptr) {
            next_node = current->next; // Store the next node
            current->next = prev;      // Reverse the current node's pointer
            prev = current;            // Move pointers one position ahead
            current = next_node;
        }
        // 'prev' is now the head of the reversed second half.

        // 3. Traverse the first half and the reversed second half simultaneously, calculating twin sums.
        ListNode* first_half_ptr = head;
        ListNode* second_half_ptr = prev; // Head of the reversed second half
        int max_twin_sum = 0;

        while (second_half_ptr != nullptr) { // Iterate until the end of the reversed second half
            int current_twin_sum = first_half_ptr->val + second_half_ptr->val;
            max_twin_sum = std::max(max_twin_sum, current_twin_sum);

            first_half_ptr = first_half_ptr->next;
            second_half_ptr = second_half_ptr->next;
        }

        // Note: We don't need to restore the original list structure as per the problem's requirement
        // of just returning the maximum twin sum.

        return max_twin_sum;
    }
};
```