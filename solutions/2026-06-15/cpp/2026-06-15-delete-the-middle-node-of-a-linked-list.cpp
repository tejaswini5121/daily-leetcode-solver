// Problem: Delete the Middle Node of a Linked List
// Link: https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/
// Approach: Use the fast and slow pointer technique. The slow pointer moves one step at a time,
// while the fast pointer moves two steps at a time. When the fast pointer reaches the end of the
// list, the slow pointer will be at the middle node. We need to keep track of the node *before*
// the middle node to update its 'next' pointer to skip the middle node.
// Time Complexity: O(N), where N is the number of nodes in the linked list, because we traverse
// the list once with the fast and slow pointers.
// Space Complexity: O(1), as we only use a constant amount of extra space for the pointers.

#include <iostream>

// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* deleteMiddle(ListNode* head) {
        // Handle the edge case where the list has only one node.
        // In this case, the middle node is the head itself, and deleting it results in an empty list.
        if (!head->next) {
            return nullptr;
        }

        // Initialize two pointers:
        // 'slow' pointer moves one step at a time.
        // 'fast' pointer moves two steps at a time.
        // We also need a pointer 'prev' to keep track of the node *before* the slow pointer.
        // This is crucial for deleting the middle node.
        ListNode* slow = head;
        ListNode* fast = head;
        ListNode* prev = nullptr; // Pointer to the node before 'slow'

        // Traverse the list using fast and slow pointers.
        // The loop continues as long as 'fast' and 'fast->next' are not null.
        // This ensures 'fast' can always move two steps ahead.
        while (fast && fast->next) {
            // Move 'prev' to the current 'slow' position before 'slow' moves.
            prev = slow;
            // Move 'slow' one step forward.
            slow = slow->next;
            // Move 'fast' two steps forward.
            fast = fast->next->next;
        }

        // At this point, 'slow' is pointing to the middle node.
        // 'prev' is pointing to the node just before the middle node.
        // To delete the middle node ('slow'), we update 'prev->next' to skip 'slow'.
        // This effectively removes 'slow' from the list.
        prev->next = slow->next;

        // Optionally, you can deallocate the memory for the deleted middle node.
        // delete slow; // Not strictly required by LeetCode for this problem, but good practice.

        // Return the head of the modified linked list.
        return head;
    }
};

// Helper function to create a linked list from a vector.
ListNode* createLinkedList(const std::vector<int>& values) {
    if (values.empty()) {
        return nullptr;
    }
    ListNode* head = new ListNode(values[0]);
    ListNode* current = head;
    for (size_t i = 1; i < values.size(); ++i) {
        current->next = new ListNode(values[i]);
        current = current->next;
    }
    return head;
}

// Helper function to print a linked list.
void printLinkedList(ListNode* head) {
    ListNode* current = head;
    while (current) {
        std::cout << current->val << " ";
        current = current->next;
    }
    std::cout << std::endl;
}

// Helper function to delete a linked list (to prevent memory leaks).
void deleteLinkedList(ListNode* head) {
    ListNode* current = head;
    ListNode* nextNode = nullptr;
    while (current) {
        nextNode = current->next;
        delete current;
        current = nextNode;
    }
}

int main() {
    // Example 1
    std::vector<int> values1 = {1, 3, 4, 7, 1, 2, 6};
    ListNode* head1 = createLinkedList(values1);
    std::cout << "Original list 1: ";
    printLinkedList(head1);
    Solution sol;
    ListNode* newHead1 = sol.deleteMiddle(head1);
    std::cout << "Modified list 1: ";
    printLinkedList(newHead1);
    deleteLinkedList(newHead1); // Clean up memory

    // Example 2
    std::vector<int> values2 = {1, 2, 3, 4};
    ListNode* head2 = createLinkedList(values2);
    std::cout << "Original list 2: ";
    printLinkedList(head2);
    ListNode* newHead2 = sol.deleteMiddle(head2);
    std::cout << "Modified list 2: ";
    printLinkedList(newHead2);
    deleteLinkedList(newHead2); // Clean up memory

    // Example 3
    std::vector<int> values3 = {2, 1};
    ListNode* head3 = createLinkedList(values3);
    std::cout << "Original list 3: ";
    printLinkedList(head3);
    ListNode* newHead3 = sol.deleteMiddle(head3);
    std::cout << "Modified list 3: ";
    printLinkedList(newHead3);
    deleteLinkedList(newHead3); // Clean up memory

    // Example with a single node
    std::vector<int> values4 = {5};
    ListNode* head4 = createLinkedList(values4);
    std::cout << "Original list 4: ";
    printLinkedList(head4);
    ListNode* newHead4 = sol.deleteMiddle(head4);
    std::cout << "Modified list 4: ";
    printLinkedList(newHead4);
    // For an empty list, no need to deleteLinkedList as it will be null.

    return 0;
}
