// Summary: Find the minimum element in a rotated sorted array that may contain duplicates.
// Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/
// Approach:
// We will use a modified binary search algorithm. The key challenge with duplicates is that
// nums[left] == nums[mid] == nums[right] can occur. In such cases, we cannot definitively
// determine which half the minimum element lies in, so we safely shrink the search space
// by decrementing the right pointer. This is because if nums[right] is the minimum,
// and nums[left] == nums[right], then nums[left] is also the minimum. If nums[right]
// is not the minimum, then decrementing right won't lose the minimum.
//
// When nums[mid] > nums[right], it implies the pivot (minimum element) is in the right half.
// So, we move the left pointer to mid + 1.
//
// When nums[mid] < nums[right], it implies the pivot is in the left half (including mid).
// So, we move the right pointer to mid.
//
// The loop continues until left == right, at which point nums[left] (or nums[right])
// will be the minimum element.
//
// Time Complexity: O(N) in the worst case. The worst case occurs when all elements are
// duplicates (e.g., [3,3,3,3,3]). In this scenario, the `right--` operation might be
// executed N times, making it linear. In the average case, where duplicates are not
// pervasive, it can approach O(log N).
// Space Complexity: O(1) as we are only using a few variables.
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
    // Initialize left and right pointers for binary search.
    let left = 0;
    let right = nums.length - 1;

    // Continue the binary search as long as the left pointer is less than the right pointer.
    while (left < right) {
        // Calculate the middle index. Using floor to ensure it's an integer.
        let mid = Math.floor((left + right) / 2);

        // Case 1: nums[mid] > nums[right]
        // This indicates that the minimum element must be in the right half of the array,
        // because the right half is "larger" than the pivot point.
        // Example: [3, 4, 5, 1, 2] -> mid=5, right=2. 5 > 2, so minimum is in [1, 2].
        if (nums[mid] > nums[right]) {
            // Move the left pointer to mid + 1 to search in the right half.
            left = mid + 1;
        }
        // Case 2: nums[mid] < nums[right]
        // This indicates that the minimum element is in the left half, including the middle element itself.
        // The right half is sorted and larger than nums[mid].
        // Example: [1, 2, 3, 4, 5] -> mid=3, right=5. 3 < 5, so minimum is in [1, 2, 3].
        // Example: [4, 5, 1, 2, 3] -> mid=1, right=3. 1 < 3, so minimum is in [4, 5, 1].
        else if (nums[mid] < nums[right]) {
            // Move the right pointer to mid. We include mid because nums[mid] could be the minimum.
            right = mid;
        }
        // Case 3: nums[mid] == nums[right]
        // This is the scenario with duplicates. We cannot definitively say where the minimum is.
        // For example, [1, 1, 1, 0, 1] or [1, 0, 1, 1, 1].
        // In this case, we can safely discard the rightmost element.
        // If nums[right] is the minimum, and nums[mid] == nums[right], then nums[mid] is also the minimum,
        // and we haven't lost it. If nums[right] is not the minimum, then discarding it is fine.
        // This is the step that can lead to O(N) complexity in the worst case (all duplicates).
        else {
            // Decrement the right pointer to shrink the search space.
            right--;
        }
    }

    // When the loop terminates, left and right pointers will be equal,
    // pointing to the minimum element in the rotated sorted array.
    return nums[left];
};
```