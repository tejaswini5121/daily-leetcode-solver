// Summary: Find the minimum element in a sorted rotated array that may contain duplicates.
// Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/
// Approach:
// We will use a modified binary search approach.
// The core idea is to compare the middle element with the rightmost element.
// If nums[mid] < nums[right], it means the minimum element is in the left half (including mid)
// because the right half is sorted and greater than or equal to nums[mid].
// If nums[mid] > nums[right], it means the minimum element is in the right half (excluding mid)
// because the left half is sorted and greater than nums[right].
// The tricky part comes when nums[mid] == nums[right]. In this case, we cannot definitively
// say which half contains the minimum. However, we know that the minimum element cannot be
// nums[right] itself if nums[mid] == nums[right] and nums[mid] is not the minimum.
// Therefore, we can safely discard nums[right] by decrementing `right`. This might degrade
// the performance to O(n) in the worst case (e.g., [1,1,1,1,1]), but on average it remains O(log n).
// Time Complexity: O(log n) on average, O(n) in the worst case (e.g., all elements are the same).
// Space Complexity: O(1).
#include <vector>
#include <algorithm>

class Solution {
public:
    int findMin(std::vector<int>& nums) {
        // Initialize left and right pointers for binary search.
        int left = 0;
        int right = nums.size() - 1;

        // Perform binary search until left and right pointers meet.
        while (left < right) {
            // Calculate the middle index.
            int mid = left + (right - left) / 2;

            // If the middle element is less than the rightmost element,
            // the minimum element must be in the left half (including mid)
            // because the right portion is sorted in ascending order from mid.
            if (nums[mid] < nums[right]) {
                right = mid;
            }
            // If the middle element is greater than the rightmost element,
            // the minimum element must be in the right half (excluding mid)
            // because the pivot point (where the rotation occurs) is to the right of mid.
            else if (nums[mid] > nums[right]) {
                left = mid + 1;
            }
            // If nums[mid] == nums[right], we cannot determine which half contains the minimum
            // with certainty. However, we can safely discard the rightmost element
            // because if nums[right] were the minimum, then nums[mid] would also be
            // the minimum, and reducing `right` would not lose the minimum.
            // This step is crucial for handling duplicates and can lead to O(n) in the worst case.
            else { // nums[mid] == nums[right]
                right--;
            }
        }

        // When the loop terminates, left and right pointers will point to the minimum element.
        return nums[left];
    }
};
