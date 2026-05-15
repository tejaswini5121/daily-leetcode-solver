// Summary: Finds the minimum element in a sorted array that has been rotated.
// Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
// Approach: Binary search. The key idea is to identify which half of the array contains the minimum element.
// In a rotated sorted array, the minimum element is the only one that is smaller than its previous element (considering wrap-around).
// We use binary search to narrow down the search space.
// If nums[mid] > nums[right], it means the pivot (and thus the minimum element) lies in the right half (mid + 1 to right).
// If nums[mid] < nums[right], it means the minimum element is either nums[mid] or in the left half (left to mid).
// We can safely discard the right half (mid+1 to right) because if nums[mid] < nums[right], then all elements from mid+1 to right are greater than nums[mid] and therefore cannot be the minimum.
// If nums[mid] == nums[right], we can safely discard nums[right] because it is not the minimum (since we are guaranteed unique elements, and if it were the minimum, it would be smaller than nums[mid]). However, the problem states unique elements, so this case is simpler. If nums[mid] < nums[right], the minimum is in the left half or at mid. If nums[mid] > nums[right], the minimum is in the right half.
// The loop continues until left == right, at which point nums[left] (or nums[right]) is the minimum element.
// Time complexity: O(log n) because binary search halves the search space in each step.
// Space complexity: O(1) as we are using a constant amount of extra space.
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
    // Initialize left and right pointers for binary search.
    let left = 0;
    let right = nums.length - 1;

    // If the array is not rotated (i.e., the first element is smaller than the last),
    // the minimum element is the first element.
    if (nums[left] < nums[right]) {
        return nums[left];
    }

    // Perform binary search.
    while (left < right) {
        // Calculate the middle index.
        let mid = Math.floor((left + right) / 2);

        // If the middle element is greater than the rightmost element,
        // it means the pivot (and hence the minimum element) is in the right half.
        // We discard the left half including the middle element by setting left = mid + 1.
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        }
        // If the middle element is less than or equal to the rightmost element,
        // it means the minimum element is in the left half or is the middle element itself.
        // We discard the right half by setting right = mid.
        // We don't do right = mid - 1 because nums[mid] could potentially be the minimum.
        else {
            right = mid;
        }
    }

    // When the loop terminates, left and right pointers will be pointing to the minimum element.
    return nums[left];
};
```