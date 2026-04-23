```cpp
/*
 * Problem Summary: Calculate the sum of absolute differences between an element's index
 * and all other indices with the same value.
 *
 * Problem Link: https://leetcode.com/problems/sum-of-distances/
 *
 * Approach:
 * The problem asks us to calculate, for each element nums[i], the sum of |i - j| for all j
 * where nums[j] == nums[i] and j != i.
 *
 * A naive approach would be to iterate through the array for each element, find all other
 * occurrences of the same number, and sum the absolute differences. This would be O(N^2),
 * which is too slow given the constraints.
 *
 * A more efficient approach involves grouping indices by their values. We can use a hash map
 * (std::unordered_map in C++) to store a list of indices for each unique number in `nums`.
 *
 * For each unique number, let's say its indices are [idx1, idx2, ..., idxk] in increasing order.
 * For an index `idxi` in this list, the sum of distances to all other indices with the same
 * number is:
 * |idxi - idx1| + |idxi - idx2| + ... + |idxi - idxi-1| + |idxi - idxi+1| + ... + |idxi - idxk|
 *
 * Since the indices are sorted, this simplifies to:
 * (idxi - idx1) + (idxi - idx2) + ... + (idxi - idxi-1) + (idxi+1 - idxi) + ... + (idxk - idxi)
 *
 * We can split this sum into two parts:
 * 1. Sum of distances to indices before `idxi`:
 *    (idxi - idx1) + (idxi - idx2) + ... + (idxi - idxi-1)
 *    = (idxi * (i-1)) - (idx1 + idx2 + ... + idxi-1)
 *    This is `idxi * (number of preceding indices)` - `sum of preceding indices`.
 *
 * 2. Sum of distances to indices after `idxi`:
 *    (idxi+1 - idxi) + (idxi+2 - idxi) + ... + (idxk - idxi)
 *    = (idx1+1 + idx2+1 + ... + idxk) - (idxi * (k-i))
 *    This is `sum of succeeding indices` - `idxi * (number of succeeding indices)`.
 *
 * To efficiently calculate these sums, we can use prefix sums.
 *
 * Algorithm:
 * 1. Create a hash map `val_to_indices` where keys are the numbers in `nums` and values are vectors
 *    of indices where that number appears.
 * 2. Iterate through `nums` and populate `val_to_indices`.
 * 3. Initialize an answer array `arr` of the same size as `nums`, filled with zeros.
 * 4. Iterate through each entry (value, list of indices) in `val_to_indices`.
 *    a. For each list of indices `indices_list` for a given value:
 *       i. If `indices_list` has only one element, there are no other occurrences, so the sum of distances is 0. Continue.
 *       ii. Calculate the prefix sum of indices: `prefix_sum_indices[i] = indices_list[0] + ... + indices_list[i]`.
 *       iii. The total sum of all indices for this value can be found from the last element of `prefix_sum_indices`.
 *       iv. Iterate through `indices_list` from `i = 0` to `indices_list.size() - 1`. Let the current index be `current_idx = indices_list[i]`.
 *           - Number of elements before `current_idx`: `left_count = i`.
 *           - Sum of indices before `current_idx`: `left_sum = (i > 0) ? prefix_sum_indices[i-1] : 0`.
 *           - Sum of distances to elements before `current_idx`: `left_dist = (long long)current_idx * left_count - left_sum`.
 *
 *           - Number of elements after `current_idx`: `right_count = indices_list.size() - 1 - i`.
 *           - Sum of indices after `current_idx`: `right_sum = prefix_sum_indices.back() - left_sum`. (This is the total sum minus the sum of elements up to and including `current_idx`).
 *           - Sum of distances to elements after `current_idx`: `right_dist = right_sum - (long long)current_idx * right_count`.
 *
 *           - The total sum of distances for `current_idx` is `left_dist + right_dist`.
 *           - Store this sum in `arr[current_idx]`.
 *
 * Time Complexity:
 * - Populating the hash map: O(N), where N is the length of `nums`.
 * - Iterating through unique values: In the worst case, all elements are unique, leading to N entries.
 * - For each unique value, we iterate through its indices. The total number of indices processed across all unique values is N.
 * - Calculating prefix sums for each group of indices: For a group of size K, this is O(K). Summing over all groups, this is O(N).
 * - Calculating distances for each index within its group: For a group of size K, this is O(K). Summing over all groups, this is O(N).
 * - Overall time complexity: O(N).
 *
 * Space Complexity:
 * - `val_to_indices` hash map: In the worst case, stores N indices, so O(N).
 * - `arr` result array: O(N).
 * - `prefix_sum_indices` temporary array: In the worst case, for a number that appears N times, this is O(N).
 * - Overall space complexity: O(N).
 */

#include <vector>
#include <numeric>
#include <unordered_map>

class Solution {
public:
    std::vector<long long> getDistances(std::vector<int>& nums) {
        int n = nums.size();
        // Use long long for the result array to handle potentially large sums.
        std::vector<long long> arr(n, 0);
        // Map to store indices for each unique number.
        // Key: number from nums
        // Value: vector of indices where this number appears
        std::unordered_map<int, std::vector<int>> val_to_indices;

        // Populate the hash map with indices for each number.
        for (int i = 0; i < n; ++i) {
            val_to_indices[nums[i]].push_back(i);
        }

        // Iterate through each unique number and its corresponding indices.
        for (auto const& [val, indices_list] : val_to_indices) {
            // If a number appears only once, there are no other occurrences,
            // so the sum of distances is 0, which is already initialized in `arr`.
            if (indices_list.size() <= 1) {
                continue;
            }

            // Calculate prefix sums of indices for the current group.
            // prefix_sum_indices[i] will store the sum of indices_list[0]...indices_list[i]
            std::vector<long long> prefix_sum_indices(indices_list.size());
            prefix_sum_indices[0] = indices_list[0];
            for (size_t i = 1; i < indices_list.size(); ++i) {
                prefix_sum_indices[i] = prefix_sum_indices[i - 1] + indices_list[i];
            }

            // Get the total sum of all indices for this number.
            long long total_sum_of_indices = prefix_sum_indices.back();

            // Calculate the sum of distances for each index in the group.
            for (size_t i = 0; i < indices_list.size(); ++i) {
                int current_idx = indices_list[i];
                long long current_sum_dist = 0;

                // Calculate distances to indices before the current one.
                // Number of elements before current_idx: `i`
                // Sum of indices before current_idx: `left_sum`
                long long left_count = i;
                long long left_sum = (i > 0) ? prefix_sum_indices[i - 1] : 0;
                // Sum of distances = (current_idx - idx_0) + ... + (current_idx - idx_{i-1})
                // = (current_idx * i) - (idx_0 + ... + idx_{i-1})
                long long left_dist = (long long)current_idx * left_count - left_sum;

                // Calculate distances to indices after the current one.
                // Number of elements after current_idx: `indices_list.size() - 1 - i`
                // Sum of indices after current_idx: `right_sum`
                long long right_count = indices_list.size() - 1 - i;
                // The sum of all indices in the group is `total_sum_of_indices`.
                // The sum of indices up to and including the current one is `prefix_sum_indices[i]`.
                // So, the sum of indices after the current one is `total_sum_of_indices - prefix_sum_indices[i]`.
                long long right_sum = total_sum_of_indices - prefix_sum_indices[i];
                // Sum of distances = (idx_{i+1} - current_idx) + ... + (idx_k - current_idx)
                // = (idx_{i+1} + ... + idx_k) - (current_idx * (k-i))
                long long right_dist = right_sum - (long long)current_idx * right_count;

                // Total sum of distances for nums[current_idx]
                current_sum_dist = left_dist + right_dist;

                // Store the calculated sum in the result array at the original index.
                arr[current_idx] = current_sum_dist;
            }
        }

        return arr;
    }
};
```