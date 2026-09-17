```cpp
// Find Two Non-overlapping Sub-arrays Each With Target Sum
// Link: https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/
//
// Approach:
// This problem requires finding two non-overlapping sub-arrays with a sum equal to the target,
// minimizing the sum of their lengths.
//
// We can use a sliding window approach to find all sub-arrays that sum up to the target.
// While iterating through the array, we maintain a current sum. If the sum exceeds the target,
// we shrink the window from the left. If the sum equals the target, we've found a candidate sub-array.
//
// To efficiently find the minimum sum of lengths, we can precompute two arrays:
// 1. `min_len_left[i]`: The minimum length of a sub-array with sum `target` ending at or before index `i`.
// 2. `min_len_right[i]`: The minimum length of a sub-array with sum `target` starting at or after index `i`.
//
// We can compute `min_len_left` by iterating from left to right. When we find a sub-array with sum `target`
// ending at index `j`, we can update `min_len_left[j]` with its length and propagate this minimum length
// to `min_len_left[j+1]` if it's smaller.
//
// Similarly, we compute `min_len_right` by iterating from right to left. When we find a sub-array with sum `target`
// starting at index `i`, we can update `min_len_right[i]` with its length and propagate this minimum length
// to `min_len_right[i-1]` if it's smaller.
//
// After computing these two arrays, we iterate through all possible split points `i` (from 0 to n-2).
// For each split point, the first sub-array must end at or before `i`, and the second sub-array must start at or after `i+1`.
// The minimum sum of lengths for this split point would be `min_len_left[i] + min_len_right[i+1]`.
// We keep track of the overall minimum sum found.
//
// A more optimized approach uses a single pass with prefix sums and a hash map.
// We can store the prefix sums and their corresponding indices in a hash map.
// For each index `i`, the prefix sum `current_sum` is calculated. We then check if `current_sum - target` exists in the hash map.
// If it does, it means there's a sub-array ending at `i` with sum `target`. Let the start index of this sub-array be `start_idx`.
// The length of this sub-array is `i - start_idx`.
//
// To find the minimum sum of two non-overlapping sub-arrays, we can iterate through the array and maintain:
// `min_len_so_far`: The minimum length of a sub-array with sum `target` encountered so far.
// `result`: The minimum sum of lengths of two non-overlapping sub-arrays.
//
// When we find a sub-array with sum `target` ending at index `i` with length `len`, if `min_len_so_far` is not infinity,
// it means we have a previously found sub-array. The sum of lengths would be `min_len_so_far + len`. We update `result` with the minimum of `result` and this sum.
// Then, we update `min_len_so_far` with the minimum of its current value and `len`.
//
// The prefix sum approach:
// We use a map `prefix_sum_map` to store `prefix_sum -> index`.
// We also use a map `min_len_at_prefix_sum` to store `prefix_sum -> minimum_length_of_subarray_ending_at_this_prefix_sum_index`.
//
// Let's refine the prefix sum approach.
// We can iterate through the array and maintain the current prefix sum.
// We also maintain a map `prefix_sum_to_min_len` where `prefix_sum_to_min_len[sum]` stores the minimum length of a sub-array ending at some index `j` such that its sum is `sum`.
//
// When we are at index `i` with prefix sum `current_sum`:
// 1. We look for `current_sum - target` in `prefix_sum_to_min_len`. If found, say its minimum length is `prev_len`.
//    This means we have a sub-array ending at `i` with sum `target` and length `i - prev_index`. This is not quite right.
//
// Let's consider the problem from the perspective of finding all sub-arrays with sum `target` and their lengths.
// We can use a sliding window to find all such sub-arrays.
// For each `j` from 0 to n-1:
//  Calculate `current_sum` from `arr[i..j]`.
//  If `current_sum == target`, we found a sub-array `arr[i..j]` with length `j - i + 1`.
//  We need to pair this with another non-overlapping sub-array.
//
// Let's try a dynamic programming approach combined with prefix sums and a map.
// We'll use a map `prefix_sum_map` to store `prefix_sum -> index`.
// We'll also use an array `min_len_ending_at[i]` to store the minimum length of a sub-array with sum `target` ending at index `i`. Initialize with infinity.
//
// Iterate `i` from 0 to n-1:
//  `current_sum += arr[i]`
//  If `current_sum == target`: `min_len_ending_at[i] = i + 1`
//  If `prefix_sum_map.count(current_sum - target)`:
//    `start_idx = prefix_sum_map[current_sum - target]`
//    `current_len = i - start_idx`
//    `min_len_ending_at[i] = min(min_len_ending_at[i], current_len)`
//  `prefix_sum_map[current_sum] = i`
//
// After computing `min_len_ending_at`, we need to propagate the minimum length.
// For `i` from 1 to n-1: `min_len_ending_at[i] = min(min_len_ending_at[i], min_len_ending_at[i-1])`.
// This gives us `min_len_left[i]` effectively.
//
// Now, we need `min_len_right[i]`. This is the minimum length of a sub-array with sum `target` starting at or after `i`.
// We can do a similar pass from right to left.
// Use a map `suffix_sum_map` to store `suffix_sum -> index`.
// Use an array `min_len_starting_at[i]` initialized with infinity.
//
// Iterate `i` from n-1 down to 0:
//  `current_sum += arr[i]` (use a temporary sum for suffix sums)
//  If `current_sum == target`: `min_len_starting_at[i] = n - i`
//  If `suffix_sum_map.count(current_sum - target)`:
//    `end_idx = suffix_sum_map[current_sum - target]`
//    `current_len = end_idx - i`
//    `min_len_starting_at[i] = min(min_len_starting_at[i], current_len)`
//  `suffix_sum_map[current_sum] = i`
//
// Propagate minimum for `min_len_starting_at`:
// For `i` from n-2 down to 0: `min_len_starting_at[i] = min(min_len_starting_at[i], min_len_starting_at[i+1])`.
//
// Finally, iterate through possible split points `i` from 0 to n-2:
// `result = min(result, min_len_ending_at[i] + min_len_starting_at[i+1])`.
//
// The constraints: arr.length <= 10^5, target <= 10^8.
// Prefix sums can go up to 10^5 * 1000 = 10^8. `long long` is needed for prefix sums.
//
// The overall approach:
// 1. Compute `min_len_left_of_idx[i]`: the minimum length of a sub-array summing to `target` that ends at or before index `i`.
// 2. Compute `min_len_right_of_idx[i]`: the minimum length of a sub-array summing to `target` that starts at or after index `i`.
// 3. Iterate through all possible split points `i` (from 0 to n-2) and find `min(min_len_left_of_idx[i] + min_len_right_of_idx[i+1])`.
//
// Let's refine step 1 and 2 to be more efficient.
//
// We can use a single pass.
// Maintain `min_len_so_far` (minimum length of one sub-array found so far).
// Maintain `result` (minimum sum of two lengths).
// Use a map `prefix_sum_to_min_len_end_idx` to store `prefix_sum -> minimum_index_where_this_prefix_sum_occurred`.
//
// This seems complicated. Let's simplify.
//
// We need to find all sub-arrays with sum `target`.
// Let's use a sliding window for this.
// `start = 0`, `current_sum = 0`.
// Iterate `end` from 0 to n-1:
//  `current_sum += arr[end]`
//  While `current_sum > target` and `start <= end`:
//    `current_sum -= arr[start]`
//    `start++`
//  If `current_sum == target`:
//    We found a sub-array `arr[start..end]` with length `end - start + 1`.
//    Store these `(start, end)` pairs or `(length, end_index)`.
//
// This still doesn't directly give us the minimum sum of two non-overlapping sub-arrays.
//
// Let's use the `min_len_left` and `min_len_right` idea.
//
// `min_len_left[i]`: minimum length of a sub-array with sum `target` ending at or before index `i`.
// `min_len_right[i]`: minimum length of a sub-array with sum `target` starting at or after index `i`.
//
// To compute `min_len_left`:
// Initialize `min_len_left` array with infinity.
// Use a map `prefix_sum_map` to store `sum -> index`.
// `current_sum = 0`.
// Iterate `i` from 0 to n-1:
//  `current_sum += arr[i]`.
//  If `current_sum == target`: // Sub-array starts at index 0
//    `min_len_left[i] = i + 1`.
//  If `prefix_sum_map.count(current_sum - target)`:
//    `prev_idx = prefix_sum_map[current_sum - target]`.
//    `length = i - prev_idx`.
//    `min_len_left[i] = min(min_len_left[i], length)`.
//  `prefix_sum_map[current_sum] = i`.
//
// After this loop, propagate minimums:
// For `i` from 1 to n-1: `min_len_left[i] = min(min_len_left[i], min_len_left[i-1])`.
//
// To compute `min_len_right`:
// Initialize `min_len_right` array with infinity.
// Use a map `suffix_sum_map` to store `sum -> index`.
// `current_sum = 0`.
// Iterate `i` from n-1 down to 0:
//  `current_sum += arr[i]`.
//  If `current_sum == target`: // Sub-array ends at index n-1
//    `min_len_right[i] = n - i`.
//  If `suffix_sum_map.count(current_sum - target)`:
//    `next_idx = suffix_sum_map[current_sum - target]`.
//    `length = next_idx - i`.
//    `min_len_right[i] = min(min_len_right[i], length)`.
//  `suffix_sum_map[current_sum] = i`.
//
// After this loop, propagate minimums:
// For `i` from n-2 down to 0: `min_len_right[i] = min(min_len_right[i], min_len_right[i+1])`.
//
// Finally, calculate the result:
// `min_total_len = infinity`.
// For `i` from 0 to n-2:
//  If `min_len_left[i]` is not infinity AND `min_len_right[i+1]` is not infinity:
//    `min_total_len = min(min_total_len, min_len_left[i] + min_len_right[i+1])`.
//
// If `min_total_len` is still infinity, return -1. Otherwise, return `min_total_len`.
//
// Need to use `long long` for prefix sums.
// Use `INT_MAX` for infinity.
//
// Let's rethink the prefix sum part. When `current_sum - target` is found in the map, it means a sub-array from `prefix_sum_map[current_sum - target] + 1` to `i` has sum `target`.
// So, `prev_idx = prefix_sum_map[current_sum - target]` implies the sub-array starts at `prev_idx + 1`.
// The length is `i - (prev_idx + 1) + 1 = i - prev_idx`. This is correct.
//
// For `min_len_left`:
// The prefix sum map should store `prefix_sum -> index`.
// When `current_sum` is achieved at index `i`, we look for `current_sum - target`.
// If `prefix_sum_map.count(current_sum - target)`, let `prev_idx = prefix_sum_map[current_sum - target]`.
// This means the sub-array from `prev_idx + 1` to `i` sums to `target`. The length is `i - prev_idx`.
// So `min_len_left[i]` should be updated with `min(current_min_len_left_at_i, i - prev_idx)`.
//
// Example walkthrough: arr = [3,2,2,4,3], target = 3
// n = 5
//
// Compute min_len_left:
// min_len_left = [inf, inf, inf, inf, inf]
// prefix_sum_map = {}
//
// i = 0, arr[0] = 3. current_sum = 3.
//   current_sum == target. min_len_left[0] = 0 + 1 = 1.
//   prefix_sum_map[3] = 0.
//
// i = 1, arr[1] = 2. current_sum = 3 + 2 = 5.
//   prefix_sum_map.count(5 - 3 = 2)? No.
//   prefix_sum_map[5] = 1.
//
// i = 2, arr[2] = 2. current_sum = 5 + 2 = 7.
//   prefix_sum_map.count(7 - 3 = 4)? No.
//   prefix_sum_map[7] = 2.
//
// i = 3, arr[3] = 4. current_sum = 7 + 4 = 11.
//   prefix_sum_map.count(11 - 3 = 8)? No.
//   prefix_sum_map[11] = 3.
//
// i = 4, arr[4] = 3. current_sum = 11 + 3 = 14.
//   prefix_sum_map.count(14 - 3 = 11)? Yes, prev_idx = prefix_sum_map[11] = 3.
//     length = 4 - 3 = 1.
//     min_len_left[4] = min(inf, 1) = 1.
//   prefix_sum_map[14] = 4.
//
// After first pass for min_len_left:
// min_len_left = [1, inf, inf, inf, 1]
//
// Propagate min_len_left:
// i = 1: min_len_left[1] = min(inf, min_len_left[0]) = min(inf, 1) = 1.
// i = 2: min_len_left[2] = min(inf, min_len_left[1]) = min(inf, 1) = 1.
// i = 3: min_len_left[3] = min(inf, min_len_left[2]) = min(inf, 1) = 1.
// i = 4: min_len_left[4] = min(1, min_len_left[3]) = min(1, 1) = 1.
//
// Final min_len_left = [1, 1, 1, 1, 1]
//
// Compute min_len_right:
// min_len_right = [inf, inf, inf, inf, inf]
// suffix_sum_map = {}
//
// i = 4, arr[4] = 3. current_sum = 3.
//   current_sum == target. min_len_right[4] = 5 - 4 = 1.
//   suffix_sum_map[3] = 4.
//
// i = 3, arr[3] = 4. current_sum = 3 + 4 = 7.
//   suffix_sum_map.count(7 - 3 = 4)? No.
//   suffix_sum_map[7] = 3.
//
// i = 2, arr[2] = 2. current_sum = 7 + 2 = 9.
//   suffix_sum_map.count(9 - 3 = 6)? No.
//   suffix_sum_map[9] = 2.
//
// i = 1, arr[1] = 2. current_sum = 9 + 2 = 11.
//   suffix_sum_map.count(11 - 3 = 8)? No.
//   suffix_sum_map[11] = 1.
//
// i = 0, arr[0] = 3. current_sum = 11 + 3 = 14.
//   suffix_sum_map.count(14 - 3 = 11)? Yes, next_idx = suffix_sum_map[11] = 1.
//     length = 1 - 0 = 1.
//     min_len_right[0] = min(inf, 1) = 1.
//   suffix_sum_map[14] = 0.
//
// After first pass for min_len_right:
// min_len_right = [1, inf, inf, inf, 1]
//
// Propagate min_len_right:
// i = 3: min_len_right[3] = min(inf, min_len_right[4]) = min(inf, 1) = 1.
// i = 2: min_len_right[2] = min(inf, min_len_right[3]) = min(inf, 1) = 1.
// i = 1: min_len_right[1] = min(inf, min_len_right[2]) = min(inf, 1) = 1.
// i = 0: min_len_right[0] = min(1, min_len_right[1]) = min(1, 1) = 1.
//
// Final min_len_right = [1, 1, 1, 1, 1]
//
// Calculate result:
// min_total_len = inf
//
// i = 0: min_len_left[0] + min_len_right[1] = 1 + 1 = 2. min_total_len = 2.
// i = 1: min_len_left[1] + min_len_right[2] = 1 + 1 = 2. min_total_len = 2.
// i = 2: min_len_left[2] + min_len_right[3] = 1 + 1 = 2. min_total_len = 2.
// i = 3: min_len_left[3] + min_len_right[4] = 1 + 1 = 2. min_total_len = 2.
//
// Return 2. Correct for example 1.
//
// Example 2: arr = [7,3,4,7], target = 7
// n = 4
//
// min_len_left:
// i=0, arr[0]=7, sum=7. min_len_left[0]=1. map[7]=0.
// i=1, arr[1]=3, sum=10. map[10]=1.
// i=2, arr[2]=4, sum=14. map.count(14-7=7)? Yes, prev=0. len=2-0=2. min_len_left[2]=2. map[14]=2.
// i=3, arr[3]=7, sum=21. map.count(21-7=14)? Yes, prev=2. len=3-2=1. min_len_left[3]=1. map[21]=3.
// min_len_left (pre-propagate): [1, inf, 2, 1]
// Propagate:
// i=1: min(inf, 1) = 1.
// i=2: min(2, 1) = 1.
// i=3: min(1, 1) = 1.
// Final min_len_left: [1, 1, 1, 1]
//
// min_len_right:
// i=3, arr[3]=7, sum=7. min_len_right[3]=1. map[7]=3.
// i=2, arr[2]=4, sum=11. map[11]=2.
// i=1, arr[1]=3, sum=14. map.count(14-7=7)? Yes, next=3. len=3-1=2. min_len_right[1]=2. map[14]=1.
// i=0, arr[0]=7, sum=21. map.count(21-7=14)? Yes, next=1. len=1-0=1. min_len_right[0]=1. map[21]=0.
// min_len_right (pre-propagate): [1, 2, inf, 1]
// Propagate:
// i=2: min(inf, 1) = 1.
// i=1: min(2, 1) = 1.
// i=0: min(1, 1) = 1.
// Final min_len_right: [1, 1, 1, 1]
//
// Result:
// i=0: min_len_left[0] + min_len_right[1] = 1 + 1 = 2. min_total_len = 2.
// i=1: min_len_left[1] + min_len_right[2] = 1 + 1 = 2. min_total_len = 2.
// i=2: min_len_left[2] + min_len_right[3] = 1 + 1 = 2. min_total_len = 2.
//
// Return 2. Correct for example 2.
//
// Example 3: arr = [4,3,2,6,2,3,4], target = 6
// n = 7
//
// min_len_left:
// i=0, arr[0]=4, sum=4. map[4]=0.
// i=1, arr[1]=3, sum=7. map[7]=1.
// i=2, arr[2]=2, sum=9. map[9]=2.
// i=3, arr[3]=6, sum=15. map.count(15-6=9)? Yes, prev=2. len=3-2=1. min_len_left[3]=1. map[15]=3.
// i=4, arr[4]=2, sum=17. map[17]=4.
// i=5, arr[5]=3, sum=20. map[20]=5.
// i=6, arr[6]=4, sum=24. map[24]=6.
// min_len_left (pre-propagate): [inf, inf, inf, 1, inf, inf, inf]
// Propagate:
// i=1: inf
// i=2: inf
// i=3: min(1, inf) = 1.
// i=4: min(inf, 1) = 1.
// i=5: min(inf, 1) = 1.
// i=6: min(inf, 1) = 1.
// Final min_len_left: [inf, inf, inf, 1, 1, 1, 1]
//
// min_len_right:
// i=6, arr[6]=4, sum=4. map[4]=6.
// i=5, arr[5]=3, sum=7. map[7]=5.
// i=4, arr[4]=2, sum=9. map[9]=4.
// i=3, arr[3]=6, sum=15. map.count(15-6=9)? Yes, next=4. len=4-3=1. min_len_right[3]=1. map[15]=3.
// i=2, arr[2]=2, sum=17. map[17]=2.
// i=1, arr[1]=3, sum=20. map[20]=1.
// i=0, arr[0]=4, sum=24. map[24]=0.
// min_len_right (pre-propagate): [inf, inf, inf, 1, inf, inf, inf]
// Propagate:
// i=5: min(inf, inf) = inf.
// i=4: min(inf, inf) = inf.
// i=3: min(1, inf) = 1.
// i=2: min(inf, 1) = 1.
// i=1: min(inf, 1) = 1.
// i=0: min(inf, 1) = 1.
// Final min_len_right: [1, 1, 1, 1, inf, inf, inf]
//
// Result:
// min_total_len = inf
// i = 0: min_len_left[0] + min_len_right[1] = inf + 1 = inf.
// i = 1: min_len_left[1] + min_len_right[2] = inf + 1 = inf.
// i = 2: min_len_left[2] + min_len_right[3] = inf + 1 = inf.
// i = 3: min_len_left[3] + min_len_right[4] = 1 + inf = inf.
// i = 4: min_len_left[4] + min_len_right[5] = 1 + inf = inf.
// i = 5: min_len_left[5] + min_len_right[6] = 1 + inf = inf.
//
// If min_total_len is infinity, return -1. Correct.
//
// Note: The case where `current_sum == target` means the sub-array starts from index 0.
// For `min_len_left[i]`, if `current_sum == target`, the length is `i+1`.
// For `min_len_right[i]`, if `current_sum == target` (from right to left), the length is `n - i`.
// This seems correctly handled.
//
// Use `std::numeric_limits<int>::max()` for infinity.
//
// Time Complexity:
// - Computing `min_len_left`: Two passes through the array (one for prefix sums, one for propagation). Map operations are O(log N) on average for `std::map`, O(1) on average for `std::unordered_map`. With `std::unordered_map`, this is O(N).
// - Computing `min_len_right`: Similarly, O(N) with `std::unordered_map`.
// - Calculating the final result: One pass, O(N).
// - Total time complexity: O(N).
//
// Space Complexity:
// - `min_len_left` and `min_len_right` arrays: O(N).
// - `prefix_sum_map` and `suffix_sum_map`: In the worst case, all prefix sums are distinct, so O(N).
// - Total space complexity: O(N).

#include <vector>
#include <numeric>
#include <unordered_map>
#include <algorithm>
#include <limits>

class Solution {
public:
    int minSumOfLengths(std::vector<int>& arr, int target) {
        int n = arr.size();
        const int INF = std::numeric_limits<int>::max();

        // min_len_left[i]: minimum length of a sub-array with sum 'target' ending at or before index i.
        std::vector<int> min_len_left(n, INF);
        // Stores prefix_sum -> index of the last occurrence of that prefix_sum.
        std::unordered_map<long long, int> prefix_sum_map;
        long long current_sum = 0;

        // First pass to compute initial minimum lengths ending at or before index i.
        for (int i = 0; i < n; ++i) {
            current_sum += arr[i];

            // Case 1: Sub-array starts from index 0 and ends at index i.
            if (current_sum == target) {
                min_len_left[i] = i + 1;
            }

            // Case 2: Sub-array starts after some previous index 'prev_idx'.
            // We look for a prefix sum such that `current_sum - prefix_sum = target`.
            // This means `prefix_sum = current_sum - target`.
            if (prefix_sum_map.count(current_sum - target)) {
                int prev_idx = prefix_sum_map[current_sum - target];
                // The sub-array is from `prev_idx + 1` to `i`. Length is `i - prev_idx`.
                min_len_left[i] = std::min(min_len_left[i], i - prev_idx);
            }

            // Store the current prefix sum and its index.
            prefix_sum_map[current_sum] = i;
        }

        // Propagate minimum lengths from left to right.
        // min_len_left[i] should be the minimum of itself and min_len_left[i-1].
        for (int i = 1; i < n; ++i) {
            min_len_left[i] = std::min(min_len_left[i], min_len_left[i - 1]);
        }

        // min_len_right[i]: minimum length of a sub-array with sum 'target' starting at or after index i.
        std::vector<int> min_len_right(n, INF);
        // Stores suffix_sum -> index of the first occurrence of that suffix_sum (from the right).
        std::unordered_map<long long, int> suffix_sum_map;
        current_sum = 0;

        // Second pass (from right to left) to compute initial minimum lengths starting at or after index i.
        for (int i = n - 1; i >= 0; --i) {
            current_sum += arr[i];

            // Case 1: Sub-array starts at index i and ends at index n-1.
            if (current_sum == target) {
                min_len_right[i] = n - i;
            }

            // Case 2: Sub-array starts at index i and ends before some `next_idx`.
            // We look for a suffix sum such that `suffix_sum - current_sum = target`.
            // This means `suffix_sum = current_sum + target`.
            // OR, looking from the right, if we have `current_sum` from `i` to `n-1`.
            // We are looking for a sub-array from `i` to `j` that sums to `target`.
            // This is equivalent to finding a prefix sum from `i` onwards that sums to `target`.
            // Let's rephrase: current_sum from right to left at index `i` is sum(arr[i..n-1]).
            // If we want a sub-array from `i` to `j` with sum `target`.
            // This means sum(arr[i..j]) = target.
            // Let's use a slightly different perspective for `min_len_right`.
            // We are computing the minimum length of a subarray ending at some index `k` (where `k >= i`) that sums to `target`.
            // The previous approach using `suffix_sum_map` was more for finding a sub-array from `i` to `j`.
            // Let's stick to the `prefix_sum_map` logic but from right to left.
            //
            // Correct logic for min_len_right:
            // Iterate from right to left. `current_sum` is the sum from `i` to `n-1`.
            // We are looking for a sub-array `arr[i..j]` such that `sum(arr[i..j]) == target`.
            // This is equivalent to `prefix_sum(j) - prefix_sum(i-1) == target`.
            //
            // Let's use the `prefix_sum_map` again but from right to left, storing the *first* occurrence from the right.
            //
            // Okay, re-evaluating:
            // `min_len_right[i]` is the minimum length of a sub-array with sum `target` that STARTS at or AFTER index `i`.
            // We need to find sub-arrays that SUM to `target`.
            //
            // Let's use the `prefix_sum_map` idea again, but for finding sub-arrays from right to left.
            // We want to find sub-arrays `arr[k...i]` where `sum(arr[k...i]) == target`.
            // `prefix_sum[i] - prefix_sum[k-1] == target`.
            // `prefix_sum[k-1] == prefix_sum[i] - target`.
            //
            // Let `current_prefix_sum_from_right` be the sum from `i` to `n-1`.
            // We can compute prefix sums from the left and use that.
            //
            // Let's re-implement `min_len_right` with a clear prefix sum logic from left to right.
            // The definition is `min_len_right[i]` = min length of sub-array with sum `target` that STARTS at or AFTER index `i`.
            //
            // We can compute `min_len_right` using prefix sums from left to right.
            // We need to find sub-arrays `arr[k..i]` summing to `target`.
            // For each such sub-array ending at `i` with length `len`, if `k >= some_index`, it's a candidate for `min_len_right[some_index]`.
            //
            // The initial implementation of `min_len_right` was flawed.
            //
            // Let's stick to the definition:
            // `min_len_right[i]` = min length of sub-array with sum `target` that STARTS AT OR AFTER index `i`.
            //
            // We can iterate through the array from right to left, computing prefix sums.
            // `current_sum` = sum of `arr[i...n-1]`.
            // We are looking for sub-arrays `arr[i...j]` that sum to `target`.
            // This is `prefix_sum[j] - prefix_sum[i-1] == target`.
            //
            // Let's use the `prefix_sum_map` where keys are prefix sums and values are indices.
            // When we are at index `i` (from right to left), we compute `current_sum_from_right = arr[i] + arr[i+1] + ... + arr[n-1]`.
            // We need to find a sub-array `arr[i..j]` that sums to `target`.
            // This is `prefix_sum(j) - prefix_sum(i-1) == target`.
            //
            // The most robust way might be:
            // 1. Compute `min_len_left_ending_at[i]`: min length of subarray summing to `target` ending exactly at `i`.
            // 2. Compute `min_len_right_starting_at[i]`: min length of subarray summing to `target` starting exactly at `i`.
            // 3. Then, compute prefix minimums for these two arrays.
            //
            // Let's recalculate based on "ending exactly" and "starting exactly".
            //
            // Step 1: `min_len_ending_at_exact[i]` = min length of sub-array summing to `target` that ends *exactly* at `i`. Initialize with INF.
            std::vector<int> min_len_ending_at_exact(n, INF);
            prefix_sum_map.clear();
            current_sum = 0;
            prefix_sum_map[0] = -1; // Base case for sub-arrays starting at index 0.

            for (int i = 0; i < n; ++i) {
                current_sum += arr[i];
                if (prefix_sum_map.count(current_sum - target)) {
                    int prev_idx = prefix_sum_map[current_sum - target];
                    min_len_ending_at_exact[i] = i - prev_idx;
                }
                prefix_sum_map[current_sum] = i;
            }

            // Step 2: `min_len_starting_at_exact[i]` = min length of sub-array summing to `target` that starts *exactly* at `i`. Initialize with INF.
            std::vector<int> min_len_starting_at_exact(n, INF);
            std::unordered_map<long long, int> suffix_sum_map; // stores sum -> index from right
            long long current_suffix_sum = 0;

            // Let's use prefix sums from left, and look for `prefix_sum[j] - prefix_sum[i-1] == target`.
            // If we fix `i` as the start, we need to find `j` such that `prefix_sum[j] == prefix_sum[i-1] + target`.
            // This means we need to iterate from `i` to `n-1` and check for the sum.
            // This is O(N^2) if done naively.
            //
            // The original `min_len_left` and `min_len_right` definitions are correct. Let's fix their computation.
            //
            // Re-focus on `min_len_right[i]`: minimum length of a sub-array with sum `target` that STARTS AT OR AFTER index `i`.
            //
            // We can iterate from right to left. `current_sum` = sum of `arr[i...n-1]`.
            // We need to find a sub-array `arr[k...j]` where `k >= i` and `sum(arr[k...j]) == target`.
            //
            // Let's use the `prefix_sum_map` to find `target` sums.
            //
            // When computing `min_len_right`:
            // Iterate `i` from `n-1` down to `0`.
            // `current_sum_from_left` is the prefix sum up to `i`.
            // We are interested in sub-arrays `arr[k...i]` where `k >= ???` and `sum == target`.
            // This is confusing.
            //
            // The most common and efficient way for this type of problem is the two-pass approach with prefix sums, storing lengths.
            //
            // Let's retry the `min_len_right` calculation directly.
            //
            // `min_len_right[i]` = minimum length of a sub-array `arr[k...j]` with sum `target`, such that `k >= i`.
            //
            // Iterate `i` from `n-1` down to `0`.
            // Calculate prefix sums `S[p]` from left.
            // `current_sum_from_left` at index `i`.
            // We need to find if there exists `k >= i` and `j` such that `arr[k...j]` sums to `target`.
            //
            // A different perspective:
            // For each index `j` from `0` to `n-1`, find all sub-arrays ending at `j` that sum to `target`.
            // Let these be `(start_idx, j)`.
            //
            // Let's use the original definition and refine calculation.
            //
            // `min_len_left[i]`: min length of subarray sum `target` ending AT OR BEFORE index `i`.
            // `min_len_right[i]`: min length of subarray sum `target` starting AT OR AFTER index `i`.
            //
            // Correct calculation for `min_len_right`:
            // `min_len_right` array stores the minimum length of a subarray that sums to `target` and STARTS at index `i` or later.
            //
            // Use `prefix_sum_map`: `sum -> index`.
            // Iterate from `i = n-1` down to `0`.
            // `current_sum` is the prefix sum from `0` to `i`.
            // If `prefix_sum_map.count(current_sum - target)`, let `prev_idx = prefix_sum_map[current_sum - target]`.
            // This means sub-array `arr[prev_idx + 1 ... i]` sums to `target`. Length is `i - prev_idx`.
            // If `prev_idx + 1 >= i`, this sub-array starts at or after `i`.
            // No, this is still confusing.
            //
            // Let's use the sliding window idea to get all `(length, end_index)` pairs.
            // `vector<pair<int, int>> valid_subarrays;`
            // `start = 0`, `current_sum = 0`.
            // For `end` from `0` to `n-1`:
            //  `current_sum += arr[end]`
            //  While `current_sum > target` and `start <= end`:
            //    `current_sum -= arr[start]`
            //    `start++`
            //  If `current_sum == target`:
            //    `valid_subarrays.push_back({end - start + 1, end});`
            //
            // This gives us all sub-arrays with sum `target`.
            // Now, we need to pair them up.
            // For each `(len1, end1)` in `valid_subarrays`:
            //  For each `(len2, end2)` in `valid_subarrays`:
            //   If `end1 < start2` OR `end2 < start1`:
            //    `result = min(result, len1 + len2)`
            //
            // The problem is `start2` and `start1` are not directly stored. We need to derive them.
            // If `(len, end)` is from `valid_subarrays`, `start = end - len + 1`.
            //
            // This O(N^2) if many sub-arrays.
            //
            // Let's go back to the `min_len_left` and `min_len_right` and their definition.
            //
            // `min_len_left[i]` = min length of a sub-array summing to `target` ending AT OR BEFORE index `i`.
            // `min_len_right[i]` = min length of a sub-array summing to `target` starting AT OR AFTER index `i`.
            //
            // Computation of `min_len_left`:
            // `min_len_left` initialized to INF.
            // `prefix_sum_map`: `sum -> index`.
            // `current_sum = 0`.
            // For `i` from `0` to `n-1`:
            //  `current_sum += arr[i]`.
            //  If `prefix_sum_map.count(current_sum - target)`:
            //    `prev_idx = prefix_sum_map[current_sum - target]`.
            //    `length = i - prev_idx`.
            //    `min_len_left[i] = min(min_len_left[i], length)`.
            //  `prefix_sum_map[current_sum] = i`.
            //
            // Propagate: `min_len_left[i] = min(min_len_left[i], min_len_left[i-1])`.
            // This seems correct for `min_len_left`. The issue was how I handled the `current_sum == target` case.
            // The `prefix_sum_map` with `0 -> -1` handles sub-arrays starting at index 0 correctly.
            //
            // Computation of `min_len_right`:
            // `min_len_right[i]` = min length of sub-array summing to `target` starting AT OR AFTER index `i`.
            //
            // Iterate from `i = n-1` down to `0`.
            // We need to find `k >= i` such that `arr[k...j]` sums to `target`.
            //
            // Let's use a `suffix_sum_map` from right to left.
            // `suffix_sum_map`: `sum -> index`.
            // `current_sum_from_right = 0`.
            // For `i` from `n-1` down to `0`:
            //  `current_sum_from_right += arr[i]`.
            //  If `suffix_sum_map.count(current_sum_from_right - target)`:
            //    `next_idx = suffix_sum_map[current_sum_from_right - target]`.
            //    `length = next_idx - i`.
            //    `min_len_right[i] = min(min_len_right[i], length)`.
            //  `suffix_sum_map[current_sum_from_right] = i`.
            //
            // This calculation for `min_len_right` is for sub-arrays ending at `i` and starting before `i`.
            // The correct definition for `min_len_right[i]` is minimum length of sub-array that STARTS at or AFTER index `i`.
            //
            // Let's re-try the definition of `min_len_right[i]` and its calculation.
            // `min_len_right[i]` = minimum length of a sub-array summing to `target`, such that its START index `k` satisfies `k >= i`.
            //
            // Iterate `i` from `n-1` down to `0`.
            // We are interested in sub-arrays that START at `i`, or `i+1`, or `i+2`, ..., or `n-1`.
            //
            // We need to find `arr[k...j]` where `k >= i` and `sum(arr[k...j]) == target`.
            //
            // Let's compute `min_len_starting_at_exact[k]` for all `k`.
            // Then `min_len_right[i] = min(min_len_starting_at_exact[i], min_len_starting_at_exact[i+1], ..., min_len_starting_at_exact[n-1])`.
            // This is a suffix minimum.
            //
            // So, the plan is:
            // 1. Calculate `min_len_ending_at_exact[i]` for all `i`.
            // 2. Calculate `min_len_starting_at_exact[i]` for all `i`.
            // 3. Compute `min_len_left[i] = min(min_len_ending_at_exact[0]...min_len_ending_at_exact[i])`. (Prefix minimum)
            // 4. Compute `min_len_right[i] = min(min_len_starting_at_exact[i]...min_len_starting_at_exact[n-1])`. (Suffix minimum)
            // 5. Iterate `i` from `0` to `n-2`, `result = min(result, min_len_left[i] + min_len_right[i+1])`.
            //
            // This seems more robust.
            //
            // Calculation of `min_len_ending_at_exact[i]`:
            // Use `prefix_sum_map`: `sum -> index`.
            // `current_sum = 0`.
            // `prefix_sum_map[0] = -1`.
            // For `i` from `0` to `n-1`:
            //  `current_sum += arr[i]`.
            //  If `prefix_sum_map.count(current_sum - target)`:
            //    `prev_idx = prefix_sum_map[current_sum - target]`.
            //    `min_len_ending_at_exact[i] = i - prev_idx`.
            //  `prefix_sum_map[current_sum] = i`.
            //
            // Calculation of `min_len_starting_at_exact[i]`:
            // Use `suffix_sum_map`: `sum -> index`. This is tricky with sums.
            // Easier to re-use the prefix sum logic but for sums from right to left.
            // Let's reverse the array and find sub-arrays summing to target.
            //
            // Alternative for `min_len_starting_at_exact[i]`:
            // We need sub-arrays `arr[i..j]` summing to `target`.
            // `current_sum_from_left` up to `j`. `current_sum_from_left` up to `i-1`.
            // `prefix_sum[j] - prefix_sum[i-1] == target`.
            // `prefix_sum[i-1] == prefix_sum[j] - target`.
            //
            // Let's use the `prefix_sum_map` again for `min_len_starting_at_exact`.
            // Iterate `j` from `0` to `n-1` (end index of potential sub-array).
            // `current_sum`.
            // If `prefix_sum_map.count(current_sum - target)`:
            //  `i_minus_1 = prefix_sum_map[current_sum - target]`.
            //  `start_idx = i_minus_1 + 1`.
            //  `length = j - start_idx + 1`.
            //  `min_len_starting_at_exact[start_idx] = min(min_len_starting_at_exact[start_idx], length)`.
            //
            // This is the correct way to fill `min_len_starting_at_exact`.
            //
            // So the final refined plan:
            // 1. Initialize `min_len_ending_at_exact` and `min_len_starting_at_exact` with INF.
            // 2. Use `prefix_sum_map` to calculate `min_len_ending_at_exact[i]` for all `i`.
            //    `prefix_sum_map` stores `sum -> index`.
            //    `current_sum = 0`, `prefix_sum_map[0] = -1`.
            //    Iterate `i` from `0` to `n-1`:
            //      `current_sum += arr[i]`.
            //      If `prefix_sum_map.count(current_sum - target)`:
            //        `prev_idx = prefix_sum_map[current_sum - target]`.
            //        `min_len_ending_at_exact[i] = i - prev_idx`.
            //      `prefix_sum_map[current_sum] = i`.
            //
            // 3. Use `prefix_sum_map` again to calculate `min_len_starting_at_exact[i]` for all `i`.
            //    `prefix_sum_map` stores `sum -> index`.
            //    `current_sum = 0`.
            //    `prefix_sum_map[0] = -1`.
            //    Iterate `i` from `0` to `n-1`:
            //      `current_sum += arr[i]`.
            //      If `prefix_sum_map.count(current_sum - target)`:
            //        `prev_idx = prefix_sum_map[current_sum - target]`.
            //        `start_idx = prev_idx + 1`.
            //        `length = i - start_idx + 1`.
            //        `min_len_starting_at_exact[start_idx] = min(min_len_starting_at_exact[start_idx], length)`.
            //      `prefix_sum_map[current_sum] = i`.
            //
            // 4. Compute prefix minimums for `min_len_ending_at_exact` to get `min_len_left`.
            //    `min_len_left[i] = min(min_len_ending_at_exact[0]...min_len_ending_at_exact[i])`.
            //    Initialize `min_len_left` with INF.
            //    For `i` from `0` to `n-1`:
            //      `min_len_left[i] = min(min_len_ending_at_exact[i], (i > 0 ? min_len_left[i-1] : INF))`.
            //
            // 5. Compute suffix minimums for `min_len_starting_at_exact` to get `min_len_right`.
            //    `min_len_right[i] = min(min_len_starting_at_exact[i]...min_len_starting_at_exact[n-1])`.
            //    Initialize `min_len_right` with INF.
            //    For `i` from `n-1` down to `0`:
            //      `min_len_right[i] = min(min_len_starting_at_exact[i], (i < n - 1 ? min_len_right[i+1] : INF))`.
            //
            // 6. Calculate the final result.
            //    `min_total_len = INF`.
            //    For `i` from `0` to `n-2`:
            //      If `min_len_left[i] != INF` and `min_len_right[i+1] != INF`:
            //        `min_total_len = min(min_total_len, min_len_left[i] + min_len_right[i+1])`.
            //
            // 7. Return `min_total_len == INF ? -1 : min_total_len`.
            //
            // This refined approach addresses the definitions and computation correctly.

        // Step 1 & 2: Compute min_len_ending_at_exact and min_len_starting_at_exact.
        std::vector<int> min_len_ending_at_exact(n, INF);
        std::vector<int> min_len_starting_at_exact(n, INF);
        
        // Calculate min_len_ending_at_exact
        std::unordered_map<long long, int> prefix_sum_map_end;
        long long current_sum_end = 0;
        prefix_sum_map_end[0] = -1; // Base case for subarrays starting at index 0

        for (int i = 0; i < n; ++i) {
            current_sum_end += arr[i];
            if (prefix_sum_map_end.count(current_sum_end - target)) {
                int prev_idx = prefix_sum_map_end[current_sum_end - target];
                min_len_ending_at_exact[i] = i - prev_idx;
            }
            prefix_sum_map_end[current_sum_end] = i;
        }

        // Calculate min_len_starting_at_exact
        std::unordered_map<long long, int> prefix_sum_map_start;
        long long current_sum_start = 0;
        prefix_sum_map_start[0] = -1; // Base case for subarrays starting at index 0

        for (int i = 0; i < n; ++i) {
            current_sum_start += arr[i];
            if (prefix_sum_map_start.count(current_sum_start - target)) {
                int prev_idx = prefix_sum_map_start[current_sum_start - target];
                int start_idx = prev_idx + 1;
                int length = i - start_idx + 1;
                // Update the minimum length for a subarray starting at `start_idx`.
                min_len_starting_at_exact[start_idx] = std::min(min_len_starting_at_exact[start_idx], length);
            }
            prefix_sum_map_start[current_sum_start] = i;
        }

        // Step 3: Compute prefix minimums for min_len_ending_at_exact to get min_len_left.
        std::vector<int> min_len_left(n, INF);
        for (int i = 0; i < n; ++i) {
            min_len_left[i] = std::min(min_len_ending_at_exact[i], (i > 0 ? min_len_left[i - 1] : INF));
        }

        // Step 4: Compute suffix minimums for min_len_starting_at_exact to get min_len_right.
        std::vector<int> min_len_right(n, INF);
        for (int i = n - 1; i >= 0; --i) {
            min_len_right[i] = std::min(min_len_starting_at_exact[i], (i < n - 1 ? min_len_right[i + 1] : INF));
        }

        // Step 5: Calculate the final result.
        int min_total_len = INF;
        for (int i = 0; i < n - 1; ++i) { // Iterate through all possible split points
            if (min_len_left[i] != INF && min_len_right[i + 1] != INF) {
                min_total_len = std::min(min_total_len, min_len_left[i] + min_len_right[i + 1]);
            }
        }

        // Step 6: Return the result.
        return (min_total_len == INF) ? -1 : min_total_len;
    }
};
```