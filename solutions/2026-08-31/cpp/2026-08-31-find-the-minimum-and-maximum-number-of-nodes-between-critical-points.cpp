// Problem Summary: Given a singly linked list, find the minimum and maximum distances between any two "critical points". A critical point is a local maxima or local minima (a node strictly greater/smaller than its neighbors). If fewer than two critical points exist, return [-1, -1].
// Link: https://leetcode.com/problems/find-the-minimum-and-maximum-number-of-nodes-between-critical-points/
// Approach Explanation: The problem requires identifying local maxima and minima in a linked list and then calculating distances between them. We traverse the linked list once, keeping track of the current node, its previous node, and its next node to check the critical point conditions. During traversal, we also maintain a 1-based index for each node. We store the index of the first critical point found, the index of the last critical point found, and the index of the immediately preceding critical point. As we find new critical points, we update the minimum distance found so far (using the immediately preceding critical point) and keep track of the first and last critical point indices. After the traversal, if at least two critical points were found, the maximum distance is simply the difference between the last and first critical point indices. Otherwise, we return [-1, -1].
// Time Complexity Analysis: O(N), where N is the number of nodes in the linked list. We iterate through the linked list exactly once to identify critical points and calculate distances. Each node is processed in constant time.
// Space Complexity Analysis: O(1). We use a constant amount of extra space for a few pointers (prev, curr, next) and integer variables to store indices and distances. No auxiliary data structures that scale with N are used.

#include <vector>     // Required for std::vector
#include <algorithm>  // Required for std::min
#include <climits>    // Required for INT_MAX

// Definition for singly-linked list.
// This structure is typically provided by LeetCode, but included here for a self-contained solution.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    std::vector<int> nodesBetweenCriticalPoints(ListNode* head) {
        // A critical point requires a previous and a next node.
        // Therefore, a list must have at least 3 nodes for any critical points to exist.
        // If the list has 0, 1, or 2 nodes, no critical points are possible.
        // e.g., for head = [3,1], head->next->next is nullptr, so this condition is met.
        if (!head || !head->next || !head->next->next) {
            return {-1, -1}; // Return [-1, -1] as per problem statement
        }

        // Initialize pointers for the traversal.
        // We start by considering 'curr' as a potential critical point.
        // 'prev' is the node before 'curr', 'next' is the node after 'curr'.
        ListNode* prev = head;         // Node at 1-based index `currentIndex - 1`
        ListNode* curr = head->next;   // Node at 1-based index `currentIndex`
        ListNode* next = curr->next;   // Node at 1-based index `currentIndex + 1`

        // Variables to track critical points and distances.
        int firstCriticalPointIndex = -1;  // Stores the 1-based index of the very first critical point found.
        int lastCriticalPointIndex = -1;   // Stores the 1-based index of the most recently found critical point.
        int prevCriticalPointIndex = -1;   // Stores the 1-based index of the critical point found just before the current one.
                                          // Used to calculate minimum distance between adjacent critical points.
        int minDistance = INT_MAX;         // Initialize minDistance to maximum possible integer value to easily find the minimum.

        // `currentIndex` represents the 1-based index of the `curr` node.
        // Initially, `head` is at index 1, `head->next` (curr) at index 2, `head->next->next` (next) at index 3.
        int currentIndex = 2; 

        // Iterate through the linked list.
        // The loop continues as long as 'next' is not nullptr, which ensures
        // that 'curr' always has both a 'prev' and a 'next' node.
        while (next != nullptr) {
            // Check if the 'curr' node is a local maxima: strictly greater than its neighbors.
            bool isLocalMaxima = (curr->val > prev->val && curr->val > next->val);
            // Check if the 'curr' node is a local minima: strictly smaller than its neighbors.
            bool isLocalMinima = (curr->val < prev->val && curr->val < next->val);

            // If 'curr' is a critical point (either a local maxima or a local minima)
            if (isLocalMaxima || isLocalMinima) {
                // If this is the first critical point we've encountered, record its index.
                if (firstCriticalPointIndex == -1) {
                    firstCriticalPointIndex = currentIndex;
                }
                
                // If we've found at least one critical point before this one ('prevCriticalPointIndex' is not -1),
                // calculate the distance from the previous critical point to the current one
                // and update minDistance if this distance is smaller.
                if (prevCriticalPointIndex != -1) {
                    minDistance = std::min(minDistance, currentIndex - prevCriticalPointIndex);
                }
                
                // Update the index of the most recently found critical point.
                lastCriticalPointIndex = currentIndex;
                // Set the current critical point's index as the 'previous' for the next iteration's minDistance calculation.
                prevCriticalPointIndex = currentIndex;
            }

            // Move all three pointers one step forward in the list.
            prev = curr;
            curr = next;
            next = next->next;
            // Increment the current node's index.
            currentIndex++;
        }

        // After the traversal, check if we found fewer than two distinct critical points.
        // This happens if `firstCriticalPointIndex` is still -1 (no critical points found at all)
        // or if `firstCriticalPointIndex` is equal to `lastCriticalPointIndex` (only one critical point found).
        if (firstCriticalPointIndex == -1 || firstCriticalPointIndex == lastCriticalPointIndex) {
            return {-1, -1};
        }

        // If at least two distinct critical points were found, calculate the maximum distance.
        // This is simply the distance between the very first and the very last critical point encountered.
        int maxDistance = lastCriticalPointIndex - firstCriticalPointIndex;

        // Return the calculated minimum and maximum distances.
        return {minDistance, maxDistance};
    }
};