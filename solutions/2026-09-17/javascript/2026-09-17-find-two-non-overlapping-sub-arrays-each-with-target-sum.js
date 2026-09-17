/**
 * @summary Finds two non-overlapping sub-arrays with a target sum and minimizes the sum of their lengths.
 * @link https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/
 *
 * @approach
 * The problem asks for the minimum sum of lengths of two non-overlapping sub-arrays, each summing to `target`.
 *
 * We can solve this by iterating through the array and, for each element, considering it as the *end* of the first sub-array.
 * For each potential first sub-array ending at index `i`, we need to find the shortest sub-array *before* it (i.e., ending at an index `j < i`) that also sums to `target`.
 *
 * To efficiently find sub-arrays with a target sum, we can use a sliding window or prefix sums. Since the array elements are positive, a sliding window is suitable for finding sub-arrays summing to `target`.
 *
 * The core idea is to maintain the minimum length of a sub-array ending at or before a certain index.
 *
 * Let's define:
 * `minLenLeft[i]`: The minimum length of a sub-array that sums to `target` and ends at or before index `i`.
 *
 * We can compute `minLenLeft` by iterating through the array. For each `i`, if we find a sub-array ending at `i` with sum `target`, we update `minLenLeft[i]`. Otherwise, `minLenLeft[i] = minLenLeft[i-1]`.
 *
 * To find sub-arrays summing to `target` efficiently, we can use a sliding window approach.
 * We'll use two pointers, `left` and `right`, for the window. `currentSum` will track the sum of elements in the window `arr[left...right]`.
 *
 * As we expand the window by moving `right`:
 * - If `currentSum` equals `target`, we've found a sub-array. We record its length (`right - left + 1`).
 * - If `currentSum` exceeds `target`, we shrink the window by moving `left` forward until `currentSum` is less than or equal to `target`.
 *
 * Now, to find the minimum sum of two *non-overlapping* sub-arrays, we can iterate through the array from left to right and, for each index `i`, consider it as the *split point* between the two sub-arrays.
 *
 * If the first sub-array ends at or before index `i-1`, and the second sub-array starts at index `i`.
 *
 * A more efficient approach leverages the idea of pre-calculating minimum lengths from both left and right.
 *
 * 1. **Precompute `minLenLeft`**:
 *    Iterate from left to right. Maintain a sliding window `[left, right]` and `currentSum`.
 *    When `currentSum == target`, we've found a sub-array of length `len = right - left + 1`.
 *    `minLenLeft[right]` will store the minimum length of a target-sum sub-array ending at or before index `right`.
 *    `minLenLeft[right] = min(minLenLeft[right-1], len)`. Initialize `minLenLeft` with infinity.
 *
 * 2. **Precompute `minLenRight`**:
 *    Iterate from right to left. Maintain a sliding window `[left, right]` and `currentSum`.
 *    When `currentSum == target`, we've found a sub-array of length `len = right - left + 1`.
 *    `minLenRight[left]` will store the minimum length of a target-sum sub-array starting at or after index `left`.
 *    `minLenRight[left] = min(minLenRight[left+1], len)`. Initialize `minLenRight` with infinity.
 *
 * 3. **Find the Minimum Total Length**:
 *    Iterate through the array from `i = 0` to `n-2` (where `n` is `arr.length`).
 *    Consider `i` as the potential boundary between the two sub-arrays.
 *    The first sub-array ends at or before index `i`. Its minimum length is `minLenLeft[i]`.
 *    The second sub-array starts at or after index `i+1`. Its minimum length is `minLenRight[i+1]`.
 *    The sum of lengths for this split point is `minLenLeft[i] + minLenRight[i+1]`.
 *    We take the minimum of these sums over all possible `i`.
 *
 *    Initialize the overall minimum sum of lengths to infinity.
 *
 * If after all calculations, the minimum sum is still infinity, it means no such pair of sub-arrays exists, and we return -1.
 *
 * Edge cases:
 * - If `arr.length < 2`, it's impossible to find two sub-arrays. Return -1.
 * - Handle cases where no sub-array with sum `target` is found.
 *
 * @timeComplexity
 * O(N), where N is the length of the array. We iterate through the array a constant number of times (three passes: one for `minLenLeft`, one for `minLenRight`, and one for combining). The sliding window operations within each pass take amortized O(1) time per element.
 *
 * @spaceComplexity
 * O(N), for storing the `minLenLeft` and `minLenRight` arrays.
 */
var minSumOfLengths = function(arr, target) {
    const n = arr.length;

    // If the array has fewer than 2 elements, we cannot find two sub-arrays.
    if (n < 2) {
        return -1;
    }

    // Initialize an array to store the minimum length of a sub-array
    // with sum 'target' ending at or before index 'i'.
    // Initialize with a value larger than any possible sum of lengths.
    const minLenLeft = new Array(n).fill(Infinity);

    // Sliding window variables for left-to-right pass
    let left = 0;
    let currentSum = 0;
    // Stores the minimum length found so far in the left-to-right pass.
    let minSoFar = Infinity;

    // First pass: Calculate minLenLeft
    for (let right = 0; right < n; right++) {
        currentSum += arr[right];

        // Shrink the window from the left if the current sum exceeds the target
        while (currentSum > target && left <= right) {
            currentSum -= arr[left];
            left++;
        }

        // If the current sum equals the target, we found a valid sub-array.
        if (currentSum === target) {
            const currentLen = right - left + 1;
            // Update the minimum length found so far ending at or before 'right'.
            minSoFar = Math.min(minSoFar, currentLen);
            // Store this minimum length for index 'right'.
            minLenLeft[right] = minSoFar;
        } else {
            // If no sub-array ending at 'right' with target sum was found,
            // inherit the minimum length from the previous index.
            if (right > 0) {
                minLenLeft[right] = minLenLeft[right - 1];
            }
        }
    }

    // Initialize an array to store the minimum length of a sub-array
    // with sum 'target' starting at or after index 'i'.
    const minLenRight = new Array(n).fill(Infinity);

    // Sliding window variables for right-to-left pass
    left = n - 1;
    currentSum = 0;
    // Stores the minimum length found so far in the right-to-left pass.
    minSoFar = Infinity;

    // Second pass: Calculate minLenRight
    for (let right = n - 1; right >= 0; right--) {
        currentSum += arr[right];

        // Shrink the window from the right if the current sum exceeds the target
        while (currentSum > target && left >= right) {
            currentSum -= arr[left];
            left--;
        }

        // If the current sum equals the target, we found a valid sub-array.
        if (currentSum === target) {
            const currentLen = left - right + 1;
            // Update the minimum length found so far starting at or after 'right'.
            minSoFar = Math.min(minSoFar, currentLen);
            // Store this minimum length for index 'right'.
            minLenRight[right] = minSoFar;
        } else {
            // If no sub-array starting at 'right' with target sum was found,
            // inherit the minimum length from the next index.
            if (right < n - 1) {
                minLenRight[right] = minLenRight[right + 1];
            }
        }
    }

    // Third pass: Find the minimum sum of two non-overlapping sub-arrays.
    // Iterate through all possible split points 'i'.
    // The first sub-array ends at or before 'i', and the second starts at or after 'i+1'.
    let minTotalLength = Infinity;

    for (let i = 0; i < n - 1; i++) {
        // Ensure we have valid lengths for both sub-arrays.
        // minLenLeft[i] is the minimum length of a sub-array ending at or before 'i'.
        // minLenRight[i+1] is the minimum length of a sub-array starting at or after 'i+1'.
        if (minLenLeft[i] !== Infinity && minLenRight[i + 1] !== Infinity) {
            minTotalLength = Math.min(minTotalLength, minLenLeft[i] + minLenRight[i + 1]);
        }
    }

    // If minTotalLength is still infinity, it means no such pair of sub-arrays was found.
    return minTotalLength === Infinity ? -1 : minTotalLength;
};
```