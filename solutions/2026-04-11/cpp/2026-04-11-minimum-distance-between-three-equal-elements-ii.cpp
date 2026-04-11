```cpp
// Problem: Minimum Distance Between Three Equal Elements II
// Problem Link: https://leetcode.com/problems/minimum-distance-between-three-equal-elements-ii/
//
// Approach:
// The problem asks for the minimum distance between three distinct indices i, j, and k such that nums[i] == nums[j] == nums[k].
// The distance is defined as abs(i - j) + abs(j - k) + abs(k - i).
//
// A brute-force approach of checking all possible tuples (i, j, k) would be O(n^3), which is too slow given n <= 10^5.
//
// We can optimize this by grouping indices by their values. For each unique number in `nums`, we store a list of all indices where that number appears.
// If a number appears less than 3 times, it cannot form a good tuple, so we can ignore it.
//
// For a number that appears at least 3 times, let its indices be stored in a sorted list `indices`.
// The distance for a tuple (i, j, k) where i, j, k are indices of the same value is `abs(i - j) + abs(j - k) + abs(k - i)`.
// If we assume i < j < k without loss of generality, the distance simplifies to `(j - i) + (k - j) + (k - i) = 2 * (k - i)`.
// This means for a fixed value, to minimize the distance `2 * (k - i)`, we need to minimize `k - i`, which is the difference between the largest and smallest indices of that value.
//
// However, this is only true if we can pick any three indices. The problem requires us to find *three* indices.
// The formula `abs(i - j) + abs(j - k) + abs(k - i)` can be rewritten. If we sort the indices as `a < b < c`, the distance is `(b - a) + (c - b) + (c - a) = 2 * (c - a)`.
//
// Let's reconsider the distance formula `abs(i - j) + abs(j - k) + abs(k - i)`.
// If we fix one index, say `j`, we want to find `i` and `k` such that `nums[i] == nums[j] == nums[k]`, `i != j`, `k != j`, `i != k`, and the distance is minimized.
//
// For a given number `val` that appears multiple times, let its indices be `idx1, idx2, ..., idxm` in sorted order.
// We need to pick three distinct indices `idx_a, idx_b, idx_c` from this list.
// The distance is `abs(idx_a - idx_b) + abs(idx_b - idx_c) + abs(idx_c - idx_a)`.
//
// Consider a fixed index `j`. We need to find two other indices `i` and `k` such that `nums[i] == nums[k] == nums[j]`, and `i, j, k` are distinct.
//
// Let's analyze the distance `abs(i - j) + abs(j - k) + abs(k - i)`.
// Suppose the three indices are `p1, p2, p3` with `p1 < p2 < p3`. The distance is `(p2 - p1) + (p3 - p2) + (p3 - p1) = 2 * (p3 - p1)`.
// This implies that for a fixed value, the minimum distance is achieved by picking the smallest and largest indices where that value appears, along with *any* other index of that value in between.
// However, this is a simplification.
//
// The crucial observation is the structure of the distance function. For any three indices `i, j, k`, if we sort them `a < b < c`, the distance is `(b - a) + (c - b) + (c - a) = 2 * (c - a)`.
// This simplifies the problem significantly. For each number that appears at least 3 times, we are interested in the difference between its largest and smallest indices.
//
// Wait, the distance is `abs(i - j) + abs(j - k) + abs(k - i)`.
// If we pick three indices `i, j, k` for the same value. Let the sorted indices be `a < b < c`.
// The distance is `abs(a-b) + abs(b-c) + abs(c-a) = (b-a) + (c-b) + (c-a) = 2*(c-a)`.
//
// This means for any number that appears at least 3 times, the minimum distance achievable for that number is `2 * (max_index - min_index)` where `max_index` and `min_index` are the largest and smallest indices of that number. We can pick any third index in between.
//
// Let's re-read the problem carefully: "The distance of a good tuple is abs(i - j) + abs(j - k) + abs(k - i)".
//
// Example 1: nums = [1,2,1,1,3]
// Indices of 1: 0, 2, 3.
// Tuple (0, 2, 3).
// Distance = abs(0-2) + abs(2-3) + abs(3-0) = 2 + 1 + 3 = 6.
// Here, min_index for 1 is 0, max_index is 3. 2 * (3 - 0) = 6.
//
// Example 2: nums = [1,1,2,3,2,1,2]
// Indices of 1: 0, 1, 5.
// Tuple (0, 1, 5). Distance = abs(0-1) + abs(1-5) + abs(5-0) = 1 + 4 + 5 = 10.
// Indices of 2: 2, 4, 6.
// Tuple (2, 4, 6). Distance = abs(2-4) + abs(4-6) + abs(6-2) = 2 + 2 + 4 = 8.
//
// The minimum distance is 8.
// For value 1: min_index = 0, max_index = 5. 2 * (5 - 0) = 10.
// For value 2: min_index = 2, max_index = 6. 2 * (6 - 2) = 8.
//
// It seems my simplification `2 * (max_index - min_index)` is correct.
// The logic:
// 1. Use a hash map to store lists of indices for each number. `std::unordered_map<int, std::vector<int>> val_to_indices;`
// 2. Iterate through `nums`, populating the map.
// 3. Initialize `min_distance` to infinity.
// 4. Iterate through the values in the map. If a vector of indices has size >= 3:
//    a. Sort the indices (though they will be added in sorted order if we iterate through `nums` linearly).
//    b. Let the sorted indices be `idx_list`.
//    c. The minimum index is `idx_list.front()`.
//    d. The maximum index is `idx_list.back()`.
//    e. The minimum distance for this value is `2 * (idx_list.back() - idx_list.front())`.
//    f. Update `min_distance = std::min(min_distance, 2 * (idx_list.back() - idx_list.front()))`.
// 5. If `min_distance` is still infinity, return -1. Otherwise, return `min_distance`.
//
// Let's consider why `2 * (max_index - min_index)` is always achievable.
// If a value `v` appears at indices `i_1 < i_2 < ... < i_m` where `m >= 3`.
// We can pick the tuple `(i_1, i_2, i_m)`. The distance is `abs(i_1 - i_2) + abs(i_2 - i_m) + abs(i_m - i_1)`.
// Since `i_1 < i_2 < i_m`:
// Distance = `(i_2 - i_1) + (i_m - i_2) + (i_m - i_1)`
// Distance = `i_2 - i_1 + i_m - i_2 + i_m - i_1`
// Distance = `2 * i_m - 2 * i_1`
// Distance = `2 * (i_m - i_1)`.
//
// This confirms the strategy.
//
// Time Complexity:
// - Populating the map: O(N), where N is the length of `nums`. Each element is visited once.
// - Iterating through the map: In the worst case, all elements are unique, and each has one index. If there are K distinct values, we iterate K times. For each value, we access `front()` and `back()`, which is O(1). The sorting of indices for each value would be O(L log L) where L is the number of occurrences of that value. Sum of L for all values is N. However, since we add indices in increasing order, the vectors are already sorted, so no explicit sort is needed.
// - Total time complexity is dominated by populating the map, which is O(N).
//
// Space Complexity:
// - The `unordered_map` stores indices. In the worst case, all elements are unique, and we store N indices.
// - Space complexity is O(N).
//
// Edge Cases:
// - `nums.length < 3`: No good tuple can be formed. The loop over map values will not find any vector of size >= 3. `min_distance` will remain at its initial large value. Return -1.
// - All elements are unique: Similar to above.
// - All elements are the same: e.g., [5, 5, 5, 5]. Indices are 0, 1, 2, 3.
//   Value 5: indices [0, 1, 2, 3]. min_idx = 0, max_idx = 3. Distance = 2 * (3 - 0) = 6.
//   Tuple (0, 1, 2): abs(0-1)+abs(1-2)+abs(2-0) = 1+1+2 = 4.
//   Tuple (0, 1, 3): abs(0-1)+abs(1-3)+abs(3-0) = 1+2+3 = 6.
//   Tuple (0, 2, 3): abs(0-2)+abs(2-3)+abs(3-0) = 2+1+3 = 6.
//   Tuple (1, 2, 3): abs(1-2)+abs(2-3)+abs(3-1) = 1+1+2 = 4.
//
//   Ah, my simplification `2 * (max_index - min_index)` is WRONG for the general case.
//   The distance is `abs(i - j) + abs(j - k) + abs(k - i)`.
//   If `i < j < k`, this is `(j - i) + (k - j) + (k - i) = 2(k - i)`.
//   This implies that if we pick the minimum index `i` and maximum index `k` for a given value, and *any* third index `j` between them, the distance is `2*(k-i)`.
//
//   Let's verify the examples again.
//   Example 1: nums = [1,2,1,1,3]. Indices of 1: 0, 2, 3.
//   Sorted: 0, 2, 3.
//   Pick (0, 2, 3). i=0, j=2, k=3.
//   Distance = abs(0-2) + abs(2-3) + abs(3-0) = 2 + 1 + 3 = 6.
//   min_idx = 0, max_idx = 3. 2 * (3 - 0) = 6. Correct.
//
//   Example 2: nums = [1,1,2,3,2,1,2].
//   Indices of 1: 0, 1, 5.
//   Pick (0, 1, 5). i=0, j=1, k=5.
//   Distance = abs(0-1) + abs(1-5) + abs(5-0) = 1 + 4 + 5 = 10.
//   min_idx = 0, max_idx = 5. 2 * (5 - 0) = 10. Correct.
//
//   Indices of 2: 2, 4, 6.
//   Pick (2, 4, 6). i=2, j=4, k=6.
//   Distance = abs(2-4) + abs(4-6) + abs(6-2) = 2 + 2 + 4 = 8.
//   min_idx = 2, max_idx = 6. 2 * (6 - 2) = 8. Correct.
//
//   My prior doubt about the [5, 5, 5, 5] case was because I was thinking about which three indices to pick.
//   For [5, 5, 5, 5] with indices 0, 1, 2, 3:
//   Value 5: indices [0, 1, 2, 3].
//   min_idx = 0, max_idx = 3.
//   My formula `2 * (max_idx - min_idx)` gives 2 * (3 - 0) = 6.
//   Let's check tuples:
//   (0, 1, 2): abs(0-1) + abs(1-2) + abs(2-0) = 1 + 1 + 2 = 4.
//   (0, 1, 3): abs(0-1) + abs(1-3) + abs(3-0) = 1 + 2 + 3 = 6.
//   (0, 2, 3): abs(0-2) + abs(2-3) + abs(3-0) = 2 + 1 + 3 = 6.
//   (1, 2, 3): abs(1-2) + abs(2-3) + abs(3-1) = 1 + 1 + 2 = 4.
//   The minimum distance here is 4.
//
//   The problem states "The distance of a good tuple is abs(i - j) + abs(j - k) + abs(k - i)".
//   My formula `2 * (max_index - min_index)` is NOT correct for the general case when there are MORE than 3 occurrences.
//
//   The distance `abs(i - j) + abs(j - k) + abs(k - i)` can be thought of as the perimeter of a triangle with vertices at i, j, k on a number line.
//   For three points `a, b, c` on a line, the sum of distances `abs(a-b) + abs(b-c) + abs(c-a)` is always `2 * (max(a,b,c) - min(a,b,c))`.
//   Proof: Assume `a < b < c`. Then `abs(a-b) = b-a`, `abs(b-c) = c-b`, `abs(c-a) = c-a`.
//   Sum = `(b-a) + (c-b) + (c-a) = c - a + c - a = 2(c - a)`.
//   This holds regardless of which of the three occurrences are chosen, as long as they are distinct.
//
//   So for a given value, if its indices are `i_1, i_2, ..., i_m` (sorted), and we pick any three distinct indices `i_a, i_b, i_c` from this list. Let `i_min = min(i_a, i_b, i_c)` and `i_max = max(i_a, i_b, i_c)`. The distance will be `2 * (i_max - i_min)`.
//
//   To minimize this distance for a given value, we need to pick three indices `i_a, i_b, i_c` such that `i_max - i_min` is minimized.
//
//   This requires us to consider all triplets of indices for each number. This brings us back to O(N^3) if not careful.
//
//   Let's reconsider the distance `abs(i - j) + abs(j - k) + abs(k - i)`.
//   Suppose we have indices `p1 < p2 < p3 < p4`.
//   Tuple (p1, p2, p3): dist = 2 * (p3 - p1)
//   Tuple (p1, p2, p4): dist = 2 * (p4 - p1)
//   Tuple (p1, p3, p4): dist = 2 * (p4 - p1)
//   Tuple (p2, p3, p4): dist = 2 * (p4 - p2)
//
//   The minimum distance for a number with indices `i_1, i_2, ..., i_m` (sorted, m >= 3) is obtained by finding a triplet `(i_a, i_b, i_c)` such that `max(i_a, i_b, i_c) - min(i_a, i_b, i_c)` is minimized.
//
//   Consider a sliding window of size 3 on the sorted indices.
//   For indices `i_1, i_2, ..., i_m`:
//   We can form triplets like `(i_k, i_{k+1}, i_{k+2})` for `k = 1, ..., m-2`.
//   The distance for such a triplet would be `2 * (i_{k+2} - i_k)`.
//   We need to find the minimum of `2 * (i_{k+2} - i_k)` over all valid `k`.
//
//   This approach seems correct and efficient.
//   1. Map values to their sorted indices.
//   2. For each value with >= 3 occurrences:
//      a. Get the list of indices: `idx_list`.
//      b. Iterate `k` from 0 to `idx_list.size() - 3`.
//      c. Calculate distance for triplet `(idx_list[k], idx_list[k+1], idx_list[k+2])`. This is `2 * (idx_list[k+2] - idx_list[k])`.
//      d. Update `min_distance`.
//
//   Let's re-check the distance formula `abs(i - j) + abs(j - k) + abs(k - i)`.
//   If the indices are `a, b, c`, sorted as `x < y < z`.
//   Distance = `(y - x) + (z - y) + (z - x) = 2(z - x)`.
//   This holds true for ANY triplet of distinct indices `i, j, k` for the same value. The distance is always `2 * (max_chosen_index - min_chosen_index)`.
//
//   So, for a value `v` with indices `i_1, i_2, ..., i_m` (sorted, m >= 3), we want to pick three indices `i_a, i_b, i_c` from this list such that `max(i_a, i_b, i_c) - min(i_a, i_b, i_c)` is minimized.
//
//   Let's think about what `max(i_a, i_b, i_c) - min(i_a, i_b, i_c)` means.
//   If we pick indices `i_k, i_{k+1}, i_{k+2}`, the difference is `i_{k+2} - i_k`.
//   If we pick indices `i_k, i_{k+1}, i_{k+3}`, the difference is `i_{k+3} - i_k`. This is larger than `i_{k+2} - i_k` if `i_{k+3} > i_{k+2}`.
//   If we pick indices `i_k, i_{k+2}, i_{k+3}`, the difference is `i_{k+3} - i_k`.
//   If we pick indices `i_{k+1}, i_{k+2}, i_{k+3}`, the difference is `i_{k+3} - i_{k+1}`.
//
//   Consider the sorted indices `i_1, i_2, i_3, i_4, i_5`.
//   Triplets and their `max - min`:
//   (i_1, i_2, i_3): i_3 - i_1
//   (i_1, i_2, i_4): i_4 - i_1
//   (i_1, i_2, i_5): i_5 - i_1
//   (i_1, i_3, i_4): i_4 - i_1
//   (i_1, i_3, i_5): i_5 - i_1
//   (i_1, i_4, i_5): i_5 - i_1
//   (i_2, i_3, i_4): i_4 - i_2
//   (i_2, i_3, i_5): i_5 - i_2
//   (i_2, i_4, i_5): i_5 - i_2
//   (i_3, i_4, i_5): i_5 - i_3
//
//   We are looking for the minimum value of `i_c - i_a` where `i_a` and `i_c` are two of the three chosen indices, and `i_b` is the third.
//   The smallest difference `i_c - i_a` will be achieved when `i_a` and `i_c` are "close" in the sorted list of indices.
//   If we consider any three indices `i_a < i_b < i_c`, the distance is `2 * (i_c - i_a)`.
//   To minimize this, we need to minimize `i_c - i_a`.
//
//   Consider the sequence of indices `i_1, i_2, ..., i_m`.
//   We want to find `min(i_c - i_a)` over all `a, b, c` distinct, s.t. `nums[i_a] = nums[i_b] = nums[i_c]`.
//   If we fix `i_a` and `i_c`, what is the best `i_b`? Any index between them.
//   The distance is `2 * (i_c - i_a)`.
//   So we just need to find the minimum difference between any two indices for the same value, and pick a third index in between.
//   This interpretation is wrong. We MUST pick THREE distinct indices.
//
//   Let's go back to the definition.
//   Distance = `abs(i - j) + abs(j - k) + abs(k - i)`
//   Let `v` be a value. Its indices are `idx_1, idx_2, ..., idx_m` in sorted order.
//   We are looking for `min_{a, b, c \text{ distinct}} ( abs(idx_a - idx_b) + abs(idx_b - idx_c) + abs(idx_c - idx_a) )`
//
//   Let the chosen indices be `p1 < p2 < p3`. The distance is `(p2 - p1) + (p3 - p2) + (p3 - p1) = 2 * (p3 - p1)`.
//
//   So, for a given value, the problem is to find three indices `i_a, i_b, i_c` such that `max(i_a, i_b, i_c) - min(i_a, i_b, i_c)` is minimized.
//   This means we need to find `min(i_k - i_j)` where `i_k` and `i_j` are two indices for the same value, and there is at least one other index for that value between them.
//
//   Consider the sorted indices `i_1, i_2, ..., i_m`.
//   We want to minimize `i_k - i_j` where `k > j` and there exists an index `i_p` such that `i_j < i_p < i_k`.
//   This means `k > j + 1` or `k > j` and there is an index `i_{j+1}` and `k > j+1`.
//   If we pick `i_a, i_b, i_c` as `i_j, i_{j+1}, i_k` where `j+1 < k`. The distance is `2 * (i_k - i_j)`.
//   If we pick `i_j, i_k, i_l` where `j < k < l`. The distance is `2 * (i_l - i_j)`.
//
//   The crucial insight is that `abs(i - j) + abs(j - k) + abs(k - i) = 2 * (max(i, j, k) - min(i, j, k))` is NOT always true.
//   Let's test this claim with a simple example.
//   Indices: 0, 5, 10. Sorted: a=0, b=5, c=10.
//   Distance = abs(0-5) + abs(5-10) + abs(10-0) = 5 + 5 + 10 = 20.
//   2 * (max - min) = 2 * (10 - 0) = 20. It seems to be true.
//
//   Okay, if `abs(i - j) + abs(j - k) + abs(k - i) = 2 * (max(i, j, k) - min(i, j, k))` is indeed true for any three distinct indices `i, j, k` on a line, then the problem is to find three indices `i_a, i_b, i_c` for the same value such that `max(i_a, i_b, i_c) - min(i_a, i_b, i_c)` is minimized.
//
//   Let the sorted indices for a value be `i_1, i_2, ..., i_m`.
//   We need to find `min(i_k - i_j)` where `i_k` and `i_j` are two chosen indices, and there is at least one other chosen index between them.
//   This means `k > j+1` and `j+1` must be one of the chosen indices, or `k > j` and `j+1` is not chosen but some `i_p` with `j < p < k` is chosen.
//
//   Let's try the sliding window of size 3 on the sorted indices for a specific value.
//   Indices: `i_1, i_2, i_3, i_4, ..., i_m`.
//   Consider the triplet `(i_k, i_{k+1}, i_{k+2})`.
//   `min = i_k`, `max = i_{k+2}`.
//   Distance = `2 * (i_{k+2} - i_k)`.
//   We need to find `min_{k=0 to m-3} ( 2 * (idx_list[k+2] - idx_list[k]) )`.
//
//   Let's test this against the examples:
//   Example 1: nums = [1,2,1,1,3]. Indices of 1: 0, 2, 3.
//   `idx_list = [0, 2, 3]`. Size m=3.
//   k=0: `idx_list[0]=0`, `idx_list[1]=2`, `idx_list[2]=3`.
//   Distance = `2 * (idx_list[2] - idx_list[0]) = 2 * (3 - 0) = 6`.
//   Min distance for 1 is 6. Overall min is 6. Correct.
//
//   Example 2: nums = [1,1,2,3,2,1,2].
//   Indices of 1: 0, 1, 5. `idx_list = [0, 1, 5]`. Size m=3.
//   k=0: `idx_list[0]=0`, `idx_list[1]=1`, `idx_list[2]=5`.
//   Distance = `2 * (idx_list[2] - idx_list[0]) = 2 * (5 - 0) = 10`.
//   Min distance for 1 is 10.
//
//   Indices of 2: 2, 4, 6. `idx_list = [2, 4, 6]`. Size m=3.
//   k=0: `idx_list[0]=2`, `idx_list[1]=4`, `idx_list[2]=6`.
//   Distance = `2 * (idx_list[2] - idx_list[0]) = 2 * (6 - 2) = 8`.
//   Min distance for 2 is 8.
//
//   Overall minimum distance = min(10, 8) = 8. Correct.
//
//   Example with more than 3 occurrences: nums = [5, 5, 5, 5]. Indices: 0, 1, 2, 3.
//   `idx_list = [0, 1, 2, 3]`. Size m=4.
//   k=0: `idx_list[0]=0`, `idx_list[1]=1`, `idx_list[2]=2`. Distance = `2 * (idx_list[2] - idx_list[0]) = 2 * (2 - 0) = 4`.
//   k=1: `idx_list[1]=1`, `idx_list[2]=2`, `idx_list[3]=3`. Distance = `2 * (idx_list[3] - idx_list[1]) = 2 * (3 - 1) = 4`.
//   Minimum distance for 5 is 4.
//
//   This approach seems robust. The key is that the distance `abs(i - j) + abs(j - k) + abs(k - i)` for distinct indices `i, j, k` of the same value is always `2 * (max(i, j, k) - min(i, j, k))`.
//   To minimize this value for a given number, we need to find three indices `i_a, i_b, i_c` such that `max(i_a, i_b, i_c) - min(i_a, i_b, i_c)` is minimized.
//   The minimum span of three elements in a sorted list `i_1, i_2, ..., i_m` is achieved by picking three CONSECUTIVE elements `i_k, i_{k+1}, i_{k+2}`. The span is `i_{k+2} - i_k`. Any other triplet `i_a, i_b, i_c` with `i_a < i_b < i_c` will have `i_c - i_a >= i_{k+2} - i_k` for some `k`. Specifically, if `i_a = i_j` and `i_c = i_k` where `k > j+2`, then `i_k - i_j > i_{j+2} - i_j`. If `k = j+2`, it's the same as the sliding window. If `k < j+2`, it's not possible because we need three elements.
//
//   So, the algorithm is:
//   1. Group indices by value into `std::unordered_map<int, std::vector<int>>`. The vectors will automatically be sorted because we iterate through `nums` linearly.
//   2. Initialize `min_dist = INT_MAX`.
//   3. Iterate through each `(value, indices_list)` pair in the map.
//   4. If `indices_list.size() >= 3`:
//      a. Iterate `i` from `0` to `indices_list.size() - 3`.
//      b. Calculate `current_dist = 2 * (indices_list[i+2] - indices_list[i])`.
//      c. Update `min_dist = std::min(min_dist, current_dist)`.
//   5. If `min_dist == INT_MAX`, return -1. Otherwise, return `min_dist`.
//
//   Time Complexity:
//   - Populating map: O(N)
//   - Iterating map and calculating distances: For each value with `L` occurrences, we do `L-2` calculations. The sum of `L` over all values is `N`. In the worst case, one value appears `N` times. This iteration takes `O(N)`.
//   - Overall Time Complexity: O(N)
//
//   Space Complexity:
//   - For the map: O(N) in the worst case (all unique elements, or one element repeated N times).
//   - Overall Space Complexity: O(N)
//
//   Final check of logic:
//   The distance `abs(i - j) + abs(j - k) + abs(k - i)` where `i, j, k` are distinct indices for the same value.
//   Let `i < j < k`. Distance is `(j - i) + (k - j) + (k - i) = 2 * (k - i)`.
//   This is always `2 * (maximum_index_chosen - minimum_index_chosen)`.
//   To minimize this quantity for a fixed value with sorted indices `i_1, i_2, ..., i_m`, we need to find `min(i_c - i_a)` where `i_a` and `i_c` are two of the three chosen indices, and there is at least one other chosen index `i_b` such that `i_a < i_b < i_c`.
//   The smallest possible difference `i_c - i_a` under this constraint occurs when `i_a, i_b, i_c` are consecutive in the sorted list, i.e., `i_a = i_k`, `i_b = i_{k+1}`, `i_c = i_{k+2}`. In this case, the difference is `i_{k+2} - i_k`.
//   Any other choice of three indices, say `i_a = i_j` and `i_c = i_k` where `k > j+2`, will result in `i_k - i_j > i_{j+2} - i_j` because the list is sorted.
//   So, minimizing `i_c - i_a` with the constraint that there's an intermediate index means finding the minimum difference between `i_k` and `i_{k+2}` for any `k`.
//   This confirms the sliding window approach of size 3.
//
// Implementation details:
// Use `std::unordered_map<int, std::vector<int>>` for mapping.
// Use `std::numeric_limits<int>::max()` for initial `min_dist`.
// Be careful with `INT_MAX` and potential overflows if `2 * (indices_list[i+2] - indices_list[i])` can exceed `INT_MAX`. The constraints `1 <= n <= 10^5` mean indices are up to `10^5 - 1`. The difference is at most `10^5 - 1`. `2 * (10^5 - 1)` is roughly `2 * 10^5`, which fits comfortably in an `int`.

#include <vector>
#include <unordered_map>
#include <cmath>
#include <algorithm>
#include <limits>

class Solution {
public:
    int minDistance(std::vector<int>& nums) {
        // Map to store indices for each unique number.
        // Key: the number, Value: a vector of indices where this number appears.
        std::unordered_map<int, std::vector<int>> val_to_indices;

        // Populate the map with indices.
        // Since we iterate through nums from left to right, the indices in each vector will be sorted.
        for (int i = 0; i < nums.size(); ++i) {
            val_to_indices[nums[i]].push_back(i);
        }

        // Initialize minimum distance to a very large value.
        int min_overall_distance = std::numeric_limits<int>::max();

        // Iterate through each number and its list of indices.
        for (auto const& [val, indices] : val_to_indices) {
            // A good tuple requires at least 3 distinct indices for the same number.
            if (indices.size() >= 3) {
                // For a good tuple (i, j, k) with nums[i] == nums[j] == nums[k],
                // the distance is abs(i - j) + abs(j - k) + abs(k - i).
                // If we sort these indices such that p1 < p2 < p3, the distance becomes:
                // (p2 - p1) + (p3 - p2) + (p3 - p1) = 2 * (p3 - p1).
                // This means the distance is always twice the difference between the maximum and minimum indices chosen for the tuple.
                // To minimize this distance for a given value, we need to find three indices
                // i_a, i_b, i_c such that max(i_a, i_b, i_c) - min(i_a, i_b, i_c) is minimized.
                // This minimum span for three elements in a sorted list i_1, i_2, ..., i_m
                // is achieved by picking three consecutive elements: i_k, i_{k+1}, i_{k+2}.
                // The span is then i_{k+2} - i_k.
                // So, we slide a window of size 3 over the sorted indices list.

                for (size_t i = 0; i <= indices.size() - 3; ++i) {
                    // indices[i] is the smallest index in the current triplet window.
                    // indices[i+2] is the largest index in the current triplet window.
                    int current_distance = 2 * (indices[i+2] - indices[i]);
                    
                    // Update the overall minimum distance found so far.
                    min_overall_distance = std::min(min_overall_distance, current_distance);
                }
            }
        }

        // If min_overall_distance is still its initial large value, it means no good tuple was found.
        if (min_overall_distance == std::numeric_limits<int>::max()) {
            return -1;
        } else {
            return min_overall_distance;
        }
    }
};
```