```cpp
// Problem: Closest Equal Element Queries
// Problem Link: https://leetcode.com/problems/closest-equal-element-queries/
// Approach:
// We need to efficiently find the closest equal element for each query in a circular array.
// For each number in `nums`, we can store all its indices in a sorted list.
// A hash map (unordered_map in C++) is suitable for this, where keys are the numbers and values are sorted vectors of their indices.
// After pre-processing, for each query `queries[i]`:
// 1. Get the value `val = nums[queries[i]]`.
// 2. Get the list of indices `indices` for `val` from the hash map.
// 3. If `indices` has only one element (which is `queries[i]` itself), then no other equal element exists, return -1.
// 4. Otherwise, we need to find the closest index in `indices` to `queries[i]`.
//    Since `indices` is sorted, we can use binary search (`lower_bound`) to find the position of `queries[i]` (or the first element greater than or equal to it).
//    Let `it` be the iterator returned by `lower_bound`.
//    - If `*it` is exactly `queries[i]`, then `it` points to the current element's index.
//      - We check the element before `it` (if `it` is not the beginning) and the element after `it` (if `it` is not the end) to find the minimum distance.
//      - The circular distance needs to be calculated: `min(abs(current_index - other_index), n - abs(current_index - other_index))`, where `n` is the length of `nums`.
//    - If `*it` is greater than `queries[i]`, then `it` points to the first element greater than `queries[i]`.
//      - We check the element before `it` (if `it` is not the beginning) and `*it` (if `it` is not the end) for the minimum distance.
// 5. The minimum of these circular distances is the answer for the current query.
// Time Complexity:
// - Pre-processing: O(N log N) in the worst case if all elements are the same and we need to sort the indices, but typically O(N) on average for hash map insertion and then O(N log K) where K is the maximum number of occurrences of any element if we sort each list. More precisely, if we just store them and they happen to be sorted, it's O(N). If we need to sort, it's Sum(Ni log Ni) where Ni is the count of each number. In the worst case, if all numbers are the same, this is N log N. If numbers are unique, this is N.
// - Querying: For each query, binary search on a list of indices takes O(log K) where K is the number of occurrences of that element. Since there are Q queries, the total query time is O(Q log K_max), where K_max is the maximum number of occurrences of any element.
// - Overall: O(N + Q log N) or O(N log N + Q log N) depending on whether sorting is needed for indices. Given constraints, N log N is dominant for pre-processing if needed. O(N + Q log N) is a more accurate general bound if indices are added in order.
// Space Complexity:
// - O(N) to store the indices of each number in the hash map.
//
class Solution {
public:
    std::vector<int> closestDistance(std::vector<int>& nums, std::vector<int>& queries) {
        int n = nums.size();
        // Map to store indices for each number. Key: number, Value: sorted list of indices.
        std::unordered_map<int, std::vector<int>> val_to_indices;

        // Populate the map with indices for each number.
        for (int i = 0; i < n; ++i) {
            val_to_indices[nums[i]].push_back(i);
        }

        std::vector<int> answer;
        answer.reserve(queries.size()); // Reserve space for efficiency

        for (int query_idx : queries) {
            int current_val = nums[query_idx];
            const auto& indices = val_to_indices[current_val];

            // If there's only one occurrence of this value, no other equal element exists.
            if (indices.size() == 1) {
                answer.push_back(-1);
                continue;
            }

            int min_dist = n; // Initialize with a value larger than any possible distance

            // Find the position of query_idx in the sorted list of indices for current_val.
            // lower_bound returns an iterator to the first element not less than query_idx.
            auto it = std::lower_bound(indices.begin(), indices.end(), query_idx);

            // Check the element at `it` (if `it` is not the end)
            if (it != indices.end()) {
                int other_idx = *it;
                // Calculate circular distance
                int dist = std::min(std::abs(query_idx - other_idx), n - std::abs(query_idx - other_idx));
                min_dist = std::min(min_dist, dist);
            }

            // Check the element before `it` (if `it` is not the beginning)
            if (it != indices.begin()) {
                // Move iterator back to the previous element
                --it;
                int other_idx = *it;
                // Calculate circular distance
                int dist = std::min(std::abs(query_idx - other_idx), n - std::abs(query_idx - other_idx));
                min_dist = std::min(min_dist, dist);
            }

            // If min_dist is still n, it means something went wrong or no valid index was found.
            // This case should be covered by the indices.size() == 1 check, but as a safeguard.
            if (min_dist == n) {
                 answer.push_back(-1);
            } else {
                 answer.push_back(min_dist);
            }
        }

        return answer;
    }
};
```