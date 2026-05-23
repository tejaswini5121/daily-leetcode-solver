```cpp
// Problem: Check if Array Is Sorted and Rotated
// Link: https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/
//
// Approach:
// The problem asks if an array can be obtained by rotating a non-decreasingly sorted array.
// A rotated sorted array will have at most one "descent" or "break" in the non-decreasing order.
// For example, in [3, 4, 5, 1, 2], the break is between 5 and 1.
// If the array is already sorted, there are no breaks.
// If the array is sorted and rotated, there will be exactly one place where nums[i] > nums[(i+1) % n].
// If there are zero breaks, it means the array is sorted (and thus a valid rotation of itself).
// If there is exactly one break, it means it's a valid rotation of a sorted array.
// If there are more than one breaks, it's not a valid rotated sorted array.
// We iterate through the array and count the number of times nums[i] > nums[(i+1) % n].
// The modulo operator (%) handles the wrap-around from the last element to the first.
//
// Time complexity: O(n), where n is the length of the array. We iterate through the array once.
// Space complexity: O(1), as we only use a constant amount of extra space for the counter.

#include <vector>
#include <numeric>

class Solution {
public:
    bool check(std::vector<int>& nums) {
        int n = nums.size();
        int breaks = 0; // Counter for the number of "breaks" in non-decreasing order

        // Iterate through the array and count the number of times nums[i] > nums[i+1]
        // The modulo operator (i + 1) % n handles the wrap-around for the last element
        // to compare with the first element.
        for (int i = 0; i < n; ++i) {
            if (nums[i] > nums[(i + 1) % n]) {
                breaks++;
            }
        }

        // An array is a rotated sorted array if it has 0 or 1 break.
        // 0 breaks means the array is already sorted non-decreasingly.
        // 1 break means it's a rotated version of a sorted array.
        return breaks <= 1;
    }
};
```