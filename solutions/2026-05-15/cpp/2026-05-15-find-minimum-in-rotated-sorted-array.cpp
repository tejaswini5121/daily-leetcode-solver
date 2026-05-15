```cpp
// Finds the minimum element in a rotated sorted array of unique elements.
// Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
// Approach:
// We use binary search to efficiently find the minimum element.
// The key idea is to compare the middle element with the rightmost element.
// If nums[mid] > nums[right], it means the minimum element lies in the right half (mid+1 to right)
// because the left half (left to mid) is still sorted in ascending order, and the "dip" must be to the right of mid.
// If nums[mid] < nums[right], it means the minimum element is either nums[mid] or in the left half (left to mid).
// We then narrow down the search space accordingly.
// If the array is not rotated (e.g., [1, 2, 3, 4, 5]), the minimum will be the first element.
// Time Complexity: O(log n) - Binary search reduces the search space by half in each step.
// Space Complexity: O(1) - We only use a few variables for pointers, no extra space proportional to input size.
class Solution {
public:
    int findMin(vector<int>& nums) {
        // Initialize left and right pointers for binary search.
        int left = 0;
        int right = nums.size() - 1;

        // If the array has only one element, it's the minimum.
        if (nums.size() == 1) {
            return nums[0];
        }

        // If the array is not rotated, the first element is the minimum.
        // This check handles cases like [1, 2, 3, 4, 5].
        if (nums[left] < nums[right]) {
            return nums[left];
        }

        // Binary search loop to find the minimum element.
        while (left < right) {
            // Calculate the middle index. Using (left + right) / 2 can lead to overflow
            // for very large left and right values. A safer way is left + (right - left) / 2.
            int mid = left + (right - left) / 2;

            // Case 1: If nums[mid] is greater than nums[right],
            // it means the pivot (and thus the minimum element) lies in the right half.
            // The left part (from left to mid) is sorted, and the dip occurs after mid.
            if (nums[mid] > nums[right]) {
                left = mid + 1; // Move left pointer to mid + 1 to search in the right half.
            }
            // Case 2: If nums[mid] is less than or equal to nums[right],
            // it means the minimum element is either nums[mid] or it lies in the left half.
            // The right part (from mid to right) is sorted, and the dip could be at mid or before it.
            else { // nums[mid] <= nums[right]
                right = mid; // Move right pointer to mid. We don't do mid - 1 because mid itself could be the minimum.
            }
        }

        // When the loop terminates, 'left' and 'right' will point to the same index,
        // which is the index of the minimum element.
        return nums[left];
    }
};
```