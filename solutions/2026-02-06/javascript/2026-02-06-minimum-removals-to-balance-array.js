/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
// Problem: Minimum Removals to Balance Array
// Link: https://leetcode.com/problems/minimum-removals-to-balance-array/
// Approach:
// The problem asks us to find the minimum number of elements to remove from an array `nums`
// such that the remaining array is "balanced". An array is balanced if its maximum element
// is at most `k` times its minimum element. We can remove any number of elements, but the
// remaining array must not be empty. An array of size 1 is always balanced.
//
// The core idea is to realize that if we sort the array `nums`, any balanced subarray
// will be a contiguous subsegment of the sorted array. This is because if we have a
// balanced subarray `S` with minimum `min_S` and maximum `max_S` such that `max_S <= min_S * k`,
// and we consider a larger subarray `S'` that includes `S` and potentially other elements
// from the original `nums`, then the minimum of `S'` will be less than or equal to `min_S`,
// and the maximum of `S'` will be greater than or equal to `max_S`. If `S'` is to be balanced,
// its new minimum `min_S'` and maximum `max_S'` must satisfy `max_S' <= min_S' * k`.
// However, if we fix the minimum element of a potential balanced subarray, say `nums[i]`
// (after sorting), then we want to find the furthest element `nums[j]` (where `j >= i`)
// such that `nums[j] <= nums[i] * k`. All elements `nums[i], nums[i+1], ..., nums[j]`
// will form a balanced subarray. We want to maximize the length of this subarray (`j - i + 1`)
// to minimize the number of elements removed (`nums.length - (j - i + 1)`).
//
// So, the strategy is:
// 1. Sort the array `nums`.
// 2. Iterate through each element `nums[i]` as a potential minimum of a balanced subarray.
// 3. For each `nums[i]`, find the largest index `j` such that `nums[j] <= nums[i] * k`.
//    We can efficiently find `j` using binary search (e.g., `upper_bound` or a custom binary search).
//    The `upper_bound` function in C++ returns an iterator to the first element *greater than*
//    a given value. We are looking for the last element *less than or equal to* `nums[i] * k`.
//    So, if `upper_bound` points to index `p`, then the last element less than or equal to
//    `nums[i] * k` is at index `p - 1`.
// 4. The length of the balanced subarray starting with `nums[i]` is `j - i + 1`.
// 5. We want to find the maximum such length across all possible `i`.
// 6. The minimum number of removals will be `nums.length - max_length`.
//
// Example: nums = [1, 2, 5], k = 2
// Sorted nums: [1, 2, 5]
//
// i = 0, nums[i] = 1
//   Target for max element: 1 * 2 = 2
//   Find largest j such that nums[j] <= 2.
//   nums[0] = 1 <= 2
//   nums[1] = 2 <= 2
//   nums[2] = 5 > 2
//   So, j = 1.
//   Balanced subarray: [1, 2] (length 2). Removals = 3 - 2 = 1.
//
// i = 1, nums[i] = 2
//   Target for max element: 2 * 2 = 4
//   Find largest j such that nums[j] <= 4.
//   nums[1] = 2 <= 4
//   nums[2] = 5 > 4
//   So, j = 1.
//   Balanced subarray: [2] (length 1). Removals = 3 - 1 = 2.
//
// i = 2, nums[i] = 5
//   Target for max element: 5 * 2 = 10
//   Find largest j such that nums[j] <= 10.
//   nums[2] = 5 <= 10
//   So, j = 2.
//   Balanced subarray: [5] (length 1). Removals = 3 - 1 = 2.
//
// Maximum length found is 2. Minimum removals = 3 - 2 = 1.
//
// We can optimize finding `j` for each `i`. Since both `nums[i]` and `nums[j]`
// are increasing, as `i` increases, `nums[i]` increases, and `nums[i] * k` also increases.
// This means the `j` we find for a given `i` will be greater than or equal to the `j`
// found for the previous `i`. This suggests a two-pointer approach or a sliding window.
//
// Two-pointer approach:
// 1. Sort `nums`.
// 2. Initialize `left = 0`, `right = 0`, `max_len = 0`.
// 3. While `right < nums.length`:
//    a. While `nums[right] > nums[left] * k`:
//       Increment `left`. (Shrink the window from the left because `nums[left]` is too small to balance `nums[right]`)
//    b. Now, `nums[right] <= nums[left] * k`. This means the subarray from `left` to `right` is balanced.
//    c. Update `max_len = Math.max(max_len, right - left + 1)`.
//    d. Increment `right`. (Expand the window to the right to find a potentially longer balanced subarray).
// 4. Return `nums.length - max_len`.
//
// Time Complexity Analysis:
// - Sorting the array takes O(N log N) time, where N is the length of `nums`.
// - The two-pointer approach involves iterating through the array with two pointers.
//   The `right` pointer moves from 0 to N-1, and the `left` pointer also moves forward.
//   In the worst case, both pointers traverse the array once. So, this part is O(N).
// - Therefore, the overall time complexity is dominated by sorting: O(N log N).
//
// Space Complexity Analysis:
// - Sorting in JavaScript might use O(log N) or O(N) space depending on the implementation
//   (e.g., Timsort or mergesort). If in-place sort is used, it could be O(1) auxiliary space
//   excluding the input array modification.
// - The two-pointer approach uses only a few variables, so it's O(1) auxiliary space.
// - Overall, the space complexity is typically considered O(log N) or O(N) due to sorting.
//
// Let's refine the two-pointer approach.
// We sort `nums`.
// We use two pointers, `left` and `right`. `left` represents the potential minimum of a balanced subarray,
// and `right` represents the potential maximum.
// We want to maintain the invariant that `nums[right] <= nums[left] * k`.
//
// Initialize `left = 0`, `max_len = 0`.
// Iterate `right` from 0 to `nums.length - 1`.
// For each `right`:
//   While `nums[right] > nums[left] * k`:
//     Increment `left`. This is because `nums[left]` is too small to form a balanced subarray
//     with `nums[right]` as the maximum. We need a larger minimum, so we move `left` forward.
//   Once the loop finishes, it means `nums[right] <= nums[left] * k`.
//   The subarray `nums[left...right]` is balanced.
//   The length of this balanced subarray is `right - left + 1`.
//   Update `max_len = Math.max(max_len, right - left + 1)`.
//
// After the loop, `max_len` will hold the length of the longest balanced subarray.
// The minimum number of removals is `nums.length - max_len`.
//
// Edge case: If `nums.length` is 1, the loop might not run as expected, but a single element array is always balanced, length is 1.
// If `nums.length > 0`, `max_len` will be at least 1 (by considering a single element subarray `nums[i...i]`).
// The problem statement guarantees `nums.length >= 1`.
//
// Consider nums = [1, 6, 2, 9], k = 3
// Sorted nums: [1, 2, 6, 9]
// N = 4
//
// left = 0, max_len = 0
//
// right = 0: nums[right] = 1
//   nums[0] = 1, nums[left] = 1. nums[0] <= nums[0] * 3 (1 <= 3). Condition holds.
//   max_len = max(0, 0 - 0 + 1) = 1.
//
// right = 1: nums[right] = 2
//   nums[1] = 2, nums[left] = 1. nums[1] <= nums[0] * 3 (2 <= 3). Condition holds.
//   max_len = max(1, 1 - 0 + 1) = 2.
//
// right = 2: nums[right] = 6
//   nums[2] = 6, nums[left] = 1. nums[2] > nums[0] * 3 (6 > 3).
//   Increment left. left becomes 1.
//   Now, nums[left] = 2.
//   Check condition again: nums[2] <= nums[1] * 3 (6 <= 2 * 3). (6 <= 6). Condition holds.
//   max_len = max(2, 2 - 1 + 1) = 2.
//
// right = 3: nums[right] = 9
//   nums[3] = 9, nums[left] = 2. nums[3] > nums[1] * 3 (9 > 6).
//   Increment left. left becomes 2.
//   Now, nums[left] = 6.
//   Check condition again: nums[3] <= nums[2] * 3 (9 <= 6 * 3). (9 <= 18). Condition holds.
//   max_len = max(2, 3 - 2 + 1) = 2.
//
// Loop ends.
// Return N - max_len = 4 - 2 = 2.
// This matches Example 2.
//
// Consider nums = [4, 6], k = 2
// Sorted nums: [4, 6]
// N = 2
//
// left = 0, max_len = 0
//
// right = 0: nums[right] = 4
//   nums[0] = 4, nums[left] = 4. nums[0] <= nums[0] * 2 (4 <= 8). Condition holds.
//   max_len = max(0, 0 - 0 + 1) = 1.
//
// right = 1: nums[right] = 6
//   nums[1] = 6, nums[left] = 4. nums[1] <= nums[0] * 2 (6 <= 8). Condition holds.
//   max_len = max(1, 1 - 0 + 1) = 2.
//
// Loop ends.
// Return N - max_len = 2 - 2 = 0.
// This matches Example 3.
//
// The two-pointer approach seems correct and efficient.
//
// Let's consider the constraints:
// 1 <= nums.length <= 10^5
// 1 <= nums[i] <= 10^9
// 1 <= k <= 10^5
//
// The values of nums[i] can be large, so nums[left] * k can exceed the standard 32-bit integer limit.
// JavaScript uses floating-point numbers for all numbers, which can represent values up to 2^53 - 1 safely.
// 10^9 * 10^5 = 10^14. This is well within the safe integer range for JavaScript numbers.
// So, no overflow issues with `nums[left] * k`.
//
// Implementation details:
// - Use `nums.sort((a, b) => a - b)` for ascending sort.
// - Initialize `left = 0`, `max_len = 0`.
// - Loop `right` from 0 to `nums.length - 1`.
// - Inside the loop, use a `while` loop to adjust `left`.
// - Update `max_len`.
// - Finally, return `nums.length - max_len`.
//
// What if `nums` is empty? The problem statement says `1 <= nums.length`.
// What if `k = 1`?
// If `k = 1`, then we need `max <= min * 1`, meaning `max <= min`. This is only possible if all elements in the balanced subarray are equal.
// Example: nums = [1, 2, 2, 3], k = 1
// Sorted: [1, 2, 2, 3]
// N = 4
// left = 0, max_len = 0
//
// right = 0: nums[0]=1, nums[0]=1. 1 <= 1*1. max_len = 1.
// right = 1: nums[1]=2, nums[0]=1. 2 > 1*1. left++. left=1. nums[1]=2, nums[1]=2. 2 <= 2*1. max_len = max(1, 1-1+1) = 1.
// right = 2: nums[2]=2, nums[1]=2. 2 <= 2*1. max_len = max(1, 2-1+1) = 2.
// right = 3: nums[3]=3, nums[1]=2. 3 > 2*1. left++. left=2. nums[3]=3, nums[2]=2. 3 > 2*1. left++. left=3. nums[3]=3, nums[3]=3. 3 <= 3*1. max_len = max(2, 3-3+1) = 2.
//
// Result: 4 - 2 = 2.
// This means we keep [2, 2].
// Seems correct.
//
// Let's consider `nums.length = 1`.
// nums = [5], k = 10
// Sorted: [5]
// N = 1
// left = 0, max_len = 0
//
// right = 0: nums[0]=5, nums[0]=5. 5 <= 5*10. max_len = max(0, 0-0+1) = 1.
// Loop ends.
// Return 1 - 1 = 0. Correct.
//
// The logic seems solid.
 */
const minimumRemovalsToBalanceArray = (nums, k) => {
    // Sort the array to easily find potential minimums and maximums for balanced subarrays.
    // A balanced subarray in the original array, when sorted, will correspond to a contiguous subsegment of the sorted array.
    nums.sort((a, b) => a - b);

    const n = nums.length;
    let left = 0; // Pointer for the start of the potential balanced subarray (potential minimum)
    let maxLen = 0; // Stores the length of the longest balanced subarray found so far

    // Iterate through the sorted array with the 'right' pointer.
    // 'right' represents the end of the potential balanced subarray (potential maximum).
    for (let right = 0; right < n; right++) {
        // For the current subarray ending at 'right', we need to ensure that
        // nums[right] <= nums[left] * k.
        // If this condition is violated (i.e., nums[right] is too large for nums[left] to be the minimum),
        // we need to advance the 'left' pointer to find a larger potential minimum.
        // This effectively shrinks the window from the left until the balance condition is met.
        while (nums[right] > nums[left] * k) {
            left++;
        }

        // At this point, the subarray from index 'left' to 'right' is balanced because
        // nums[right] <= nums[left] * k.
        // We update maxLen with the length of this currently found balanced subarray.
        // The length is (right - left + 1).
        maxLen = Math.max(maxLen, right - left + 1);
    }

    // The minimum number of elements to remove is the total number of elements
    // minus the length of the longest balanced subarray we found.
    return n - maxLen;
};
