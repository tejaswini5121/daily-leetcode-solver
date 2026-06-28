/*
 * Problem Summary:
 * Given an array of positive integers, modify it by decreasing elements and rearranging
 * such that the first element is 1 and the absolute difference between any adjacent elements
 * is at most 1. The goal is to find the maximum possible value of an element in the modified array.
 *
 * Link: https://leetcode.com/problems/maximum-element-after-decreasing-and-rearranging/
 *
 * Approach Explanation:
 * The problem asks us to maximize the largest element in the array after performing
 * two types of operations: decreasing any element and rearranging the array.
 * The conditions are:
 * 1. The first element must be 1.
 * 2. The absolute difference between adjacent elements must be at most 1 (i.e., |arr[i] - arr[i-1]| <= 1).
 *
 * To achieve the maximum possible value for an element, we want to create a sequence
 * that increases as much as possible while adhering to the conditions. The ideal
 * sequence would be `[1, 2, 3, ..., k]` because it maximizes each element while
 * satisfying the adjacency condition `|arr[i] - arr[i-1]| = 1`.
 *
 * The strategy is greedy:
 * 1. Sort the input array `arr` in non-decreasing order. This is crucial because
 *    rearranging is allowed, and sorting allows us to process elements in an
 *    order that helps us build the longest possible increasing sequence starting from 1.
 * 2. Initialize a variable `max_val_so_far` to 0. This variable will track
 *    the largest value we have successfully placed in our constructed sequence
 *    (e.g., if `max_val_so_far` is 3, it means we have successfully formed `[1, 2, 3, ...]`).
 * 3. Iterate through each number `num` in the sorted array:
 *    a. For the first element, `max_val_so_far` will become 1 (since `num >= 1`, we can always set `num` to 1).
 *    b. For subsequent elements, if `num` is greater than or equal to `max_val_so_far + 1`:
 *       This means we have an available number `num` that is large enough to become
 *       `max_val_so_far + 1` (by decreasing `num` if it's too large).
 *       By doing this, we extend our sequence by 1 and increment `max_val_so_far`.
 *       So, we update `max_val_so_far = max_val_so_far + 1`.
 *    c. If `num` is less than `max_val_so_far + 1`:
 *       This means `num` is too small to form `max_val_so_far + 1`. We cannot use
 *       this particular `num` to increment our sequence further. We effectively skip
 *       this element and `max_val_so_far` remains unchanged, hoping a later, larger
 *       element can be used.
 * 4. After iterating through all elements, `max_val_so_far` will hold the maximum
 *    possible value for an element in the final array. This is because we greedily
 *    tried to increment the maximum possible value at each step using the smallest
 *    available elements that satisfy the condition.
 *
 * Example walkthrough: arr = [100, 1, 1000]
 * 1. Sort arr: [1, 100, 1000]
 * 2. max_val_so_far = 0
 * 3. Iterate:
 *    - num = 1: `1 >= 0 + 1` is true. `max_val_so_far` becomes 1. (Constructed sequence: [1])
 *    - num = 100: `100 >= 1 + 1` (i.e., `100 >= 2`) is true. `max_val_so_far` becomes 2. (Constructed sequence: [1, 2])
 *    - num = 1000: `1000 >= 2 + 1` (i.e., `1000 >= 3`) is true. `max_val_so_far` becomes 3. (Constructed sequence: [1, 2, 3])
 * Final max_val_so_far is 3.
 *
 * Time Complexity:
 * O(N log N) - Dominated by the sorting step, where N is the length of the input array `arr`.
 * The subsequent iteration through the sorted array takes O(N) time.
 *
 * Space Complexity:
 * O(log N) or O(N) - Depends on the sorting algorithm used by `std::sort`. Typically, `std::sort`
 * uses Introsort, which has an average space complexity of O(log N) due to recursion stack.
 * If an in-place sort is used (e.g., Heapsort), it would be O(1) auxiliary space.
 * For competitive programming, O(log N) auxiliary space for `std::sort` is often considered effectively O(1)
 * if we're only counting additional data structures beyond the input.
 */

#include <vector>     // Required for std::vector
#include <algorithm>  // Required for std::sort

class Solution {
public:
    int maximumElementAfterDecrementingAndRearranging(std::vector<int>& arr) {
        // Sort the array in non-decreasing order.
        // This is the first crucial step because we can rearrange elements,
        // and sorting allows us to consider elements in an order that
        // facilitates building an increasing sequence from 1.
        std::sort(arr.begin(), arr.end());

        // Initialize max_val_so_far to 0. This variable will represent the
        // maximum value we have successfully formed in our "ideal" sequence
        // [1, 2, ..., max_val_so_far].
        int max_val_so_far = 0;

        // Iterate through each element in the sorted array.
        for (int num : arr) {
            // We want to form a sequence like [1, 2, 3, ...].
            // To extend the sequence, the next element should ideally be
            // max_val_so_far + 1.
            //
            // If the current number 'num' is greater than or equal to
            // (max_val_so_far + 1), it means we have a number large enough
            // to become the next value in our increasing sequence.
            // We can decrease 'num' to (max_val_so_far + 1) if 'num' is
            // larger, or use it as is if it's exactly (max_val_so_far + 1).
            // This allows us to increment our 'max_val_so_far'.
            if (num >= max_val_so_far + 1) {
                max_val_so_far++;
            }
            // If num < (max_val_so_far + 1), it means this 'num' is too
            // small to be used to increment our target sequence.
            // For example, if max_val_so_far is 2 (sequence [1, 2]), we need
            // a number >= 3 to extend it to [1, 2, 3]. If 'num' is 1 or 2,
            // we cannot use it to form 3, so we effectively skip it for the
            // purpose of incrementing max_val_so_far. We keep searching for
            // a larger number.
            // In this case, max_val_so_far remains unchanged.
        }

        // After iterating through all elements, max_val_so_far holds the
        // maximum possible value an element can take in the modified array
        // while satisfying all conditions.
        return max_val_so_far;
    }
};