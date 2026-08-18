// Problem: Find the Largest Almost Missing Integer
// Link: https://leetcode.com/problems/find-the-largest-almost-missing-integer/
//
// Approach:
// We need to count how many subarrays of size k each integer appears in.
// We can iterate through all possible subarrays of size k. For each subarray,
// we can use a frequency map (or a hash table) to keep track of the count
// of each number within that subarray. However, this would be inefficient
// because we need the *total* count of occurrences in *all* subarrays of size k.
//
// A more efficient approach is to realize that an integer `x` at index `i`
// contributes to subarrays of size `k` that start from `max(0, i - k + 1)`
// up to `i`.
//
// We can use a map `countMap` to store the number of subarrays of size k
// that each integer appears in.
//
// We can iterate through all possible starting positions of subarrays of size k.
// For each subarray, we iterate through its elements and increment the count
// for that element in our `countMap`.
//
// After counting the occurrences for all elements in all subarrays, we iterate
// through the `countMap` to find the largest integer whose count is exactly 1.
// If no such integer exists, we return -1.
//
// Time Complexity:
// Let N be the length of nums. There are N - k + 1 subarrays of size k.
// For each subarray, we iterate through k elements.
// So, the total number of operations to populate the countMap is approximately (N - k + 1) * k.
// Iterating through the countMap takes O(V) time, where V is the number of distinct
// values in nums (at most 51 in this problem, since nums[i] <= 50).
// Therefore, the overall time complexity is O(N*k). Given the constraints N <= 50 and k <= N,
// this is roughly O(N^2), which is acceptable.
//
// Space Complexity:
// We use a map to store the counts of each number. In the worst case, all numbers
// in nums are distinct. Since nums[i] <= 50, the maximum number of distinct values
// is 51. So, the space complexity is O(V), where V is the number of distinct values,
// which is O(1) given the constraints on nums[i].

#include <vector>
#include <map>
#include <algorithm>

class Solution {
public:
    int largestAlmostMissingInteger(std::vector<int>& nums, int k) {
        // Map to store the count of subarrays of size k that each integer appears in.
        // Key: integer, Value: count of subarrays of size k it appears in.
        std::map<int, int> subarray_counts;

        int n = nums.size();

        // Iterate through all possible starting positions of subarrays of size k.
        for (int i = 0; i <= n - k; ++i) {
            // For each subarray starting at index i and of length k:
            // Create a set to store unique elements within this current subarray.
            // This is to avoid counting the same number multiple times if it appears
            // more than once within a *single* subarray. We only care if the number
            // *exists* in the subarray.
            std::map<int, bool> current_subarray_elements;
            for (int j = 0; j < k; ++j) {
                int current_num = nums[i + j];
                current_subarray_elements[current_num] = true;
            }

            // Now, for each unique element found in the current subarray,
            // increment its count in the global `subarray_counts` map.
            for (auto const& [num, exists] : current_subarray_elements) {
                subarray_counts[num]++;
            }
        }

        // Find the largest integer that appears in exactly one subarray of size k.
        int largest_almost_missing = -1;

        // Iterate through the `subarray_counts` map.
        // Maps iterate in ascending order of keys. To find the largest,
        // we can either iterate in reverse or keep track of the maximum found so far.
        // Iterating from the end of the map (if we had a reverse map or iterated backwards)
        // would be slightly more direct for finding the LARGEST.
        // Since std::map is ordered, we can iterate and keep track of the max.

        // Alternatively, we can iterate through the original nums to consider only numbers present in nums
        // and check their counts. This ensures we only check numbers that actually exist.
        // And since we want the LARGEST, we can iterate through nums in reverse order.
        std::sort(nums.begin(), nums.end(), std::greater<int>()); // Sort in descending order

        for (int num : nums) {
            // Check if the number exists in our count map and if its count is exactly 1.
            if (subarray_counts.count(num) && subarray_counts[num] == 1) {
                // If it is, and it's larger than our current largest_almost_missing, update it.
                // Since we are iterating in descending order, the first one we find will be the largest.
                largest_almost_missing = num;
                break; // Found the largest, so we can stop.
            }
        }

        return largest_almost_missing;
    }
};
