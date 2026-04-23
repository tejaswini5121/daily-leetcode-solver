// Problem Summary: Calculate the sum of absolute differences between an element's index and all other indices holding the same value.
// Link: https://leetcode.com/problems/sum-of-distances/
// Approach:
// 1. Use a hash map to store the indices for each unique number. The key will be the number, and the value will be an array of indices where that number appears.
// 2. For each unique number, iterate through its list of indices.
// 3. For each index `i` in the list, we need to calculate the sum of `|i - j|` for all other indices `j` in the same list.
// 4. To efficiently calculate this sum, we can use prefix sums. For a given number, let its indices be `[idx_1, idx_2, ..., idx_k]`.
//    If we are at index `idx_p`, the sum of distances to indices before it (`idx_1` to `idx_{p-1}`) is `(idx_p - idx_1) + (idx_p - idx_2) + ... + (idx_p - idx_{p-1})`.
//    This can be rewritten as `(p-1) * idx_p - (idx_1 + idx_2 + ... + idx_{p-1})`.
//    The sum of distances to indices after it (`idx_{p+1}` to `idx_k`) is `(idx_{p+1} - idx_p) + (idx_{p+2} - idx_p) + ... + (idx_k - idx_p)`.
//    This can be rewritten as `(idx_{p+1} + idx_{p+2} + ... + idx_k) - (k-p) * idx_p`.
//    To calculate `(idx_1 + idx_2 + ... + idx_{p-1})` and `(idx_{p+1} + idx_{p+2} + ... + idx_k)` efficiently, we can precompute the prefix sums and suffix sums of the indices for each number.
//    Alternatively, we can iterate through the indices for a given number. For the first occurrence, the sum of distances to subsequent occurrences is `sum(indices[j] - indices[0])` for `j > 0`.
//    For subsequent occurrences `indices[i]`, the sum of distances to previous indices `indices[j]` (`j < i`) can be calculated by taking the previous sum for `indices[i-1]`, subtracting `(indices[i] - indices[i-1])` for each of the `i` previous indices, and adding `(indices[i] - indices[i-1])` for each of the `k-i` subsequent indices.
//    A simpler approach for calculating the sum for a specific index `idx_p`:
//    Let the sorted indices for a number be `indices = [i_0, i_1, ..., i_{m-1}]`.
//    For `i_p`, the sum of distances is:
//    SumLeft = `(i_p - i_0) + (i_p - i_1) + ... + (i_p - i_{p-1})`
//            = `p * i_p - (i_0 + i_1 + ... + i_{p-1})`
//    SumRight = `(i_{p+1} - i_p) + (i_{p+2} - i_p) + ... + (i_{m-1} - i_p)`
//             = `(i_{p+1} + i_{p+2} + ... + i_{m-1}) - (m-1-p) * i_p`
//    We can maintain the sum of elements to the left and the count of elements to the left.
//    Let's refine the prefix sum approach:
//    For a number `x` with indices `[idx_0, idx_1, ..., idx_{k-1}]`:
//    For `idx_i`:
//    Sum of distances = `(idx_i - idx_0) + (idx_i - idx_1) + ... + (idx_i - idx_{i-1}) + (idx_{i+1} - idx_i) + ... + (idx_{k-1} - idx_i)`
//                     = `i * idx_i - (idx_0 + ... + idx_{i-1}) + (idx_{i+1} + ... + idx_{k-1}) - (k-1-i) * idx_i`
//                     = `(i - (k-1-i)) * idx_i - (idx_0 + ... + idx_{i-1}) + (idx_{i+1} + ... + idx_{k-1})`
//                     = `(2*i - k + 1) * idx_i - (prefix_sum_of_indices[i-1]) + (total_sum_of_indices - prefix_sum_of_indices[i])`
//
//    Let's try a simpler O(N) approach:
//    Iterate through the `nums` array once.
//    Maintain a map: `num -> { sum_of_indices, count_of_indices }`.
//    After populating this map, iterate through the `nums` array again.
//    For each `nums[i]`:
//    Let `x = nums[i]`.
//    Let `indices` be the list of all occurrences of `x`.
//    Let `n_x` be the total count of `x`.
//    Let `sum_x` be the sum of all indices where `x` appears.
//    If `i` is the current index of `x` in the original `nums` array:
//    The sum of distances for `nums[i]` is:
//    `left_sum = (count_of_elements_before_i_with_value_x) * i - (sum_of_indices_before_i_with_value_x)`
//    `right_sum = (sum_of_indices_after_i_with_value_x) - (count_of_elements_after_i_with_value_x) * i`
//
//    This still requires knowing the position of `i` within the occurrences of `x`.
//
//    Consider a single number `x` with indices `[p1, p2, p3, ..., pk]`.
//    For index `p1`: sum = `(p2-p1) + (p3-p1) + ... + (pk-p1)`
//    For index `p2`: sum = `(p2-p1) + (p3-p2) + ... + (pk-p2)`
//    For index `p3`: sum = `(p3-p1) + (p3-p2) + (p4-p3) + ... + (pk-p3)`
//
//    Let's compute the result for a specific value `v` appearing at indices `idx_0, idx_1, ..., idx_{k-1}`.
//    We can iterate through these indices.
//    For `idx_i`:
//    The sum of distances to elements before it is `sum_{j=0}^{i-1} (idx_i - idx_j) = i * idx_i - sum_{j=0}^{i-1} idx_j`.
//    The sum of distances to elements after it is `sum_{j=i+1}^{k-1} (idx_j - idx_i) = sum_{j=i+1}^{k-1} idx_j - (k-1-i) * idx_i`.
//
//    We can precompute prefix sums for the indices of each number.
//
//    Algorithm:
//    1. Create a map `indicesMap`: `number -> array of indices`.
//    2. Iterate through `nums` and populate `indicesMap`.
//    3. Create a result array `arr` of the same length as `nums`, initialized to zeros.
//    4. Iterate through each `value` in `indicesMap`:
//       a. Get the list of indices `indices = indicesMap.get(value)`.
//       b. If `indices.length === 1`, continue (no other occurrences).
//       c. Calculate the prefix sums of `indices`. Let `prefixSum[i]` be the sum of `indices[0]` to `indices[i]`.
//       d. For each index `i` in `indices` (from `0` to `indices.length - 1`):
//          i. `current_idx = indices[i]`
//          ii. `count_before = i`
//          iii. `sum_before = (i === 0) ? 0 : prefixSum[i - 1]`
//          iv. `left_distance_sum = count_before * current_idx - sum_before`
//          v. `count_after = indices.length - 1 - i`
//          vi. `total_sum_for_value = prefixSum[indices.length - 1]`
//          vii. `sum_after_current_idx = total_sum_for_value - prefixSum[i]`
//          viii. `right_distance_sum = sum_after_current_idx - count_after * current_idx`
//          ix. `arr[current_idx] = left_distance_sum + right_distance_sum`
//    5. Return `arr`.
//
//    Time Complexity:
//    - Populating `indicesMap`: O(N), where N is the length of `nums`.
//    - Iterating through `indicesMap`: For each unique number, we iterate through its indices. In the worst case, all numbers are the same, and we iterate through N indices. The sum of lengths of all index arrays is N.
//    - For each index list, we calculate prefix sums O(k) and then iterate through it O(k).
//    - Total time for step 4: Sum over all unique numbers `v` of `O(count_v)`, where `count_v` is the number of occurrences of `v`. Since the sum of `count_v` over all unique `v` is N, the total time for this step is O(N).
//    - Overall Time Complexity: O(N).
//
//    Space Complexity:
//    - `indicesMap`: In the worst case, if all numbers are unique, this stores N entries. If all numbers are the same, it stores one entry with N indices. So, O(N).
//    - `arr`: O(N) for the result array.
//    - Prefix sum arrays within the loop: At any given time, we are only processing one value's indices, so the space for prefix sums is O(k) where k is the max number of occurrences of any single value. This is at most O(N).
//    - Overall Space Complexity: O(N).

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var getDistances = function(nums) {
    // Map to store indices for each unique number.
    // Key: number, Value: array of indices where the number appears.
    const indicesMap = new Map();

    // Populate the indicesMap.
    // Iterate through the input array nums.
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        // If the number is already in the map, push the current index to its list.
        if (indicesMap.has(num)) {
            indicesMap.get(num).push(i);
        } else {
            // If the number is not in the map, create a new entry with a list containing the current index.
            indicesMap.set(num, [i]);
        }
    }

    // Initialize the result array with zeros.
    const arr = new Array(nums.length).fill(0);

    // Iterate through each unique number and its list of indices.
    for (const [value, indices] of indicesMap.entries()) {
        // If a number appears only once, there are no other occurrences, so its contribution to distances is 0.
        if (indices.length <= 1) {
            continue;
        }

        // Calculate prefix sums for the indices of the current number.
        // prefixSum[i] will store the sum of indices[0] through indices[i].
        const prefixSum = new Array(indices.length).fill(0);
        prefixSum[0] = indices[0];
        for (let i = 1; i < indices.length; i++) {
            prefixSum[i] = prefixSum[i - 1] + indices[i];
        }

        // Calculate the sum of distances for each index where the current number appears.
        for (let i = 0; i < indices.length; i++) {
            const current_idx = indices[i]; // The current index in the original nums array.
            const count_before = i; // Number of occurrences of 'value' before the current index.
            // Sum of indices before the current index. If i is 0, sum_before is 0.
            const sum_before = (i === 0) ? 0 : prefixSum[i - 1];

            // Calculate the sum of distances to all indices *before* the current index.
            // This is (current_idx - indices[0]) + (current_idx - indices[1]) + ... + (current_idx - indices[i-1])
            // which simplifies to count_before * current_idx - sum_before.
            const left_distance_sum = count_before * current_idx - sum_before;

            const count_after = indices.length - 1 - i; // Number of occurrences of 'value' after the current index.
            // The total sum of all indices for this 'value'.
            const total_sum_for_value = prefixSum[indices.length - 1];
            // The sum of indices after the current index.
            // This is total_sum_for_value - prefixSum[i] (which is sum of indices[0]..indices[i]).
            const sum_after_current_idx = total_sum_for_value - prefixSum[i];

            // Calculate the sum of distances to all indices *after* the current index.
            // This is (indices[i+1] - current_idx) + (indices[i+2] - current_idx) + ... + (indices[k-1] - current_idx)
            // which simplifies to sum_after_current_idx - count_after * current_idx.
            const right_distance_sum = sum_after_current_idx - count_after * current_idx;

            // The total sum of distances for the element at arr[current_idx] is the sum of distances to elements before and after it.
            arr[current_idx] = left_distance_sum + right_distance_sum;
        }
    }

    // Return the final array containing the sum of distances for each element.
    return arr;
};
```