# Problem: Find the Minimum and Maximum Number of Nodes Between Critical Points
# Link: https://leetcode.com/problems/find-the-minimum-and-maximum-number-of-nodes-between-critical-points/
#
# Problem Summary:
# Given a singly linked list, find "critical points" which are local maxima
# or local minima. A node is a local maxima if its value is strictly greater
# than its previous and next nodes. A node is a local minima if its value is
# strictly smaller than its previous and next nodes. The first and last nodes
# cannot be critical points. Return an array [minDistance, maxDistance]
# representing the minimum and maximum distances between any two distinct
# critical points. If fewer than two critical points exist, return [-1, -1].
#
# Approach Explanation:
# 1. Initialize an empty list `critical_points_indices` to store the 0-based
#    indices of all critical points found during the traversal.
# 2. Use three pointers (`prev_node`, `curr_node`, `next_node`) and an `index`
#    counter (starting from 1, as `head` is at index 0) to iterate through the
#    linked list. `prev_node` starts at `head`, `curr_node` starts at `head.next`.
# 3. The traversal loop continues as long as `curr_node` and `curr_node.next` are
#    not None. This ensures that for every `curr_node` being examined, there is
#    both a `prev_node` and a `next_node` available, which is a prerequisite
#    for a node to be a critical point.
# 4. Inside the loop, check if the `curr_node` meets the criteria for a local
#    maxima (`curr_node.val > prev_node.val` AND `curr_node.val > next_node.val`)
#    or a local minima (`curr_node.val < prev_node.val` AND `curr_node.val < next_node.val`).
# 5. If `curr_node` is a critical point, add its current `index` to the
#    `critical_points_indices` list.
# 6. After checking, advance the pointers: `prev_node` becomes `curr_node`,
#    `curr_node` becomes `next_node`, and `index` is incremented.
# 7. Once the traversal is complete, check the length of `critical_points_indices`.
#    If it contains fewer than two elements, it means not enough critical points
#    were found to calculate distances, so return `[-1, -1]`.
# 8. Otherwise, calculate `maxDistance` as the difference between the index of the
#    last critical point and the first critical point in the list.
# 9. Calculate `minDistance` by iterating through `critical_points_indices` and
#    finding the minimum difference between any two adjacent critical points.
#    Initialize `minDistance` to a very large value (e.g., `float('inf')`) and
#    update it with `min(minDistance, critical_points_indices[i+1] - critical_points_indices[i])`.
# 10. Finally, return the calculated `[minDistance, maxDistance]`.
#
# Time Complexity:
# O(N), where N is the number of nodes in the linked list.
# We perform a single pass through the linked list to identify all critical points.
# This operation takes O(N) time. Subsequently, we iterate through the list of
# critical point indices (which can have at most N/2 elements) to calculate the
# minimum distance. This takes O(C) time, where C is the number of critical points,
# which is also O(N) in the worst case. Therefore, the overall time complexity is O(N).
#
# Space Complexity:
# O(N), where N is the number of nodes in the linked list.
# In the worst case, every other node could be a critical point (e.g., a list with
# alternating local maxima and minima). This would require storing approximately
# N/2 indices in the `critical_points_indices` list. Thus, the space complexity is O(N).

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def nodesBetweenCriticalPoints(self, head: ListNode) -> list[int]:
        # List to store the 0-based indices of all critical points found.
        critical_points_indices = []
        
        # We need three pointers: prev_node, curr_node, and curr_node.next
        # to determine if curr_node is a critical point.
        # The first and last nodes cannot be critical points, as they lack
        # a previous or next node respectively.
        
        # Initialize prev_node to the head of the list.
        prev_node = head
        # Initialize curr_node to the second node.
        # If head is None or head.next is None, curr_node will be None,
        # and the loop condition will correctly handle this (no critical points possible).
        curr_node = head.next
        # Initialize index. We use 0-based indexing for convenience.
        # head is at index 0, curr_node (head.next) is at index 1.
        index = 1
        
        # Iterate through the list. The loop condition `curr_node and curr_node.next`
        # ensures that `curr_node` is not the last node and can have a `next_node`.
        # This way, `prev_node`, `curr_node`, and `curr_node.next` are always valid
        # for checking critical point conditions.
        while curr_node and curr_node.next:
            # Get the next node in the sequence.
            next_node = curr_node.next
            
            # Check for local maxima: curr_node.val is strictly greater than its neighbors.
            is_local_maxima = curr_node.val > prev_node.val and curr_node.val > next_node.val
            # Check for local minima: curr_node.val is strictly smaller than its neighbors.
            is_local_minima = curr_node.val < prev_node.val and curr_node.val < next_node.val
            
            # If curr_node is either a local maxima or a local minima, it's a critical point.
            if is_local_maxima or is_local_minima:
                critical_points_indices.append(index)
            
            # Move pointers to the next nodes for the next iteration.
            prev_node = curr_node
            curr_node = next_node
            index += 1
            
        # After traversing the list, check the number of critical points found.
        # If there are fewer than two critical points, return [-1, -1].
        if len(critical_points_indices) < 2:
            return [-1, -1]
        
        # Calculate maxDistance: the distance between the first and last critical points.
        # Since critical_points_indices is sorted, this is simply the difference
        # between the last and first element.
        max_distance = critical_points_indices[-1] - critical_points_indices[0]
        
        # Calculate minDistance: the minimum distance between any two adjacent critical points.
        # Initialize min_distance to a very large value.
        min_distance = float('inf')
        # Iterate through the critical_points_indices list to find the minimum difference
        # between consecutive critical points.
        for i in range(len(critical_points_indices) - 1):
            min_distance = min(min_distance, critical_points_indices[i+1] - critical_points_indices[i])
            
        # Return the calculated minDistance and maxDistance.
        return [min_distance, max_distance]