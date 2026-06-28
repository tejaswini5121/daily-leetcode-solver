/*
 * Problem Summary: Given an array of positive integers, rearrange and decrease elements so that the first element is 1 and the absolute difference between adjacent elements is at most 1. Find the maximum possible value of an element in the modified array.
 * Link: https://leetcode.com/problems/maximum-element-after-decreasing-and-rearranging/
 * Approach Explanation:
 * The goal is to maximize the last element of the rearranged array while satisfying the conditions.
 * The conditions are:
 * 1. The first element must be 1.
 * 2. abs(arr[i] - arr[i-1]) <= 1 for all i > 0.
 *
 * This implies that if the first element is 1, the second element can be at most 2, the third at most 3, and so on.
 * Specifically, arr[i] <= arr[i-1] + 1. Since we want to maximize the elements, we should aim for arr[i] = arr[i-1] + 1.
 * This suggests that the ideal arrangement would be [1, 2, 3, ..., k] for some k.
 *
 * We can rearrange the elements freely. This freedom is crucial. To get the maximum possible element, we should try to form a sequence like [1, 2, 3, ...].
 *
 * Consider sorting the array first. If `arr` is sorted, say `arr_sorted`.
 * The first element must be 1. We can always make `arr_sorted[0]` equal to 1 by decreasing it if it's greater than 1.
 * Let `currentMax` be the maximum value we have successfully placed in our "ideal" sequence. Initially, `currentMax` is 1 (for the first element).
 *
 * Iterate through the sorted array starting from the second element. For each element `num` in the sorted array:
 * If `num` is greater than or equal to `currentMax + 1`, it means we can use `num` (or decrease it to `currentMax + 1`) to extend our sequence.
 * For example, if our sequence is `[1, 2]` (currentMax = 2) and the next sorted number is 5, we can use 5 (decreasing it to 3) to form `[1, 2, 3]`.
 * So, if `num >= currentMax + 1`, we can increment `currentMax` by 1. We effectively "use" this `num` to become `currentMax + 1`.
 * If `num < currentMax + 1`, it means this `num` is too small to extend the sequence. For example, if sequence is `[1, 2]` (currentMax = 2) and next sorted number is 2. We cannot make it 3. We have to "skip" this 2, because we already have a 2 (or a number that became 2). We cannot place two 2s adjacently (unless one is 1 and the other is 2, or both are 2, but we are trying to build 1, 2, 3, ...). If we have [1,2] and next is 2, we can't make it [1,2,3]. We would still have a 2 available for future use or discard it. The key is that `currentMax` represents the maximum value we have *successfully formed* in a prefix of the `1, 2, 3, ...` sequence. If we encounter a number that is less than `currentMax + 1`, it means we cannot extend the sequence using this number to make it `currentMax + 1`. We must effectively "discard" this number or use it for a smaller value we have already covered. However, since we want to maximize the final element, we only care about extending the sequence. So, if `num < currentMax + 1`, we effectively ignore `num` because it cannot contribute to forming `currentMax + 1`.
 *
 * Let's refine the logic:
 * 1. Sort the input array `arr`.
 * 2. Set the first element of `arr` to 1. (This satisfies the first condition and is the smallest possible start.)
 * 3. Iterate from the second element `arr[1]` to the end `arr[n-1]`.
 * 4. For each `arr[i]`, if `arr[i]` is greater than `arr[i-1] + 1`, it means we have a gap. We can decrease `arr[i]` to `arr[i-1] + 1` to satisfy the adjacency condition and maximize its value. So, `arr[i] = arr[i-1] + 1`.
 * 5. If `arr[i]` is less than or equal to `arr[i-1] + 1`, it means it already satisfies the condition or is even smaller. We don't need to decrease it further than its current value, as we want to maximize. If `arr[i] <= arr[i-1]`, we can still potentially use it as `arr[i-1]` if we had chosen not to increment `arr[i-1]`. But since we are trying to build `1, 2, 3, ...`, we want to make `arr[i]` as large as possible without violating `arr[i] <= arr[i-1] + 1`. The minimum value `arr[i]` can take is `arr[i-1]`. The maximum is `arr[i-1] + 1`.
 * The greedy strategy after sorting:
 * The first element `arr[0]` must become 1.
 * For `arr[i]` (where `i > 0`), it must satisfy `arr[i] <= arr[i-1] + 1`. To maximize the overall final element, we want to make `arr[i]` as large as possible.
 * If `arr[i]` (original value) is greater than `arr[i-1] + 1` (the value of the previous element after adjustments + 1), we should decrease `arr[i]` to `arr[i-1] + 1`. This uses the available `arr[i]` element to form the largest possible value in the sequence without violating the adjacency rule.
 * If `arr[i]` (original value) is less than or equal to `arr[i-1] + 1`, we don't need to decrease it. Its original value is already valid (or even smaller). We take `arr[i]` as its original value. For example, if we have [1, 2, 1, 5] and we want to process 1 after [1,2]. The current last element is 2. The next number is 1. We can't make it 3. We still have [1,2]. We could make it [1,2,2]. The crucial part is that the sorted array ensures we always pick the smallest available number to try and form the next sequence number.
 *
 * Let's reconsider.
 * If we sort `arr`: `[1, 2, 2, 2, 1]` becomes `[1, 1, 2, 2, 2]`.
 * `arr[0]` = 1.
 * `arr[1]` = 1. `arr[1]` should be at most `arr[0] + 1 = 2`. Since `1 <= 2`, it's valid. The final `arr[1]` can be `1` or `2`. To maximize the end, we want `arr[1]` to be `min(original_arr[1], arr[0]+1)`. So `arr[1] = min(1, 1+1) = 1`.
 * This leads to `arr = [1,1, ...]`. But we want `[1,2,...]`.
 *
 * The `currentMax` approach is more robust.
 * 1. Sort the array `arr`.
 * 2. Initialize `currentMaxExpected = 1`. This will represent the largest value we can currently construct in our strictly increasing sequence `[1, 2, ..., currentMaxExpected]`.
 * 3. Iterate through the sorted `arr`. For each `num` in `arr`:
 *    If `num >= currentMaxExpected`: this `num` can be used to form `currentMaxExpected`. For example, if `currentMaxExpected = 1` and `num = 100`, we can use `num` to form `1`. If `currentMaxExpected = 2` and `num = 100`, we can use `num` to form `2`.
 *    Actually, if `num >= currentMaxExpected`, we can always take `num` and decrease it to `currentMaxExpected`. This effectively "uses up" `num` to become `currentMaxExpected`. After using it, the next number we can form must be `currentMaxExpected + 1`. So, we increment `currentMaxExpected`.
 *    The `currentMaxExpected` represents the next number we are trying to establish in our 1, 2, 3, ... sequence.
 *    For example, `arr = [100, 1, 1000]`. Sorted `arr = [1, 100, 1000]`.
 *    `currentMaxExpected = 1`.
 *    - Process `num = 1`: `1 >= 1`. Yes. So we can make the first element 1. Increment `currentMaxExpected` to 2.
 *    - Process `num = 100`: `100 >= 2`. Yes. So we can make the second element 2 (by decreasing 100 to 2). Increment `currentMaxExpected` to 3.
 *    - Process `num = 1000`: `1000 >= 3`. Yes. So we can make the third element 3 (by decreasing 1000 to 3). Increment `currentMaxExpected` to 4.
 *    Final `currentMaxExpected` is 4. But the question asks for the max element in the resulting array. The resulting array would be `[1, 2, 3]`. So the max element is 3.
 *    This means the result is `currentMaxExpected - 1` (because `currentMaxExpected` is always one step ahead, indicating the *next* number we are trying to form).
 *
 *    Let's trace `arr = [2,2,1,2,1]`. Sorted `arr = [1,1,2,2,2]`.
 *    `currentMaxExpected = 1`.
 *    - Process `num = 1`: `1 >= 1`. Yes. Increment `currentMaxExpected` to 2. (We've formed a '1').
 *    - Process `num = 1`: `1 >= 2`. No. This means we cannot use this '1' to form a '2'. We effectively skip this '1'.
 *    - Process `num = 2`: `2 >= 2`. Yes. Increment `currentMaxExpected` to 3. (We've formed a '2').
 *    - Process `num = 2`: `2 >= 3`. No. Skip.
 *    - Process `num = 2`: `2 >= 3`. No. Skip.
 *    Final `currentMaxExpected` is 3. Max element is `3-1 = 2`. This matches example 1.
 *
 * This refined `currentMaxExpected` approach seems correct. It essentially counts how many distinct values `1, 2, 3, ...` we can form using the available elements. Each element from the sorted array is either used to increment `currentMaxExpected` (if it's large enough) or skipped (if it's too small to be the next value in the sequence).
 * The final answer is `currentMaxExpected - 1` because `currentMaxExpected` is always the *next* value we *could* form if an element was available, so the largest value actually formed is one less.
 *
 * Time Complexity:
 * 1. Sorting the array: O(N log N) where N is the length of `arr`.
 * 2. Iterating through the sorted array: O(N).
 * Total time complexity: O(N log N).
 *
 * Space Complexity:
 * 1. Sorting might take O(log N) or O(N) space depending on the sort implementation (e.g., merge sort uses O(N), quicksort uses O(log N) average for recursion stack). If `Arrays.sort` is an in-place sort like dual-pivot quicksort for primitives, it could be O(log N). Let's assume O(log N) for typical in-place sorts.
 * 2. No additional significant data structures are used.
 * Total space complexity: O(log N) or O(N) depending on sort implementation. If the problem meant "extra space", it would be O(1) beyond the input array modified in place. `Arrays.sort` for primitive types in Java is typically a tuned quicksort for small arrays and mergesort for larger arrays, using O(logN) or O(N) space.
 */

import java.util.Arrays;

class Solution {
    public int maximumElementAfterDecrementingAndRearranging(int[] arr) {
        // Sort the array in non-decreasing order.
        // This is the first crucial step because we can rearrange elements freely.
        // By sorting, we can greedily try to form the sequence 1, 2, 3, ...
        // by picking the smallest available number that can extend our sequence.
        Arrays.sort(arr);

        // After sorting, the first element must be 1. We can always decrease arr[0] to 1.
        // So, let's effectively set arr[0] to 1.
        // We use a variable `currentMaxExpected` to keep track of the largest number
        // we have successfully formed in a strictly increasing sequence (1, 2, 3, ...).
        // Initially, we expect the first element to be 1.
        int currentMaxExpected = 1;

        // Iterate through the sorted array starting from the second element (index 1).
        // The first element `arr[0]` is implicitly handled to be 1.
        // If the array has only one element, this loop won't run, and `currentMaxExpected`
        // will remain 1, correctly yielding 1 as the result.
        for (int i = 1; i < arr.length; i++) {
            // We want to form a sequence like [1, 2, 3, ..., currentMaxExpected, currentMaxExpected + 1, ...].
            // We are looking for an element in `arr` that can become `currentMaxExpected`.
            // Since `arr` is sorted, `arr[i]` is the smallest available number that is
            // greater than or equal to `arr[i-1]`.

            // If the current element `arr[i]` is greater than or equal to `currentMaxExpected`,
            // it means we can use `arr[i]` (possibly decreasing it) to become `currentMaxExpected`.
            // By doing so, we have successfully formed the number `currentMaxExpected` in our sequence.
            // For the next number in the sequence, we will try to form `currentMaxExpected + 1`.
            // Example: currentMaxExpected = 2. We are trying to find an element to become 2.
            // If arr[i] is 5, we can decrease 5 to 2. Now currentMaxExpected becomes 3.
            // If currentMaxExpected = 2, and arr[i] is 2, we can use it as 2. currentMaxExpected becomes 3.
            // This greedy strategy works because sorting ensures we always consider the smallest
            // available candidates, allowing us to build the longest possible 1, 2, 3, ... sequence.
            if (arr[i] >= currentMaxExpected + 1) {
                currentMaxExpected++;
            }
            // If arr[i] < currentMaxExpected + 1, it means arr[i] is too small to form
            // the next expected number (currentMaxExpected + 1). We cannot use it to extend the
            // sequence further. We effectively "skip" this element for the purpose of extending
            // the 1, 2, 3... sequence. The current `currentMaxExpected` doesn't change,
            // as we haven't successfully formed `currentMaxExpected + 1`.
            // Note: The first element `arr[0]` is effectively made 1. So if `arr[0]` was 5,
            // it becomes 1. `currentMaxExpected` becomes 2. Then if `arr[1]` is 1,
            // `1 < 2` (currentMaxExpected + 1), so we skip it.
            // If `arr[1]` is 100, `100 >= 2`, so `currentMaxExpected` becomes 3.
        }

        // After iterating through all elements, `currentMaxExpected` holds the value
        // that is one greater than the largest element we were able to form in the array.
        // For example, if we form [1, 2, 3], then `currentMaxExpected` would be 4.
        // So, the maximum element in the resulting array is `currentMaxExpected - 1`.
        return currentMaxExpected;
    }
}