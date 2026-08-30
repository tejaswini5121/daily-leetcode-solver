// Problem: Removing Minimum and Maximum From Array
// Link: https://leetcode.com/problems/removing-minimum-and-maximum-from-array/
//
// Approach:
// The problem asks for the minimum number of deletions to remove both the minimum and maximum elements from an array.
// Deletions can only be performed from the front or back of the array.
//
// First, we need to find the minimum and maximum elements and their indices in the array.
// Once we have these, there are three main scenarios for removing both elements:
// 1. Remove both from the left: This requires deleting elements from the front up to and including the rightmost of the two target elements (min or max). The number of deletions is `max(indexOfMin, indexOfMax) + 1`.
// 2. Remove both from the right: This requires deleting elements from the back up to and including the leftmost of the two target elements (min or max). The number of deletions is `n - min(indexOfMin, indexOfMax)`, where `n` is the length of the array.
// 3. Remove one from the left and one from the right: This means we take elements from the left up to one of the target elements, and from the right up to the other. The total deletions would be `(indexOfMin + 1)` from the left and `(n - indexOfMax)` from the right, OR `(indexOfMax + 1)` from the left and `(n - indexOfMin)` from the right. The minimum deletions in this case would be `min(indexOfMin, indexOfMax) + 1` (from the left) + `n - max(indexOfMin, indexOfMax)` (from the right). This simplifies to `n - (max(indexOfMin, indexOfMax) - min(indexOfMin, indexOfMax) + 1)` elements kept in the middle. Thus, deletions are `n - (elements kept)`.
//
// Let's re-evaluate scenario 3 more clearly:
// Consider `min_idx` and `max_idx`. Let's assume `min_idx < max_idx` without loss of generality (we can swap them if not).
// Option A: Remove `min_idx` from left, `max_idx` from right. Deletions: `(min_idx + 1) + (n - max_idx)`.
//
// So, the three possible minimum deletion strategies are:
// 1. Remove from left until both are gone: `max(min_idx, max_idx) + 1`
// 2. Remove from right until both are gone: `n - min(min_idx, min_idx)`
// 3. Remove from left up to one, and from right up to the other.
//    If `min_idx` is removed from left (`min_idx + 1` deletions) and `max_idx` from right (`n - max_idx` deletions), total is `min_idx + 1 + n - max_idx`.
//    If `max_idx` is removed from left (`max_idx + 1` deletions) and `min_idx` from right (`n - min_idx` deletions), total is `max_idx + 1 + n - min_idx`.
//    The minimum of these two would be `min(min_idx + 1 + n - max_idx, max_idx + 1 + n - min_idx)`.
//
// This can be simplified. Let `left_idx = min(min_idx, max_idx)` and `right_idx = max(min_idx, max_idx)`.
// The number of elements to remove from the left to get both is `right_idx + 1`.
// The number of elements to remove from the right to get both is `n - left_idx`.
// The number of elements to remove by taking from both ends:
//   Remove `left_idx` from left (`left_idx + 1` deletions) and `right_idx` from right (`n - right_idx` deletions). Total: `left_idx + 1 + n - right_idx`.
//
// Therefore, the minimum number of deletions is the minimum of these three values:
// `min(right_idx + 1, n - left_idx, left_idx + 1 + n - right_idx)`
//
// Time Complexity: O(n) to find min/max and their indices. The rest are O(1) operations.
// Space Complexity: O(1) for storing variables.
//
#include <iostream>
#include <vector>
#include <algorithm>
#include <limits>

class Solution {
public:
    int minimumDeletions(std::vector<int>& nums) {
        int n = nums.size();

        // Handle the edge case where the array has only one element.
        // In this case, that element is both the minimum and maximum,
        // and it requires 1 deletion.
        if (n == 1) {
            return 1;
        }

        // Find the minimum and maximum elements and their indices.
        int minVal = std::numeric_limits<int>::max();
        int maxVal = std::numeric_limits<int>::min();
        int minIdx = -1;
        int maxIdx = -1;

        for (int i = 0; i < n; ++i) {
            if (nums[i] < minVal) {
                minVal = nums[i];
                minIdx = i;
            }
            if (nums[i] > maxVal) {
                maxVal = nums[i];
                maxIdx = i;
            }
        }

        // Determine the indices for the leftmost and rightmost of the two target elements.
        // This simplifies the calculation of deletions.
        int leftIdx = std::min(minIdx, maxIdx);
        int rightIdx = std::max(minIdx, maxIdx);

        // There are three possible strategies to remove both elements:

        // Strategy 1: Remove both from the left side.
        // We need to delete all elements up to and including the rightmost of the two elements.
        // The number of deletions is `rightIdx + 1` (since indices are 0-based).
        int deletions_from_left = rightIdx + 1;

        // Strategy 2: Remove both from the right side.
        // We need to delete all elements from the right up to and including the leftmost of the two elements.
        // The number of elements to keep from the left is `leftIdx + 1`.
        // The number of deletions from the right is `n - (leftIdx + 1)`.
        // Or, more simply, the index of the leftmost element from the right is `n - 1 - leftIdx`.
        // So, we need to delete `(n - 1 - leftIdx) + 1 = n - leftIdx` elements from the right.
        int deletions_from_right = n - leftIdx;

        // Strategy 3: Remove one element from the left and the other from the right.
        // This means we remove elements up to the `leftIdx` from the front,
        // and elements from the end up to the `rightIdx`.
        // Number of deletions from the left to reach `leftIdx` is `leftIdx + 1`.
        // Number of deletions from the right to reach `rightIdx` is `n - rightIdx`.
        // Total deletions for this strategy: `(leftIdx + 1) + (n - rightIdx)`.
        int deletions_mixed = (leftIdx + 1) + (n - rightIdx);

        // The minimum number of deletions is the minimum of these three strategies.
        return std::min({deletions_from_left, deletions_from_right, deletions_mixed});
    }
};
```